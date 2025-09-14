<?php

namespace App\Models\Denuncias;

use CodeIgniter\Model;

class DenunciadosModel extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'denunciado';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $allowedFields = [
        'nombre',
        'documento',
        'representante_legal',
        'razon_social',
        'tipo_documento',
        'direccion',   
        'celular',
    ];
    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'nombre'         => 'permit_empty|min_length[3]|max_length[255]',
        'tipo_documento' => 'required|in_list[DNI,CE,RUC]',
        'direccion'      => 'permit_empty|max_length[50]',
        'celular'       => 'permit_empty|max_length[20]',
        'documento'      => 'required|min_length[8]|max_length[20]',
        'representante_legal' => 'permit_empty|max_length[255]',
        'razon_social'   => 'permit_empty|max_length[255]'
    ];
    protected $validationMessages = [
        'nombre' => [
            'min_length'  => 'El campo {field} debe tener al menos {param} caracteres.',
            'max_length'  => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'tipo_documento' => [
            'in_list'  => 'El {field} debe ser uno de: DNI, CEDULA o RUC.'
        ],
        'direccion' => [
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'celular' => [
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'documento' => [
            'min_length'  => 'El campo {field} debe tener al menos {param} caracteres.',
            'max_length'  => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'representante_legal' => [
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'razon_social' => [
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ]
    ];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;


    public function getByDocument(string $doc)
    {
        return $this->where('documento', $doc)->first();
    }
}
