<?php

namespace App\Filters;

use App\Models\UserModel;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $token = $request->getHeaderLine('Authorization');

        if (empty($token)) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['message' => 'Token requerido']);
        }

        $token = str_replace('Bearer ', '', $token);

        $userModel = new UserModel();
        $user = $userModel->findByToken($token);

        if (empty($user)) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['message' => 'Token inválido o expirado']);
        }

        // Guardar usuario en la request para usar después
        $request->user = $user;

        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $response;
    }
}