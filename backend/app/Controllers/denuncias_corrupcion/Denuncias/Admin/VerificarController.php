<?php

// 1. NAMESPACE CORREGIDO: Ahora coincide con la estructura de carpetas.
namespace App\Controllers\denuncias_corrupcion\Denuncias\Admin;

use App\Controllers\BaseController;
use App\Models\denuncias_corrupcion\Denuncias\AdministradoresModel; // Asegúrate que el namespace de tu modelo sea correcto
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
            $key = 'your-secret-key'; // Es muy recomendable mover esta clave a un archivo de configuración (.env)
            $payload = [
                'iat' => time(),
                'exp' => time() + 3600, // 1 hora de expiración
                'dni' => $user['dni'], // CAMBIO: Usamos 'dni'
                'rol' => $user['rol'], // CAMBIO: Usamos 'rol'
            ];
            $token = JWT::encode($payload, $key, 'HS256');

            // Enviar el token como una cookie HttpOnly para mayor seguridad
            $this->response->setCookie([
                'name'     => 'auth_token',
                'value'    => $token,
                'expire'   => time() + 3600,
                'path'     => '/',
                'secure'   => false, // Cambiar a true en producción con HTTPS
                'httponly' => true,
                'samesite' => 'Strict'
            ]);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Inicio de sesión exitoso.',
                'user' => [
                    'dni'    => $user['dni'],
                    'nombre' => $user['nombre'], // CAMBIO: Usamos 'nombre'
                    'rol'    => $user['rol'],    // CAMBIO: Usamos 'rol'
                ],
            ]);
        }
        
        return $this->response->setStatusCode(401)->setJSON(['error' => 'Contraseña incorrecta']);
    }

    public function getAdminInfo()
    {
        $token = $this->request->getCookie('auth_token');
        if (!$token) {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'No autorizado', 'forceLogout' => true]);
        }

        try {
            $key = 'your-secret-key';
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            
            $dni = $decoded->dni; // CAMBIO: Leemos 'dni' del token
            $user = $this->administradoresModel->where('dni', $dni)->first();

            if (!$user) {
                return $this->response->setStatusCode(401)->setJSON(['error' => 'Usuario del token no encontrado', 'forceLogout' => true]);
            }

            // CAMBIO: Verificamos el estado con '1'
            if ($user['estado'] !== '1') {
                return $this->response->setStatusCode(401)->setJSON(['error' => 'Tu cuenta ha sido desactivada', 'forceLogout' => true]);
            }

            // Si el rol en la base de datos es diferente al del token, forzamos la actualización del token
            if ($decoded->rol !== $user['rol']) {
                // Aquí podrías refrescar el token si quisieras, o simplemente devolver los datos actualizados.
                // Por ahora, solo devolvemos la información más reciente de la BD.
            }
            
            return $this->response->setJSON([
                'success' => true,
                'user' => [
                    'dni'    => $user['dni'],
                    'nombre' => $user['nombre'],
                    'rol'    => $user['rol'],
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
            'name'   => 'auth_token',
            'value'  => '',
            'expire' => time() - 3600,
            'path'   => '/',
        ]);
        return $this->response->setJSON(['success' => true, 'message' => 'Sesión cerrada correctamente.']);
    }
}
