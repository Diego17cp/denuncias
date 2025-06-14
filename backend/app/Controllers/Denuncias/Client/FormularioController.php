<?php

namespace App\Controllers\Denuncias\Client;

use App\Controllers\BaseController;
use App\Models\Denuncias\AdjuntosModel;
use App\Models\Denuncias\DenunciadosModel;
use App\Models\Denuncias\DenunciasModel;
use App\Models\Denuncias\DenunciantesModel;
use App\Models\Denuncias\MotivosModel;
use App\Models\Denuncias\SeguimientoDenunciasModel;
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
        // Obtener datos del formulario
        $dataJson = $this->request->getPost('data');
        $formData = json_decode($dataJson, true);

        // Extraer datos del JSON
        $denunciante = $formData['denunciante'];
        $denunciado = $formData['denunciado'];
        $denuncia = $formData['denuncia'];
        $adjuntos = $formData['adjuntos'];

        // Generar ID y tracking code
        $code = $this->generateTrackingCode();
        $id_denunciante = $denuncia['es_anonimo'] ? null : $this->generateId('denunciantes');
        $id_denunciado = $this->generateId('denunciados');
        $id_denuncia = $this->generateId('denuncias');
        $id_seguimiento = $this->generateId('seguimientoDenuncias');

        // Si la denuncia ya se encuentra registrada, no se puede volver a registrar
        if ($this->denunciasModel->where('tracking_code', $code)->first()) {
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Denuncia ya registrada previamente',
                'tracking_code' => $code,
            ]);
        }

        // Mandar correo con el código de seguimiento
        if (!$denuncia['es_anonimo']) {
            $this->correo($denunciante['email'], $code);
        }

        // Insert denunciante
        if ($denunciante) {
            $this->denunciantesModel->insertDenunciante([
                'id' => $id_denunciante,
                'nombres' => $denunciante['nombres'],
                'email' => $denunciante['email'],
                'telefono' => $denunciante['telefono'],
                'numero_documento' => $denunciante['numero_documento'],
                'tipo_documento' => $denunciante['tipo_documento'],
                'sexo' => $denunciante['sexo']
            ]);
        }

        // Insert denunciado
        if ($denunciado) {
            $this->denunciadosModel->insertDenunciado([
                'id' => $id_denunciado,
                'nombre' => $denunciado['nombre'],
                'numero_documento' => $denunciado['numero_documento'],
                'tipo_documento' => $denunciado['tipo_documento'],
                'representante_legal' => $denunciado['representante_legal'],
                'razon_social' => $denunciado['razon_social'],
                'cargo' => $denunciado['cargo']
            ]);
        }

        // Insert denuncia
        if ($denuncia) {
            $this->denunciasModel->insertDenuncia([
                'id' => $id_denuncia,
                'tracking_code' => $code,
                'es_anonimo' => $denuncia['es_anonimo'],
                'denunciante_id' => $id_denunciante,
                'motivo_id' => $denuncia['motivo_id'],
                'motivo_otro' => $denuncia['motivo_otro'],
                'descripcion' => $denuncia['descripcion'],
                'fecha_incidente' => $denuncia['fecha_incidente'],
                'denunciado_id' => $id_denunciado,
                'estado' => 'registrado',
                'pdf_path' => null
            ]);
        }

        // Guardar archivo
        $files = $this->request->getFiles();
        $uploadPath = FCPATH . 'uploads/' . $id_denuncia;
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        // Insert adjuntos
        foreach ($files as $file) {
            if ($file->isValid() && !$file->hasMoved()) {
                $newName = $file->getRandomName();
                $file->move($uploadPath, $newName);
                $fileType = $file->getClientMimeType();
                $this->adjuntosModel->insertAdjunto([
                    'id' => $this->generateId('adjuntos'),
                    'denuncia_id' => $id_denuncia,
                    'file_path' => 'uploads/' . $id_denuncia . '/' . $newName,
                    'file_name' => $file->getClientName(),
                    'file_type' => $fileType,
                ]);
            }
        }

        // Insert seguimiento
        $this->seguimientoDenunciasModel->insertSeguimiento([
            'id' => $id_seguimiento,
            'denuncia_id' => $id_denuncia,
            'estado' => 'registrado',
            'comentario' => 'Denuncia registrada',
            'fecha_actualizacion' => date('Y-m-d H:i:s', strtotime('-5 hours'))
        ]);

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
