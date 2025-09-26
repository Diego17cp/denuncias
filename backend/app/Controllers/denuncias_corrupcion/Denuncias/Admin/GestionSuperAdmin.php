<?php

namespace App\Controllers\denuncias_corrupcion\Denuncias\Admin;

use App\Controllers\BaseController;

use App\Models\denuncias_corrupcion\denuncias\AdministradoresModel;
use App\Models\denuncias_corrupcion\denuncias\HistorialAdminModel;

class GestionSuperAdmin extends BaseController
{
    //Funciones y constructores para la gestión de administradores

    private $administradoresModel;
    private $historialAdminModel;
    public function __construct()
    {
        $this->administradoresModel = new AdministradoresModel();
        $this->historialAdminModel = new HistorialAdminModel();
    }
    public function generateId($table)
    {
        $prefixes = [
            'historialAdmin' => 'ha'
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
    // Funciónes para los super administradores
    public function getAdministradores()
    {
        $result = $this->administradoresModel
            ->findAll();
        if (!$result) {
            return $this->response->setJSON(['error' => 'No se encontraron administradores'], 404);
        }
        $data = array_map(function ($admin) {
            return [
                'dni_admin' => $admin['dni'],
                'nombres' => $admin['nombre'],
                'categoria' => $admin['rol'],
                'estado' => $admin['estado']
            ];
        }, $result);
        return $this->response->setJSON($data);
    }
    
    public function createAdministrador()
    {

        $data = $this->request->getJSON(true);

        
        if (isset($data['dni_admin'])) {
            $data['dni'] = $data['dni_admin'];
            unset($data['dni_admin']);
        }

        if (!isset($data['dni']) || empty($data['dni'])) {
            return $this->response->setJSON([
                'error' => 'El campo dni es obligatorio'
            ])->setStatusCode(400);
        }

        $dni = $data['dni'];

        $existingAdmin = $this->administradoresModel->where('dni', $dni)->first();
        if ($existingAdmin) {
            return $this->response->setJSON([
                'error' => 'Ya existe un administrador con ese DNI'
            ])->setStatusCode(400);
        }

        if (isset($data['nombres'])) {
            $data['nombre'] = $data['nombres']; 
            unset($data['nombres']); 
        }

        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        } else {
            return $this->response->setJSON([
                'error' => 'El campo password es obligatorio'
            ])->setStatusCode(400);
        }

        if (isset($data['categoria'])) {
            $data['rol'] = $data['categoria']; 
            unset($data['categoria']);
        }

        
        // Normalizar estado
        if (isset($data['estado'])) {
            $data['estado'] = (string)$data['estado'] === "0" ? "0" : "1";
        } else {
            $data['estado'] = "1"; 
        }

        try {
            log_message('debug', 'Datos antes de insertar admin: ' . json_encode($data));
            $success = $this->administradoresModel->insert($data);

            if ($success) {
                $newAdmin = $this->administradoresModel->find($this->administradoresModel->getInsertID());
                return $this->response->setJSON($newAdmin)->setStatusCode(201);
            } else {
                // Mostrar errores del modelo
                $errors = $this->administradoresModel->errors();
                log_message('error', 'Error al crear administrador: ' . json_encode($errors));
                return $this->response->setJSON([
                    'error' => 'Error al crear el administrador'
                ])->setStatusCode(500);
            }
        } catch (\Exception $e) {
            log_message('error', 'Error al crear administrador: ' . $e->getMessage());
            return $this->response->setJSON([
                'error' => 'Error al crear el administrador'
            ])->setStatusCode(500);
        }
    }

    public function updateAdministrador()
    {
        $data        = $this->request->getJSON(true);
        $accion      = $data['accion'] ?? null;
        $dniAdmin    = $data['dni_admin'] ?? null; 
        $dniAfectado = $data['dni'] ?? null;       
        $motivo      = $data['motivo'] ?? null;

        if (!$accion || !$dniAdmin || !$dniAfectado || !$motivo) {
            return $this->response->setJSON([
                'error' => 'Faltan parámetros obligatorios'
            ])->setStatusCode(400);
        }

        // Buscar admin actor (el que hace la acción)
        $adminActor = $this->administradoresModel->where('dni', $dniAdmin)->first();
        if (!$adminActor) {
            return $this->response->setJSON([
                'error' => 'Administrador que realiza la acción no encontrado'
            ])->setStatusCode(404);
        }

        // Buscar admin afectado
        $adminToUpdate = $this->administradoresModel->where('dni', $dniAfectado)->first();
        if (!$adminToUpdate) {
            return $this->response->setJSON([
                'error' => 'Administrador afectado no encontrado'
            ])->setStatusCode(404);
        }

        // IDs reales para actualizar y registrar en historial
        $admin_id = $adminActor['id'];
        $afectado = $adminToUpdate['id'];

        $historialData = [
            'administrador_id' => $admin_id,
            'afectado_id'      => $afectado,
            'accion'           => $accion,
            'motivo'           => $motivo
        ];

        switch ($accion) {
            case 'estado':
                $estado = $data['estado'] ?? null;
                $estado = (string)$estado === "0" ? "0" : "1"; // normalización
                $updateResult = $this->administradoresModel->update($afectado, ['estado' => $estado]);

                if (!$updateResult) {
                    return $this->response->setJSON([
                        'error' => 'No se pudo actualizar el estado del administrador'
                    ])->setStatusCode(500);
                }

                $this->historialAdminModel->insert($historialData);

                return $this->response->setJSON([
                    'message' => 'Estado actualizado correctamente',
                    'estado'  => $estado,
                    'admin'   => $this->administradoresModel->find($afectado)
                ])->setStatusCode(200);

            case 'categoria':
                
                $rol = $data['rol'] ?? ($data['categoria'] ?? null);

                if (empty($rol)) {
                    return $this->response->setJSON([
                        'error' => 'Falta el rol'
                    ])->setStatusCode(400);
                }

                // log para depuración
                log_message('debug', 'Actualizando rol => ' . $rol);

                if (!$this->administradoresModel->update($afectado, ['rol' => (string) $rol])) {
                    return $this->response->setJSON([
                        'error' => 'No se pudo actualizar el rol del administrador',
                        'details' => $this->administradoresModel->errors()
                    ])->setStatusCode(500);
                }

                $this->historialAdminModel->insert($historialData);

                return $this->response->setJSON([
                    'message' => 'Rol actualizado correctamente',
                    'rol'     => $rol,
                    'admin'   => $this->administradoresModel->find($afectado)
                ])->setStatusCode(200);

            case 'password':
                $password = $data['password'] ?? null;
                if (!$password) {
                    return $this->response->setJSON([
                        'error' => 'Falta la contraseña'
                    ])->setStatusCode(400);
                }

                $updateResult = $this->administradoresModel
                    ->update($afectado, ['password' => password_hash($password, PASSWORD_DEFAULT)]);

                if (!$updateResult) {
                    return $this->response->setJSON([
                        'error' => 'No se pudo actualizar la contraseña del administrador'
                    ])->setStatusCode(500);
                }

                $this->historialAdminModel->insert($historialData);

                return $this->response->setJSON([
                    'message' => 'Contraseña actualizada correctamente',
                    'admin'   => $this->administradoresModel->find($afectado)
                ])->setStatusCode(200);

            default:
                return $this->response->setJSON([
                    'error' => 'Acción no válida'
                ])->setStatusCode(400);
        }
    }

    public function searchAdmin()
    {
        // Normalizamos por si llega 'dni_admin'
        $dni = $this->request->getGet('dni') ?? $this->request->getGet('dni_admin');

        if (!$dni) {
            return $this->response->setJSON(['error' => 'DNI no proporcionado'])->setStatusCode(400);
        }

        $admin = $this->administradoresModel->where('dni', $dni)->first();
        if (!$admin) {
            return $this->response->setJSON(['error' => 'Administrador no encontrado'])->setStatusCode(404);
        }

        // Mapear al formato esperado por el frontend
        $data = [
            'dni_admin' => $admin['dni'],
            'nombres'   => $admin['nombre'],
            'categoria' => $admin['rol'],
            'estado'    => $admin['estado'] == '1' ? 'activo' : 'inactivo'
        ];

        return $this->response->setJSON($data);
    }

    public function historyAdmin()
    {
        $history = $this->historialAdminModel
            ->select('historial_admin.*, 
                    a.nombre AS admin_nombre, 
                    a.rol AS admin_categoria,
                    a.nombre AS realizado_por,
                    b.nombre AS afectado_nombre,
                    b.dni AS afectado_dni,
                    historial_admin.created_at AS fecha_accion')
            ->join('administrador a', 'historial_admin.administrador_id = a.id', 'left')
            ->join('administrador b', 'historial_admin.afectado_id = b.id', 'left')
            ->findAll();

        if (!$history) {
            return $this->response
                ->setJSON(['error' => 'No se encontraron registros de historial'])
                ->setStatusCode(404);
        }

        $data = array_map(function ($item) {
            return [
                'id'              => (string) $item['id'],
                'realizado_por'   => $item['realizado_por'],     // nombre del actor
                'dni_admin'       => $item['afectado_dni'],      // DNI real del afectado
                'accion'          => $item['accion'],
                'motivo'          => $item['motivo'],
                'fecha_accion'    => $item['fecha_accion'],
                'admin_nombre'    => $item['afectado_nombre'],   // nombre del afectado
                'admin_categoria' => $item['admin_categoria'],   // categoría del actor
            ];
        }, $history);

        return $this->response->setJSON($data);
    }
}
