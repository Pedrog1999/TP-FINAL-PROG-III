<?php 

namespace App\Controllers\User;

use App\Dto\Request\User\UserRequest;
use App\Exception\User\UserAlreadyExistsException;
use App\Services\User\UserCreatorService;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

final class UserRegisterController extends ResourceController {

    private UserCreatorService $userCreatorService;

    public function __construct() {
        $this->userCreatorService = new UserCreatorService();
    }

    public function register(): ResponseInterface
    {
        try {
            $request = $this->getRequest();
            $response = $this->userCreatorService->create($request);

            return $this->respondCreated([
                'status' => 201,
                'data' => $response
            ]);
        } catch (UserAlreadyExistsException $e) {
            return $this->respond([
                'status' => 409,
                'message' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => 500,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    private function getRequest(): UserRequest
    {
        $clientRequest = $this->request->getJSON();

        return new UserRequest(
            $clientRequest->username,
            $clientRequest->email,
            $clientRequest->password
        );
    }
}