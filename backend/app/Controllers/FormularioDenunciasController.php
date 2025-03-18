<?php

namespace App\Controllers;
use CodeIgniter\RESTful\ResourceController;
use App\Models\AdjuntosModel;
use App\Models\DenunciadosModel;
use App\Models\DenunciasModel;
use App\Models\DenunciantesModel;
use App\Models\MotivosModel;
use App\Models\Seguimiento_denunciasModel;

class FormularioDenunciasController extends ResourceController
{
    private $adjuntosModel;
    private $denunciadosModel;
    private $denunciasModel;
    private $denunciantesModel;
    private $motivosModel;
    private $seguimientoDenunciasModel;
    function __construct()
    {
        $this->adjuntosModel = new AdjuntosModel();
        $this->denunciadosModel = new DenunciadosModel();
        $this->denunciasModel = new DenunciasModel();
        $this->denunciantesModel = new DenunciantesModel();
        $this->motivosModel = new MotivosModel();
        $this->seguimientoDenunciasModel = new Seguimiento_denunciasModel();
    }
    function index()
    {
        return $this->respond($this->motivosModel->findAll());
    }
    function  create()
    {
        $formData = $this->request->getJSON(true);
        $denunciante = $formData['denunciante'];
        $denunciado = $formData['denunciado'];
        $motivos = $formData['motivos'];
        $denuncia = $formData['denuncia'];
        $adjuntos = $formData['adjuntos'];
    }
}