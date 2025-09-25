<?php

namespace App\Models\denuncias_corrupcion\Denuncias;

use CodeIgniter\Model;

class SeguimientoDenunciasModel extends Model
{
    protected $table            = 'seguimiento_denuncia';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $allowedFields    = [
        'denuncia_id',
        'comentario',
        'administrador_id',
        'estado'
    ];
    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'denuncia_id'     => 'required|integer',
        'comentario'      => 'permit_empty|string|max_length[500]',
        'administrador_id'=> 'required|integer',
        'estado'           => 'required|string|max_length[100]'
    ];

    protected $validationMessages = [
        'denuncia_id' => [
            'required' => 'El ID de la denuncia es obligatorio',
            'integer'  => 'El ID de la denuncia debe ser un número entero'
        ],
        'comentario' => [
            'max_length' => 'El comentario no puede exceder los 500 caracteres'
        ],
        'administrador_id' => [
            'required' => 'El ID del administrador es obligatorio',
            'integer'  => 'El ID del administrador debe ser un número entero'
        ],
        'estado' => [
            'required'   => 'El estado es obligatorio',
            'max_length' => 'El estado no puede exceder los 100 caracteres'
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

    public function insertSeguimiento(array $data)
    {
        return $this->insert($data);
    }

    public function getSeguimientosByDenunciaId($denunciaId)
    {
        return $this->where('denuncia_id', $denunciaId)
                    ->orderBy('created_at', 'DESC')
                    ->findAll();
    }
}
