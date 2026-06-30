<?php 

namespace App\Controllers\User;

use App\Dto\Request\User\UserLoginRequest;
use App\Exception\User\UserNotFoundException;
use App\Exception\User\UserWrongPasswordException;
use App\Services\User\UserLoginService;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;
use RuntimeException;

final class UserLoginController extends ResourceController {

    private UserLoginService $userLoginService;

    public function __construct() {
        $this->userLoginService = new UserLoginService();
    }

    public function login(): ResponseInterface
    {
        return $this->response
            ->setHeader('Access-Control-Allow-Origin', '*')
            ->setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
            ->setHeader('Access-Control-Allow-Headers', 'Content-Type')
            ->setJSON(['status' => 200]);
    }

    public function create(): ResponseInterface
    {
        try {
            $request = $this->getRequest();
            $response = $this->userLoginService->login($request);

            return $this->respond([
                'status' => 200,
                'data' => $response
            ], 200);
        } catch (UserNotFoundException $e) {
            return $this->respond([
                'status' => 404,
                'message' => $e->getMessage()
            ], 404);
        } catch (UserWrongPasswordException $e) {
            return $this->respond([
                'status' => 401,
                'message' => 'Usuario o contraseña incorrectos'
            ], 401);
        } catch (RuntimeException $e) {
            return $this->respond([
                'status' => 403,
                'message' => $e->getMessage()
            ], 403);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => 500,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    private function getRequest(): UserLoginRequest
    {
        $clientRequest = $this->request->getJSON();

        return new UserLoginRequest(
            $clientRequest->username,
            $clientRequest->password
        );
    }
}