<?php

namespace App\Controllers\denuncias_corrupcion\Denuncias\Client;

use App\Controllers\BaseController;
use App\Models\denuncias_corrupcion\Denuncias\AdjuntosModel;
use App\Models\denuncias_corrupcion\Denuncias\DenunciadosModel;
use App\Models\denuncias_corrupcion\Denuncias\DenunciasModel;
use App\Models\denuncias_corrupcion\Denuncias\DenunciantesModel;
use App\Models\denuncias_corrupcion\Denuncias\MotivosModel;
use App\Models\denuncias_corrupcion\Denuncias\SeguimientoDenunciasModel;
use CodeIgniter\Config\Services;

class FormularioController extends BaseController
{
    private $adjuntosModel;
    private $denunciadosModel;
    private $denunciasModel;
    private $denunciantesModel;
    private $motivosModel;
    private $seguimientoDenunciasModel;
    private $email;
    function __construct()
    {
        $this->adjuntosModel = new AdjuntosModel();
        $this->denunciadosModel = new DenunciadosModel();
        $this->denunciasModel = new DenunciasModel();
        $this->denunciantesModel = new DenunciantesModel();
        $this->motivosModel = new MotivosModel();
        $this->seguimientoDenunciasModel = new SeguimientoDenunciasModel();
        $this->email = Services::email();
    }
    function index()
    {
        $data = $this->motivosModel->findAll();
        return $this->response->setJSON($data);
    }
    public function generateId($table)
    {
        $prefixes = [
            'denuncias' => 'de',
            'denunciantes' => 'dn',
            'denunciados' => 'de',
            'adjuntos' => 'ad',
            'seguimientoDenuncias' => 'sd'
        ];
        if (!isset($prefixes[$table])) {
            throw new \InvalidArgumentException("Invalid table name: $table");
        }
        $model = $this->{$table . 'Model'};
        $prefix = $prefixes[$table];
        do {
            $uuid = $prefix . substr(bin2hex(random_bytes(6)), 0, 6);
        } while ($model->where('id', $uuid)->first());
        return $uuid;
    }
    public function generateTrackingCode()
    {
        do {
            $trackingCode = 'TD' . strtoupper(bin2hex(random_bytes(9)));
        } while ($this->denunciasModel->where('tracking_code', $trackingCode)->first());
        return $trackingCode;
    }
    public function correo($correo, $code)
    {
        // Cargar la librería de correo
        $this->email->setFrom('munijloenlinea@gmail.com', 'Municipalidad Distrital de José Leonardo Ortiz');
        $this->email->setTo($correo);
        $this->email->setSubject('Código de Seguimiento de Denuncia');
        $this->email->setMessage("
            <html>
            <head>
                <title>Código de Seguimiento de Denuncia</title>
            </head>
            <body style='font-family: Asap, sans-serif;'>
                <p>Estimado usuario,</p>
                <p>Su denuncia ha sido registrada exitosamente. A continuación, le proporcionamos su código de seguimiento:</p>
                <p 
                    style=
                    'font-size: 18px; 
                    font-weight: bold; 
                    color: #2E8ACB; 
                    padding:15px; 
                    background-color: #CDDFEC';>$code</p>
                <p>Por favor, conserve este código para futuras consultas.</p>
                <p>Para realizar el seguimiento de su denuncia, puede ingresar al siguiente enlace:</p>
                <p><a href='http://localhost:5173/tracking-denuncia?codigo=$code'>Seguimiento</a></p>
                <p>Atentamente,</p>
                <p><strong>Municipalidad Distrital de José Leonardo Ortiz</strong></p>
            </body>
            </html>
        ");

        return $this->email->send();
    }
    function create()
    {
        $db = \Config\Database::connect();
        $dataJson = $this->request->getPost('data');
        $formData = json_decode($dataJson, true);

        $denunciante = $formData['denunciante'] ?? null;
        $denunciado  = $formData['denunciado'] ?? null;
        $denuncia    = $formData['denuncia'] ?? null;

        $code = $this->generateTrackingCode();
        $id_denunciante = null;
        $id_denunciado  = null;
        $id_denuncia    = null;

        // Start transaction
        $db->transStart();

        // Insert denunciante (mapear campos a los que el modelo espera)
        if ($denunciante) {
            $denuncianteData = [
                'nombre'        => $denunciante['nombres'] ?? null,
                'documento'     => $denunciante['numero_documento'] ?? null,
                'tipo_documento'=> strtoupper($denunciante['tipo_documento'] ?? null),
                'email'         => $denunciante['email'] ?? null,
                'telefono'      => $denunciante['telefono'] ?? null,
                'celular'       => $denunciante['celular'] ?? ($denunciante['telefono'] ?? null),
                'sexo'          => $denunciante['sexo'] ?? null,
                'direccion'     => $denunciante['direccion'] ?? null,
                'distrito'      => $denunciante['distrito'] ?? null,
                'provincia'     => $denunciante['provincia'] ?? null,
                'departamento'  => $denunciante['departamento'] ?? null,
            ];

            $this->denunciantesModel->insertDenunciante($denuncianteData);
            if ($errors = $this->denunciantesModel->errors()) {
                $db->transRollback();
                return $this->response->setJSON(['success' => false, 'message' => 'Error creando denunciante', 'errors' => $errors])->setStatusCode(422);
            }
            $id_denunciante = $this->denunciantesModel->getInsertID();
        }

        // Insert denunciado (mapear campos)
        if ($denunciado) {
            $denunciadoData = [
                'nombre'             => $denunciado['nombre'] ?? null,
                'documento'          => $denunciado['numero_documento'] ?? null,
                'tipo_documento'     => strtoupper($denunciado['tipo_documento'] ?? null),
                'representante_legal'=> $denunciado['representante_legal'] ?? null,
                'razon_social'       => $denunciado['razon_social'] ?? null,
                'direccion'          => $denunciado['direccion'] ?? null,
                'celular'            => $denunciado['celular'] ?? ($denunciado['telefono'] ?? null),
            ];

            $this->denunciadosModel->insertDenunciado($denunciadoData);
            if ($errors = $this->denunciadosModel->errors()) {
                $db->transRollback();
                return $this->response->setJSON(['success' => false, 'message' => 'Error creando denunciado', 'errors' => $errors])->setStatusCode(422);
            }
            $id_denunciado = $this->denunciadosModel->getInsertID();
        }

        // Insert denuncia (mapear campos)
        if ($denuncia) {
            $denunciaData = [
                'tracking_code'   => $code,
                'es_anonimo'      => isset($denuncia['es_anonimo']) ? (int)$denuncia['es_anonimo'] : 0,
                'denunciante_id'  => $id_denunciante,
                'denunciado_id'   => $id_denunciado,
                'estado'          => 'registrado',
                'fecha_incidente' => $denuncia['fecha_incidente'] ?? null,
                'lugar'           => $denuncia['lugar'] ?? null,
                'motivo_id'       => $denuncia['motivo_id'] ?? null,
                'motivo_otro'     => $denuncia['motivo_otro'] ?? null,
                'descripcion'     => $denuncia['descripcion'] ?? null,
                'area'            => $denuncia['area'] ?? 'corrupcion',
            ];

            $this->denunciasModel->insertDenuncia($denunciaData);
            if ($errors = $this->denunciasModel->errors()) {
                $db->transRollback();
                return $this->response->setJSON(['success' => false, 'message' => 'Error creando denuncia', 'errors' => $errors])->setStatusCode(422);
            }
            $id_denuncia = $this->denunciasModel->getInsertID();
        }

        // Si no se creó la denuncia, rollback y error
        if (empty($id_denuncia) || $id_denuncia == 0) {
            $db->transRollback();
            return $this->response->setJSON(['success' => false, 'message' => 'No se pudo generar ID de denuncia'])->setStatusCode(500);
        }

        // Subir archivos e insertar adjuntos
        $files = $this->request->getFiles();
        $uploadPath = FCPATH . 'uploads/' . $id_denuncia;
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }
        foreach ($files as $file) {
            if ($file->isValid() && !$file->hasMoved()) {
                $newName = $file->getRandomName();
                $file->move($uploadPath, $newName);
                $this->adjuntosModel->insertAdjunto([
                    'denuncia_id' => $id_denuncia,
                    'file_path'   => 'uploads/' . $id_denuncia . '/' . $newName,
                ]);
                if ($errors = $this->adjuntosModel->errors()) {
                    $db->transRollback();
                    return $this->response->setJSON(['success' => false, 'message' => 'Error guardando adjunto', 'errors' => $errors])->setStatusCode(422);
                }
            }
        }

        // Insert seguimiento
        // $this->seguimientoDenunciasModel->insertSeguimiento([
        //     'denuncia_id' => $id_denuncia,
        //     'administrador_id' => null,
        //     'estado' => 'registrado',
        //     'comentario' => 'Denuncia registrada',
        // ]);
        // if ($errors = $this->seguimientoDenunciasModel->errors()) {
        //     $db->transRollback();
        //     return $this->response->setJSON(['success' => false, 'message' => 'Error creando seguimiento', 'errors' => $errors])->setStatusCode(422);
        // }

        $db->transComplete();
        if ($db->transStatus() === false) {
            return $this->response->setJSON(['success' => false, 'message' => 'Error en transacción'])->setStatusCode(500);
        }

        // Enviar correo si aplica (no parte de la transacción)
        if (!$denuncia['es_anonimo'] ?? false) {
            $this->correo($denunciante['email'] ?? null, $code);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Denuncia registrada correctamente',
            'tracking_code' => $code,
        ]);
    }
    function query($code)
    {
        // Fetch denuncia by tracking code
        $denuncia = $this->denunciasModel->getDenunciaByTrackingCode($code);

        if (!$denuncia) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No se encontró la denuncia con el código proporcionado.'
            ]);
        }

        // Fetch seguimientos by denuncia ID
        $seguimientos = $this->seguimientoDenunciasModel->getSeguimientosByDenunciaId($denuncia['id']);

        return $this->response->setJSON([
            'success' => true,
            'data' => $seguimientos
        ]);
    }
    public function checkConnection()
    {
        try {
            $db = \Config\Database::connect();
            if ($db->connect()) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Conexión exitosa a la base de datos.'
                ]);
            }
        } catch (\Throwable $e) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al conectar con la base de datos.',
                'error' => $e->getMessage()
            ]);
        }
    }
}
