<?php
namespace App\Controllers\denuncias_corrupcion\Denuncias\Admin;

use App\Controllers\BaseController;
use App\Models\denuncias_corrupcion\denuncias\AdministradoresModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

    class VerificarController extends BaseController
    {
        private $administradoresModel;

        public function __construct()
        {
            $this->administradoresModel = new AdministradoresModel();
        }

        public function login()
        {
            $data = $this->request->getJSON(true);

            // CAMBIO: La columna en la BD es 'dni'
            $dni = $data['dni'] ?? '';
            $password = $data['password'] ?? '';

            // Buscamos al usuario por DNI. El modelo debe estar configurado para usar 'dni' como clave.
            $user = $this->administradoresModel->where('dni', $dni)->first();

            if (!$user) {
                return $this->response->setStatusCode(401)->setJSON(['error' => 'Usuario no encontrado']);
            }

            // CAMBIO: El estado 'activo' en la BD es '1'
            if ($user['estado'] !== '1') {
                return $this->response->setStatusCode(401)->setJSON(['error' => 'Tu cuenta ha sido desactivada.']);
            }

            if (password_verify($password, $user['password'])) {
                $key = env('JWT_SECRET');
                $exp = env('JWT_EXP', 3600);
                $payload = [
                    'iat' => time(),
                    'exp' => time() + $exp,
                    'data' => [
                        'dni' => $user['dni'],
                        'rol' => $user['rol'],
                    ]
                ];
                $token = JWT::encode($payload, $key, 'HS256'); 
                // $key = 'your-secret-key'; 
                // $payload = [
                //     'iat' => time(),
                //     'exp' => time() + 3600, // 1 hora de expiración
                //     'dni' => $user['dni'], // CAMBIO: Usamos 'dni'
                //     'rol' => $user['rol'], // CAMBIO: Usamos 'rol'
                // ];
                // $token = JWT::encode($payload, $key, 'HS256');

                
                $this->response->setCookie([
                    'name'     => 'access_token',
                    'value'    => $token,
                    'expire'   => time() + 3600,
                    'path'     => '/',
                    'secure'   => false, 
                    'httponly' => true,
                    'samesite' => 'Strict'
                ]);

                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Inicio de sesión exitoso.',
                    'user' => [
                        'dni'    => $user['dni'],
                        'nombre' => $user['nombre'],
                        'rol'    => $user['rol'],
                        'estado' => $user['estado'] 
                    ],
                ]);
            }
            
            return $this->response->setStatusCode(401)->setJSON(['error' => 'Contraseña incorrecta']);
        }

        public function getAdminInfo()
        {
            $token = $this->request->getCookie('access_token');
            if (!$token) {
                return $this->response->setStatusCode(401)->setJSON(['error' => 'No autorizado', 'forceLogout' => true]);
            }

            try {
                // $key = 'your-secret-key';
                // $decoded = JWT::decode($token, new Key($key, 'HS256'));
                $key = env('JWT_SECRET');
                $decoded = JWT::decode($token, new Key($key, 'HS256'));
                
                $dni = $decoded->data->dni; // CAMBIO: Leemos 'dni' del token
                $user = $this->administradoresModel->where('dni', $dni)->first();

                if (!$user) {
                    return $this->response->setStatusCode(401)->setJSON(['error' => 'Usuario del token no encontrado', 'forceLogout' => true]);
                }

                // CAMBIO: Verificamos el estado con '1'
                if ($user['estado'] !== '1') {
                    return $this->response->setStatusCode(401)->setJSON(['error' => 'Tu cuenta ha sido desactivada', 'forceLogout' => true]);
                }

                // Si el rol en la base de datos es diferente al del token, forzamos la actualización del token
                if ($decoded->data->rol !== $user['rol']) {
                    // Aquí podrías refrescar el token si quisieras, o simplemente devolver los datos actualizados.
                    // Por ahora, solo devolvemos la información más reciente de la BD.
                }
                
                return $this->response->setJSON([
                    'success' => true,
                    'user' => [
                        'dni'    => $user['dni'],
                        'nombre' => $user['nombre'],
                        'rol'    => $user['rol'],
                        'estado' => $user['estado'] // AÑADIDO: Se incluye el estado del usuario.
                    ]
                ]);

            } catch (\Exception $e) {
                // Si el token es inválido o expiró, forzamos el cierre de sesión en el frontend
                return $this->response->setStatusCode(401)->setJSON(['error' => 'Token inválido o expirado', 'forceLogout' => true]);
            }
        }

        public function logout()
        {
            // Elimina la cookie estableciendo una fecha de expiración en el pasado
            $this->response->setCookie([
                'name'   => 'access_token',
                'value'  => '',
                'expire' => time() - 3600,
                'path'   => '/',
            ]);
            return $this->response->setJSON(['success' => true, 'message' => 'Sesión cerrada correctamente.']);
        }
    }