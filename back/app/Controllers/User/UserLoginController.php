<?php 

namespace App\Controllers\User;

use App\Dto\Request\User\UserLoginRequest;
use App\Exception\User\UserNotFoundException;
use App\Exception\User\UserWrongPasswordException;
use App\Services\User\UserLoginService;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

final class UserLoginController extends ResourceController {

    private UserLoginService $userLoginService;

    public function __construct() {
        $this->userLoginService = new UserLoginService();
    }

    public function login(): ResponseInterface
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
                'message' => $e->getMessage()
            ], 401);
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