<?php 

namespace App\Controllers\Profile;

use App\Services\Profile\ProfileService;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

final class ProfileController extends ResourceController {

    private ProfileService $profileService;

    public function __construct() {
        $this->profileService = new ProfileService();
    }

    public function show($username = null): ResponseInterface
    {
        try {
            $data = $this->profileService->getByUsername($username);
            return $this->respond(['status' => 200, 'data' => $data], 200);
        } catch (\Exception $e) {
            return $this->respond(['status' => 404, 'message' => $e->getMessage()], 404);
        }
    }

    public function editProfile(): ResponseInterface
    {
        $token = $this->request->getHeaderLine('Authorization');
        $token = str_replace('Bearer ', '', $token);

        $userModel = new \App\Models\UserModel();
        $user = $userModel->findByToken($token);

        $input = $this->request->getJSON();

        try {
            $data = $this->profileService->update($user->getId(), (array) $input);
            return $this->respond(['status' => 200, 'data' => $data], 200);
        } catch (\Exception $e) {
            return $this->respond(['status' => 400, 'message' => $e->getMessage()], 400);
        }
    }
}