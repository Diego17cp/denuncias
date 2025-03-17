<?php

namespace App\Models;

use CodeIgniter\Model;

class AdjuntosModel extends Model
{
    protected $table = 'adjuntos';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $allowedFields =
    [
        'id',
        'denuncia_id',
        'file_path',
        'file_name',
        'file_type',
        'fecha_subida'
    ];
    protected $useTimestamps = true;
    protected $createdField = 'fecha_subida';
}
