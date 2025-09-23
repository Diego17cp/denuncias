<?php

namespace App\Controllers\denuncias_corrupcion\Denuncias\Admin;

use App\Controllers\BaseController;

use App\Models\denuncias_corrupcion\Denuncias\AdministradoresModel;
use App\Models\denuncias_corrupcion\Denuncias\HistorialAdminModel;

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
    // public function createAdministrador()
    // {
    //     $data = $this->request->getJSON(true);

    //     // Verificar si ya existe un administrador con ese DNI
    //     $existingAdmin = $this->administradoresModel->find($data['dni_admin']);
    //     if ($existingAdmin) {
    //         return $this->response->setJSON([
    //             'error' => 'Ya existe un administrador con ese DNI'
    //         ])->setStatusCode(400);
    //     }
    //     $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
    //     try {
    //         $success = $this->administradoresModel
    //             ->insert($data);

    //         if ($success) {
    //             $newAdmin = $this->administradoresModel->find($data['dni_admin']);
    //             return $this->response->setJSON($newAdmin)->setStatusCode(201);
    //         } else {
    //             return $this->response->setJSON([
    //                 'error' => 'Error al crear el administrador'
    //             ])->setStatusCode(500);
    //         }
    //     } catch (\Exception $e) {
    //         log_message('error', 'Error al crear administrador: ' . $e->getMessage());
    //         return $this->response->setJSON([
    //             'error' => 'Error al crear el administrador'
    //         ])->setStatusCode(500);
    //     }
    // }
    // public function updateAdministrador()
    // {
    //     $data = $this->request->getJSON(true);
    //     $accion = $data['accion'] ?? null;
    //     $dni_admin = $data['dni_admin'] ?? null;
    //     $dni = $data['dni'] ?? null;
    //     $motivo = $data['motivo'] ?? null;

    //     if (!$accion || !$dni_admin || !$dni || !$motivo) {
    //         return $this->response->setJSON([
    //             'error' => 'Faltan parámetros obligatorios'
    //         ])->setStatusCode(400);
    //     }
    //     $adminToUpdate = $this->administradoresModel->find($dni);
    //     if (!$adminToUpdate) {
    //         return $this->response->setJSON([
    //             'error' => 'Administrador no encontrado'
    //         ])->setStatusCode(404);
    //     }

    //     $historialData = [
    //         'id' => $this->generateId('historialAdmin'),
    //         'realizado_por' => $dni_admin,
    //         'dni_admin' => $dni,
    //         'fecha_accion' => date('Y-m-d H:i:s', strtotime('-5 hours')),
    //         'accion' => $accion,
    //         'motivo' => $motivo
    //     ];

    //     switch ($accion) {
    //         case 'estado':
    //             $estado = $data['estado'] ?? null;
    //             if (!$estado || !in_array($estado, ['activo', 'inactivo'])) {
    //                 return $this->response->setJSON([
    //                     'error' => 'Falta el estado'
    //                 ])->setStatusCode(400);
    //             }
    //             $updateResult = $this->administradoresModel
    //                 ->update($dni, ['estado' => $estado]);
    //             if (!$updateResult) {
    //                 return $this->response->setJSON([
    //                     'error' => 'No se pudo actualizar el estado del administrador'
    //                 ])->setStatusCode(500);
    //             }

    //             $this->historialAdminModel
    //                 ->insert($historialData);
    //             return $this->response->setJSON([
    //                 'message' => 'Estado actualizado correctamente',
    //                 'estado' => $estado,
    //                 'admin' => $this->administradoresModel->find($dni)
    //             ])->setStatusCode(200);
    //             break;
    //         case 'categoria':
    //             $categoria = $data['categoria'] ?? null;
    //             if (!$categoria || !in_array($categoria, ['admin', 'super_admin'])) {
    //                 return $this->response->setJSON([
    //                     'error' => 'Falta la categoría'
    //                 ])->setStatusCode(400);
    //             }
    //             $updateResult = $this->administradoresModel
    //                 ->update($dni, ['categoria' => $categoria]);
    //             if (!$updateResult) {
    //                 return $this->response->setJSON([
    //                     'error' => 'No se pudo actualizar la categoría del administrador'
    //                 ])->setStatusCode(500);
    //             }

    //             $this->historialAdminModel
    //                 ->insert($historialData);
    //             return $this->response->setJSON([
    //                 'message' => 'Categoría actualizada correctamente',
    //                 'categoria' => $categoria,
    //                 'admin' => $this->administradoresModel->find($dni)
    //             ])->setStatusCode(200);
    //             break;

    //         case 'password':
    //             $password = $data['password'] ?? null;
    //             if (!$password) {
    //                 return $this->response->setJSON([
    //                     'error' => 'Falta la contraseña'
    //                 ])->setStatusCode(400);
    //             }
    //             $updateResult = $this->administradoresModel
    //                 ->update($dni, ['password' => password_hash($password, PASSWORD_DEFAULT)]);
    //             if (!$updateResult) {
    //                 return $this->response->setJSON([
    //                     'error' => 'No se pudo actualizar la contraseña del administrador'
    //                 ])->setStatusCode(500);
    //             }

    //             $this->historialAdminModel
    //                 ->insert($historialData);
    //             return $this->response->setJSON([
    //                 'message' => 'Contraseña actualizada correctamente',
    //                 'admin' => $this->administradoresModel->find($dni)
    //             ])->setStatusCode(200);
    //             break;
    //         default:
    //             return $this->response->setJSON([
    //                 'error' => 'Acción no válida'
    //             ])->setStatusCode(400);
    //     }
    // }
    // public function searchAdmin()
    // {
    //     $dni = $this->request->getGet('dni_admin');
    //     if (!$dni) {
    //         return $this->response->setJSON(['error' => 'DNI no proporcionado'])->setStatusCode(400);
    //     }
    //     $admin = $this->administradoresModel->find($dni);
    //     if (!$admin) {
    //         return $this->response->setJSON(['error' => 'Administrador no encontrado'])->setStatusCode(404);
    //     }
    //     return $this->response->setJSON($admin);
    // }
    // public function historyAdmin()
    // {
    //     $history = $this->historialAdminModel
    //         ->select('historial_admin.*, administradores.nombres AS admin_nombre, administradores.categoria AS admin_categoria')
    //         ->join('administradores', 'historial_admin.dni_admin = administradores.dni_admin', 'left')
    //         ->findAll();
    //     if (!$history) {
    //         return $this->response->setJSON(['error' => 'No se encontraron registros de historial'], 404);
    //     }
    //     return $this->response->setJSON($history);
    // }

    public function createAdministrador()
    {

        // $data = $this->request->getJSON(true);

        // // Verificar si ya existe un administrador con ese DNI
        // $existingAdmin = $this->administradoresModel->where('dni', $data['dni'])->first();
        // if ($existingAdmin) {
        //     return $this->response->setJSON([
        //         'error' => 'Ya existe un administrador con ese DNI'
        //     ])->setStatusCode(400);
        // }

        // $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

        // try {
        //     $success = $this->administradoresModel->insert($data);

        //     if ($success) {
        //         $newAdmin = $this->administradoresModel->find($this->administradoresModel->getInsertID());
        //         return $this->response->setJSON($newAdmin)->setStatusCode(201);
        //     } else {
        //         return $this->response->setJSON([
        //             'error' => 'Error al crear el administrador'
        //         ])->setStatusCode(500);
        //     }
        // } catch (\Exception $e) {
        //     log_message('error', 'Error al crear administrador: ' . $e->getMessage());
        //     return $this->response->setJSON([
        //         'error' => 'Error al crear el administrador'
        //     ])->setStatusCode(500);
        // }

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
        $data      = $this->request->getJSON(true);
        $accion    = $data['accion'] ?? null;
        $admin_id  = $data['administrador_id'] ?? null; // el que hace la acción
        $afectado  = $data['afectado_id'] ?? null;      // el admin afectado
        $motivo    = $data['motivo'] ?? null;

        if (!$accion || !$admin_id || !$afectado || !$motivo) {
            return $this->response->setJSON([
                'error' => 'Faltan parámetros obligatorios'
            ])->setStatusCode(400);
        }

        $adminToUpdate = $this->administradoresModel->find($afectado);
        if (!$adminToUpdate) {
            return $this->response->setJSON([
                'error' => 'Administrador no encontrado'
            ])->setStatusCode(404);
        }

        $historialData = [
            'administrador_id' => $admin_id,
            'afectado_id'      => $afectado,
            'accion'           => $accion,
            'motivo'           => $motivo
        ];

        switch ($accion) {
            case 'estado':
                $estado = $data['estado'] ?? null;
                if (!isset($estado) || !in_array($estado, ['1', '0'])) {
                    return $this->response->setJSON([
                        'error' => 'Falta el estado'
                    ])->setStatusCode(400);
                }

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

            case 'rol':
                $rol = $data['rol'] ?? null;
                if (!$rol) {
                    return $this->response->setJSON([
                        'error' => 'Falta el rol'
                    ])->setStatusCode(400);
                }

                $updateResult = $this->administradoresModel->update($afectado, ['rol' => $rol]);
                if (!$updateResult) {
                    return $this->response->setJSON([
                        'error' => 'No se pudo actualizar el rol del administrador'
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
        $dni = $this->request->getGet('dni');
        if (!$dni) {
            return $this->response->setJSON(['error' => 'DNI no proporcionado'])->setStatusCode(400);
        }

        $admin = $this->administradoresModel->where('dni', $dni)->first();
        if (!$admin) {
            return $this->response->setJSON(['error' => 'Administrador no encontrado'])->setStatusCode(404);
        }

        return $this->response->setJSON($admin);
    }

    public function historyAdmin()
    {
        $history = $this->historialAdminModel
            ->select('historial_admin.*, a.nombre AS admin_nombre, b.nombre AS afectado_nombre')
            ->join('administrador a', 'historial_admin.administrador_id = a.id', 'left')
            ->join('administrador b', 'historial_admin.afectado_id = b.id', 'left')
            ->findAll();

        if (!$history) {
            return $this->response->setJSON(['error' => 'No se encontraron registros de historial'], 404);
        }

        return $this->response->setJSON($history);
    }
}
