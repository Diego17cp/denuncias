<?php

namespace App\Models\Denuncias;

use CodeIgniter\Model;

class DenunciantesModel extends Model
{
    protected $table      = 'denunciante';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = true;
    protected $protectFields = true;
    protected $allowedFields = [
        'id',
        'nombre',
        'razon_social',
        'documento',
        'tipo_documento',
        'direccion',
        'distrito',
        'provincia',
        'departamento',
        'email',
        'telefono',
        'celular',
        'sexo',
    ];
    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'nombre'           => 'permit_empty|min_length[3]|max_length[255]',
        'razon_social'     => 'permit_empty|max_length[150]',
        'documento' => 'permit_empty|min_length[8]|max_length[20]',
        'tipo_documento' => 'permit_empty|in_list[DNI,CE,RUC]',
        'direccion'        => 'permit_empty|max_length[255]',
        'distrito'         => 'permit_empty|max_length[100]',
        'provincia'        => 'permit_empty|max_length[100]',
        'departamento'     => 'permit_empty|max_length[100]',
        'email' => 'permit_empty|valid_email|max_length[150]',
        'telefono'         => 'permit_empty|max_length[15]|min_length[7]',
        'celular'          => 'permit_empty|max_length[15]|min_length[7]',
        'sexo'             => 'permit_empty|in_list[M,F,O]',
    ];
    protected $validationMessages = [
        'nombre' => [
            'required'   => 'El nombre es obligatorio',
            'min_length' => 'El nombre debe tener al menos 3 caracteres',
            'max_length' => 'El nombre no puede superar los 100 caracteres'
        ],
        'email' => [
            'required'    => 'El correo es obligatorio',
            'valid_email' => 'Debe ser un correo válido',
            'max_length'  => 'El correo no puede superar los 150 caracteres'
        ],
        'telefono' => [
            //'required'    => 'El teléfono es obligatorio',
            'numeric'     => 'El teléfono debe contener solo números',
            'max_length'  => 'El teléfono no puede superar los 15 dígitos',
            'min_length'  => 'El teléfono debe tener al menos 7 dígitos'
        ],
        'celular' => [
            'required'    => 'El celular es obligatorio',
            'numeric'     => 'El celular debe contener solo números',
            'max_length'  => 'El celular no puede superar los 15 dígitos',
            'min_length'  => 'El celular debe tener al menos 7 dígitos'
        ],
        'documento' => [
            'required'   => 'El número de documento es obligatorio',
            'numeric'    =>'El documento debe contener solo números',
            'max_length' => 'El documento no puede superar los 15 dígitos'
        ],
        'tipo_documento' => [
            'required' => 'El tipo de documento es obligatorio',
            'in_list'  => 'Tipo de documento inválido (DNI, CE o Pasaporte)'
        ],
        'razon_social' => [
            'max_length' => 'La razón social no puede superar los 150 caracteres'
        ],
        'sexo' => [
            'required' => 'El sexo es obligatorio',
            'in_list'  => 'El sexo debe ser M (Masculino), F (Femenino) o O (Otro)'
        ],
        'distrito' => [
            //'required'   => 'El distrito es obligatorio',
            'max_length' => 'El distrito no puede superar los 100 caracteres'
        ],
        'provincia' => [
            //'required'   => 'La provincia es obligatoria',
            'max_length' => 'La provincia no puede superar los 100 caracteres'
        ],
        'departamento' => [
            //'required'   => 'El departamento es obligatorio',
            'max_length' => 'El departamento no puede superar los 100 caracteres'
        ],
        'direccion' => [
            //'required'   => 'La dirección es obligatoria',
            'max_length' => 'La dirección no puede superar los 255 caracteres'
        ]
    ];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;


    public function getByDocument(string $doc)
    {
        return $this->where('documento', $doc)->first();
    }
}
