<?php

namespace App\Models\denuncias_corrupcion\denuncias;

use CodeIgniter\Model;

class DenunciasModel extends Model
{
    protected $table            = 'denuncia';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $allowedFields =
    [
        'id',
        'tracking_code',
        'es_anonimo',
        'denunciante_id',
        'denunciado_id',
        'estado',
        'fecha_incidente',
        'descripcion',
        'lugar',
        'motivo_id',
        'motivo_otro',
        'area'
    ];
    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules = [
        'tracking_code'   => 'required|string|max_length[20]',
        'es_anonimo'      => 'required|in_list[0,1]',
        'denunciante_id'  => 'permit_empty|integer',
        'descripcion'     => 'required|string',
        'fecha_incidente' => 'required|valid_date',
        'denunciado_id' => 'permit_empty|is_natural_no_zero',
        'estado'          => 'required|string|max_length[20]',
        'lugar'           => 'permit_empty|string|max_length[50]',
        'area'            => 'permit_empty|string|max_length[50]',
        'motivo_id'       => 'permit_empty|is_natural_no_zero',
        'motivo_otro'     => 'permit_empty|string|max_length[255]',
    ];
    protected $validationMessages = [
        'tracking_code' => [
            'required' => 'El código de seguimiento es obligatorio.',
            'max_length' => 'El código de seguimiento no puede exceder los 50 caracteres.'
        ],
        'es_anonimo' => [
            'required' => 'Debe indicar si la denuncia es anónima.',
            'in_list'  => 'El valor de anonimato debe ser 0 o 1.'
        ],
        'descripcion' => [
            'required' => 'La descripción de la denuncia es obligatoria.'
        ],
        'fecha_incidente' => [
            'required'    => 'La fecha del incidente es obligatoria.',
            'valid_date'  => 'Debe proporcionar una fecha de incidente válida.'
        ],
        'denunciado_id' => [
            'integer'  => 'El ID del denunciado debe ser un número entero.'
        ],
        'denunciante_id' => [
            'required' => 'Debe especificar la persona denunciante.',
            'integer'  => 'El ID del denunciado debe ser un número entero.'
        ],
        'lugar' => [
            'max_length' => 'El campo lugar no puede exceder los 50 caracteres.'
        ],
        'area' => [
            'max_length' => 'El campo área no puede exceder los 50 caracteres.'
        ],
        'motivo_id' => [
            'integer' => 'El ID del motivo debe ser un número entero.'
        ],
        'motivo_otro' => [
            'max_length' => 'El campo motivo (otro) no puede exceder los 255 caracteres.'
        ]
    ];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;


    public function getDashboardData()
{
    return $this
        ->select('
            denuncia.id,
            denuncia.tracking_code,
            denuncia.estado,
            denuncia.created_at as fecha_registro,
            denuncia.fecha_incidente,
            COALESCE(denunciante.nombre, "Anónimo") as denunciante_nombre,
            COALESCE(denunciante.numero_documento, "00000000") as denunciante_dni,
            denunciado.nombre as denunciado_nombre,
            motivo.nombre as motivo
        ')
        ->join('denunciante', 'denuncia.denunciante_id = denunciante.id', 'left')
        ->join('denunciado', 'denuncia.denunciado_id = denunciado.id', 'left')
        ->join('motivo', 'denuncia.motivo_id = motivo.id', 'left')
        ->findAll();
}

    public function receiveDenuncia($trackingCode, $dniAdmin, $estado, $comentario, $seguimientoData)
    {
        $denuncia = $this->where('tracking_code', $trackingCode)->first();

        if (!$denuncia) {
            return false;
        }

        $this->db->transStart();

        // Update denuncia
        $this->where('tracking_code', $trackingCode)
            ->set([
                'dni_admin' => $dniAdmin,
                'estado' => $estado
            ])
            ->update();

        // Use SeguimientoDenunciasModel to insert seguimiento
        $seguimientoModel = new \App\Models\Denuncias\SeguimientoDenunciasModel();
        $seguimientoData['denuncia_id'] = $denuncia['id'];
        $seguimientoModel->insertSeguimiento($seguimientoData);

        $this->db->transComplete();

        return $this->db->transStatus() ? $denuncia : false;
    }

    public function getReceivedAdminData($dniAdmin)
    {
        return $this
            ->select('
                denuncias.tracking_code, 
                denuncias.estado, 
                denuncias.fecha_registro, 
                denuncias.fecha_incidente,
                denuncias.descripcion,
                denuncias.motivo_otro,
                COALESCE(denunciantes.nombres, "Anónimo") as denunciante_nombre, 
                COALESCE(denunciantes.numero_documento, "00000000") as denunciante_dni, 
                denunciados.nombre as denunciado_nombre, 
                denunciados.numero_documento as denunciado_dni, 
                motivos.nombre as motivo,
                seguimiento_denuncias.estado as seguimiento_estado,
                seguimiento_denuncias.comentario as seguimiento_comentario
            ')
            ->join('denunciantes', 'denuncias.denunciante_id = denunciantes.id', 'left')
            ->join('denunciados', 'denuncias.denunciado_id = denunciados.id')
            ->join('motivos', 'denuncias.motivo_id = motivos.id')
            ->join('seguimiento_denuncias', 'denuncias.id = seguimiento_denuncias.denuncia_id', 'left')
            ->where('denuncias.dni_admin', $dniAdmin)
            ->whereIn('denuncias.estado', ['en proceso', 'recibida'])
            ->groupBy('denuncias.id')
            ->findAll();
    }

    public function searchByDocumento($numeroDocumento)
    {
        return $this
            ->select('
                denuncias.id,
                denuncias.tracking_code,
                denuncias.motivo_id,
                denuncias.descripcion, 
                denuncias.fecha_registro,
                denuncias.estado,
                denuncias.motivo_otro,
                denunciados.nombre as denunciado_nombre,
                denunciados.numero_documento as denunciado_dni,
                COALESCE(denunciantes.nombres, "Anónimo") as denunciante_nombre,
                COALESCE(denunciantes.numero_documento, "") as denunciante_dni,
                (
                    SELECT comentario FROM seguimiento_denuncias 
                    WHERE seguimiento_denuncias.denuncia_id = denuncias.id 
                    ORDER BY fecha_actualizacion DESC LIMIT 1
                ) as seguimiento_comentario
            ')
            ->join('denunciados', 'denuncias.denunciado_id = denunciados.id')
            ->join('denunciantes', 'denuncias.denunciante_id = denunciantes.id', 'left')
            ->where('denunciados.numero_documento', $numeroDocumento)
            ->findAll();
    }

    public function getDenunciaByTrackingCode($trackingCode)
    {
        return $this->where('tracking_code', $trackingCode)->first();
    }

    public function insertDenuncia(array $data)
    {
        return $this->insert($data);
    }
}
