<?php

namespace App\Controllers\denuncias_corrupcion\Denuncias\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\denuncias_corrupcion\Denuncias\DenunciantesModel;
use App\Models\denuncias_corrupcion\Denuncias\DenunciasModel;
use App\Models\denuncias_corrupcion\Denuncias\SeguimientoDenunciasModel;
use CodeIgniter\Config\Services;

class GestionAdminController extends ResourceController
{
    // Funciones y constructores para la gestión de denuncias
    private $denunciantesModel;
    private $denunciasModel;
    private $seguimientoDenunciasModel;
    private $mailService;
    public function __construct()
    {
        $this->denunciantesModel = new DenunciantesModel();
        $this->denunciasModel = new DenunciasModel();
        $this->seguimientoDenunciasModel = new SeguimientoDenunciasModel();
        $this->mailService = new \App\Services\MailService();
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
    //Funciones para la gestion de denuncias
    public function dashboard()
    {
        $denuncias = $this->denunciasModel->getDashboardData();
        return $this->response->setJSON($denuncias);
    }
    // public function receiveAdmin()
    // {
    //     $data = $this->request->getGet();
    //     $code = $data['tracking_code'];
    //     $dni_admin = $data['dni_admin'];
    //     $estado = 'recibida';
    //     $comentario = 'La denuncia ha sido recibida por el administrador';

    //     $id = $this->generateId('seguimientoDenuncias');
    //     $seguimientoData = [
    //         'id' => $id,
    //         'denuncia_id' => null,
    //         'estado' => $estado,
    //         'comentario' => $comentario,
    //         'fecha_actualizacion' => date('Y-m-d H:i:s'),
    //         'dni_admin' => $dni_admin
    //     ];

    //     $denuncia = $this->denunciasModel->receiveDenuncia($code, $dni_admin, $estado, $comentario, $seguimientoData);

    //     if (!$denuncia) {
    //         return $this->response->setJSON([
    //             'success' => false,
    //             'message' => 'Error al insertar el seguimiento de la denuncia'
    //         ]);
    //     }

    //     $correo = $this->denunciantesModel
    //         ->select('email')
    //         ->where('id', $denuncia['denunciante_id'])
    //         ->first();

    //     if ($correo) {
    //         $this->correo($correo['email'], $code, $estado, $comentario);
    //     }

    //     return $this->response->setJSON([
    //         'success' => true,
    //         'message' => 'La denuncia recibida'
    //     ]);
    // }

    public function receiveAdmin()
    {
        $data = $this->request->getGet();
        $code = $data['tracking_code'];
        $dni_admin = $data['dni_admin'];
        $estado = 'recibida';
        $comentario = 'La denuncia ha sido recibida por el administrador';

        // 👉 Llamada simplificada: el modelo ya arma el seguimiento
        $denuncia = $this->denunciasModel->receiveDenuncia(
            $code,
            $dni_admin,
            $estado,
            $comentario,
            [] // seguimientoData lo genera internamente
        );

        if (!$denuncia) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al insertar el seguimiento de la denuncia'
            ]);
        }

        $correo = $this->denunciantesModel
            ->select('email')
            ->where('id', $denuncia['denunciante_id'])
            ->first();

        if ($correo && !empty($correo['email'])) {
            $this->mailService->seguimientogMail($correo['email'], $code, $estado, $comentario);
        }

        return $this->response->setJSON([
            'success' => true,
            'message' => 'La denuncia recibida'
        ]);
    }
    // public function receivedAdmin()
    // {
    //     $data = $this->request->getGet();
    //     $dni_admin = $data['dni_admin'];

    //     $denuncias = $this->denunciasModel->getReceivedAdminData($dni_admin);

    //     return $this->response->setJSON($denuncias);
    // }
    public function receivedAdmin()
    {
        $denuncias = $this->denunciasModel->getReceivedAdminData();
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
        $estado = $data['estado'];
        $comentario = $data['comentario'];
        // Obtener el correo del denunciante
        $correo = $this->denunciantesModel
            ->select('email')
            ->where('id', $id_denuncias['denunciante_id'])
            ->first();
        if ($correo && !empty($correo['email'])) {
            $this->mailService->seguimientogMail($correo['email'], $code, $estado, $comentario);
        }

        if ($this->seguimientoDenunciasModel->insert([
            'denuncia_id' => $id_denuncias['id'],
            'estado' => $estado,
            'comentario' => $comentario,
            'administrador_id' => $this->denunciasModel->getAdminIdByDni($dni_admin)
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

        $denuncias = $this->denunciasModel->searchByDocumento($dni);

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
