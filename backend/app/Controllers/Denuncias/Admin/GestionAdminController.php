<?php

namespace App\Controllers\Denuncias\Admin;

use App\Controllers\BaseController;

use App\Models\Denuncias\DenunciantesModel;
use App\Models\Denuncias\DenunciasModel;
use App\Models\Denuncias\SeguimientoDenunciasModel;

class GestionAdminController extends BaseController
{
    // Funciones y constructores para la gestión de denuncias
    private $denunciantesModel;
    private $denunciasModel;
    private $seguimientoDenunciasModel;
    public function __construct()
    {
        $this->denunciantesModel = new DenunciantesModel();
        $this->denunciasModel = new DenunciasModel();
        $this->seguimientoDenunciasModel = new SeguimientoDenunciasModel();
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
    public function correo($correo, $code, $estado, $comentario)
    {
        $email = \Config\Services::email();
        $email->setFrom('munijloenlinea@gmail.com', 'Municipalidad Distrital de José Leonardo Ortiz');
        $email->setTo($correo);
        $email->setSubject('Código de Seguimiento de Denuncia');
        $email->setMessage("
            <html>
            <head>
            <title>Estado de Denuncia</title>
            </head>
            <body style='font-family: Asap, sans-serif;'>
            <p>Estimado usuario,</p>
            <p>Le informamos sobre el estado actual de su denuncia:</p>
            <p><strong>Código de Seguimiento:</strong> $code</p>
            <p><strong>Estado:</strong> $estado</p>
            <p><strong>Comentario:</strong> $comentario</p>
            <p>Para realizar el seguimiento de su denuncia, puede ingresar al siguiente enlace:</p>
            <p><a href='http://localhost:5173/tracking-denuncia?codigo=$code'>Seguimiento</a></p>
            <p>Atentamente,</p>
            <p><strong>Municipalidad Distrital de José Leonardo Ortiz</strong></p>
            </body>
            </html>
        ");

        return $email->send();
    }
    //Funciones para la gestion de denuncias
    public function dashboard()
    {
        $denuncias = $this->denunciasModel
            ->select('
                denuncias.tracking_code, 
                denuncias.estado, 
                denuncias.fecha_registro, 
                COALESCE(denunciantes.nombres, "Anónimo") as denunciante_nombre, 
                COALESCE(denunciantes.numero_documento, "00000000") as denunciante_dni, 
                denunciados.nombre as denunciado_nombre, 
                denunciados.numero_documento as denunciado_dni, 
                motivos.nombre as motivo
            ')
            ->join('denunciantes', 'denuncias.denunciante_id = denunciantes.id', 'left')
            ->join('denunciados', 'denuncias.denunciado_id = denunciados.id')
            ->join('motivos', 'denuncias.motivo_id = motivos.id')
            ->where('denuncias.dni_admin', null)
            ->where('denuncias.estado', 'registrado')
            ->findAll();

        return $this->response->setJSON($denuncias);
    }
    public function receiveAdmin()
    {
        $data = $this->request->getGet();
        $code = $data['tracking_code'];
        $dni_admin = $data['dni_admin'];
        $id = $this->generateId('seguimientoDenuncias');
        $estado = 'recibida';
        $comentario = 'La denuncia ha sido recibida por el administrador';
        $id_denuncias = $this->denunciasModel
            ->where('tracking_code', $code)
            ->first();

        $correo = $this->denunciantesModel
            ->select('email')
            ->where('id', $id_denuncias['denunciante_id'])
            ->first();
        if ($correo) {
            $this->correo($correo['email'], $code, $estado, $comentario);
        }

        if ($this->seguimientoDenunciasModel->insert([
            'id' => $id,
            'denuncia_id' => $id_denuncias['id'],
            'estado' => $estado,
            'comentario' => $comentario,
            'fecha_actualizacion' => date('Y-m-d H:i:s', strtotime('-5 hours')),
            'dni_admin' => $dni_admin
        ])) {
        }
        if ($update = $this->denunciasModel
            ->where('tracking_code', $code)
            ->set([
                'dni_admin' => $dni_admin,
                'estado' => 'recibida'
            ])
            ->update()
        ) {
        } else {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al insertar el seguimiento de la denuncia'
            ]);
        }
        if ($update) {
            return $this->response->setJSON([
                'success' => true,
                'message' => 'La denuncia recibida'
            ]);
        }
    }
    public function receivedAdmin()
    {
        $data = $this->request->getGet();
        $dni_admin = $data['dni_admin'];

        $denuncias = $this->denunciasModel
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
            ->where('denuncias.dni_admin', $dni_admin)
            ->whereIn('denuncias.estado', ['en proceso', 'recibida'])
            ->groupBy('denuncias.id')
            ->findAll();

        return $this->response->setJSON($denuncias);
    }
    public function downloadAdjunto()
    {
        $data = $this->request->getGet();
        $code = $data['tracking_code'] ?? null;
        if (!$code) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'El código de seguimiento es requerido'
            ]);
        }
        $denuncia = $this->denunciasModel
            ->where('tracking_code', $code)
            ->first();

        if (!$denuncia) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Denuncia no encontrada'
            ]);
        }
        $folderPath = FCPATH . 'uploads/' . $denuncia['id'];
        if (!is_dir($folderPath)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No se encontraron archivos adjuntos para esta denuncia'
            ]);
        }
        $hasFiles = false;
        foreach (new \DirectoryIterator($folderPath) as $fileInfo) {
            if (!$fileInfo->isDot() && !$fileInfo->isDir()) {
                $hasFiles = true;
                break;
            }
        }
        if (!$hasFiles) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'La carpeta de archivos adjuntos está vacía'
            ]);
        }
        $zipName = 'adjuntos_' . $code . '_' . time() . '.zip';
        $this->response->setHeader('Content-Type', 'application/zip');
        $this->response->setHeader('Content-Disposition', 'attachment; filename="' . $zipName . '"');
        $this->response->setHeader('Pragma', 'no-cache');
        $zip = new \ZipArchive();
        $tempFile = tempnam(sys_get_temp_dir(), 'zip');
        if ($zip->open($tempFile, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === TRUE) {
            $fileCount = 0;
            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($folderPath),
                \RecursiveIteratorIterator::LEAVES_ONLY
            );
            foreach ($files as $file) {
                if (!$file->isDir()) {
                    $filePath = $file->getRealPath();
                    $relativePath = substr($filePath, strlen($folderPath) + 1);

                    if (substr($relativePath, 0, 1) !== '.') {
                        if ($zip->addFile($filePath, $relativePath)) {
                            $fileCount++;
                        }
                    }
                }
            }
            $zip->close();
            if ($fileCount === 0) {
                unlink($tempFile);
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se encontraron archivos válidos para comprimir'
                ]);
            }
            $this->response->setBody(file_get_contents($tempFile));
            unlink($tempFile);
            return $this->response;
        } else {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No se pudo crear el archivo ZIP'
            ]);
        }
    }
    public function procesosDenuncia()
    {
        $data = $this->request->getGet();
        $code = $data['tracking_code'];
        $id_denuncias = $this->denunciasModel
            ->where('tracking_code', $code)
            ->first();
        $dni_admin = $data['dni_admin'];
        $id = $this->generateId('seguimientoDenuncias');
        $estado = $data['estado'];
        $comentario = $data['comentario'];
        // Obtener el correo del denunciante
        $correo = $this->denunciantesModel
            ->select('email')
            ->where('id', $id_denuncias['denunciante_id'])
            ->first();
        if ($correo) {
            $this->correo($correo['email'], $code, $estado, $comentario);
        }

        if ($this->seguimientoDenunciasModel->insert([
            'id' => $id,
            'denuncia_id' => $id_denuncias['id'],
            'estado' => $estado,
            'comentario' => $comentario,
            'fecha_actualizacion' => date('Y-m-d H:i:s', strtotime('-5 hours')),
            'dni_admin' => $dni_admin
        ])) {
        }
        if ($update = $this->denunciasModel
            ->where('tracking_code', $code)
            ->set([
                'estado' => $estado
            ])
            ->update()
        ) {
        } else {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al insertar el seguimiento de la denuncia'
            ]);
        }
        if ($update) {
            return $this->response->setJSON([
                'success' => true,
                'message' => 'La denuncia ha sido actualizada'
            ]);
        }
    }
    public function search()
    {
        $data = $this->request->getGet();
        $dni = $data['numero_documento'];

        $denuncias = $this->denunciasModel
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
            ->where('denunciados.numero_documento', $dni)
            ->findAll();

        if (empty($denuncias)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'No se encontraron denuncias para este número de documento'
            ]);
        }

        return $this->response->setJSON([
            'success' => true,
            'data' => $denuncias
        ]);
    }
}
