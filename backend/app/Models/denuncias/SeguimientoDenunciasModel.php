<?php

namespace App\Models\Denuncias;

use CodeIgniter\Model;

class SeguimientoDenunciasModel extends Model
{
    protected $DBGroup = 'default';
    protected $table = 'seguimiento_denuncias';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields =
    [
        'id',
        'denuncia_id',
        'estado',
        'comentario',
        'fecha_actualizacion',
        'dni_admin'
    ];
    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = false;
    protected $updatedField  = 'fecha_actualizacion';
    protected $deletedField  = false;

    // Validation
    protected $validationRules      = 
    [
        'denuncia_id' =>[
            'label' => 'denuncia_id',
            'rules' => 'required'
        ],
        'estado' =>[
            'label' => 'estado',
            'rules' => 'required'
        ],
        'comentario' =>[
            'label' => 'comentario',
            'rules' => 'required'
        ],
        'fecha_actualizacion' =>[
            'label' => 'fecha_actualizacion',
            'rules' => 'required'
        ]
    ];
    protected $validationMessages   = 
    [
        'denuncia_id' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'estado' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'comentario' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'fecha_actualizacion' =>[
            'required' => 'El campo {field} es obligatorio'
        ]
    ];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];
}
