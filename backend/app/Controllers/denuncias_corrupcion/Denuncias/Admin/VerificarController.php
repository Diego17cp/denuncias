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

        $dni      = $data['dni'] ?? '';
        $password = $data['password'] ?? '';

        // Buscar al usuario por DNI
        $user = $this->administradoresModel->where('dni', $dni)->first();

        if (!$user) {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'Usuario no encontrado']);
        }

        // Validar estado activo
        if ($user['estado'] !== '1') {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'Tu cuenta ha sido desactivada.']);
        }

        // Verificar password
        if (password_verify($password, $user['password'])) {
            $key = env('JWT_SECRET');
            $exp = env('JWT_EXP', 3600);

            $payload = [
                'iat'  => time(),
                'exp'  => time() + $exp,
                'data' => [
                    'dni' => $user['dni'],
                    'rol' => $user['rol'],
                ]
            ];

            $token = JWT::encode($payload, $key, 'HS256');

            // Guardar token en cookie
            $this->response->setCookie([
                'name'     => 'access_token',
                'value'    => $token,
                'expire'   => time() + $exp,
                'path'     => '/',
                'secure'   => false,
                'httponly' => true,
                'samesite' => 'Strict'
            ]);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Inicio de sesión exitoso.',
                'user'    => [
                    'dni'    => $user['dni'],
                    'nombre' => $user['nombre'],
                    'rol'    => $user['rol'],
                    'estado' => $user['estado']
                ]
            ]);
        }

        return $this->response->setStatusCode(401)->setJSON(['error' => 'Contraseña incorrecta']);
    }

    public function getAdminInfo()
    {
        $token = $this->request->getCookie('access_token');

        if (!$token) {
            return $this->response->setStatusCode(401)->setJSON([
                'error'       => 'No autorizado',
                'forceLogout' => true
            ]);
        }

        try {
            $key     = env('JWT_SECRET');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));

            $dni  = $decoded->data->dni;
            $user = $this->administradoresModel->where('dni', $dni)->first();

            if (!$user) {
                return $this->response->setStatusCode(401)->setJSON([
                    'error'       => 'Usuario del token no encontrado',
                    'forceLogout' => true
                ]);
            }

            if ($user['estado'] !== '1') {
                return $this->response->setStatusCode(401)->setJSON([
                    'error'       => 'Tu cuenta ha sido desactivada',
                    'forceLogout' => true
                ]);
            }

            return $this->response->setJSON([
                'success' => true,
                'user'    => [
                    'dni'    => $user['dni'],
                    'nombre' => $user['nombre'],
                    'rol'    => $user['rol'],
                    'estado' => $user['estado']
                ]
            ]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(401)->setJSON([
                'error'       => 'Token inválido o expirado',
                'forceLogout' => true
            ]);
        }
    }

    public function logout()
    {
        $this->response->setCookie([
            'name'   => 'access_token',
            'value'  => '',
            'expire' => time() - 3600,
            'path'   => '/',
        ]);

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Sesión cerrada correctamente.'
        ]);
    }
}
