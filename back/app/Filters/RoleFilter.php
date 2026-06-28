<?php

namespace App\Filters;

use App\Models\UserModel;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class RoleFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $token = $request->getHeaderLine('Authorization');
        $token = str_replace('Bearer ', '', $token);

        $userModel = new UserModel();
        $user = $userModel->findByToken($token);

        if (empty($user)) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['message' => 'No autorizado']);
        }

        // $arguments es un array con los role_id permitidos: [2, 3]
        if (!empty($arguments) && !in_array($user->getRoleId(), $arguments)) {
            return service('response')
                ->setStatusCode(403)
                ->setJSON(['message' => 'No tenés permisos para esta acción']);
        }

        $request->user = $user;

        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $response;
    }
}