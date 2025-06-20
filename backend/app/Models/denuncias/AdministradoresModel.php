<?php

namespace App\Models\Denuncias;

use CodeIgniter\Model;

class AdministradoresModel extends Model
{
    protected $DBGroup = 'default';
    protected $table = 'administradores';
    protected $primaryKey = 'dni_admin';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields =
    [
        'dni_admin',
        'nombres',
        'password',
        'categoria',
        'estado'
    ];
    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = 
    [
        'dni_admin' =>[
            'label' => 'dni_admin',
            'rules' => 'required'
        ],
        'nombres' =>[
            'label' => 'nombres',
            'rules' => 'required'
        ],
        'password' =>[
            'label' => 'password',
            'rules' => 'required'
        ],
        'categoria' =>[
            'label' => 'categoria',
            'rules' => 'required'
        ],
        'estado' =>[
            'label' => 'estado',
            'rules' => 'required'
        ]
    ];
    protected $validationMessages   = 
    [
        'dni_admin' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'nombres' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'password' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'categoria' =>[
            'required' => 'El campo {field} es obligatorio'
        ],
        'estado' =>[
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
