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
use CodeIgniter\RESTful\ResourceController;

class FormularioController extends ResourceController
{
    private $adjuntosModel;
    private $denunciadosModel;
    private $denunciasModel;
    private $denunciantesModel;
    private $motivosModel;
    private $seguimientoDenunciasModel;
    private $email;
    protected $format = 'json';


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
    // public function generateTrackingCode()
    // {
    //     do {
    //         $trackingCode = 'TD' . strtoupper(bin2hex(random_bytes(9)));
    //     } while ($this->denunciasModel->where('tracking_code', $trackingCode)->first());
    //     return $trackingCode;
    // }
    public function correo($correo, $code)
    {
        // Cargar la librería de correo
        $this->email->setFrom('munijloenlinea@gmail.com',   'Municipalidad Distrital de José Leonardo Ortiz');
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

public function create()
    {
        $data  = $this->request->getPost();
        $files = $this->request->getFiles();

        $result = $this->denunciasModel->createDenuncia($data, $files);

        return $this->respond($result);
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
