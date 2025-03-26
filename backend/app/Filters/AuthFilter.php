<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');
        $token = null;

        // Verificar si el token está en el encabezado Authorization
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
        } 
        // Si no está en el encabezado, buscar en la sesión
        elseif (session()->has('token')) {
            $token = session()->get('token');
        }

        // Si no se encuentra el token, redirigir al login
        if (!$token) {
            return redirect()->to('/login')->with('error', 'Acceso no autorizado');
        }

        try {
            $decoded = JWT::decode($token, new Key('your-secret-key', 'HS256'));

            if ($arguments && !in_array($decoded->categoria, $arguments)) {
                return redirect()->to('/unauthorized')->with('error', 'Permisos insuficientes');
            }

            $request->user = $decoded;
        } catch (\Exception $e) {
            return redirect()->to('/login')->with('error', 'Token inválido o expirado');
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}