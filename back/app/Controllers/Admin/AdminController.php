<?php 

namespace App\Controllers\Admin;

use App\Services\User\UserBadgeUpdaterService;
use App\Services\User\UserBanToggleService;
use App\Services\User\UserRoleUpdaterService;
use App\Services\User\UsersListerService;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

final class AdminController extends ResourceController {

    private UsersListerService $usersListerService;
    private UserRoleUpdaterService $userRoleUpdaterService;
    private UserBanToggleService $userBanToggleService;
    private UserBadgeUpdaterService $userBadgeUpdaterService;

    public function __construct() {
        $this->usersListerService = new UsersListerService();
        $this->userRoleUpdaterService = new UserRoleUpdaterService();
        $this->userBanToggleService = new UserBanToggleService();
        $this->userBadgeUpdaterService = new UserBadgeUpdaterService();
    }

    public function users(): ResponseInterface
    {
        $users = $this->usersListerService->listAll();
        return $this->respond(['status' => 200, 'data' => $users], 200);
    }

    public function updateRole($id): ResponseInterface
    {
        $input = $this->request->getJSON();

        try {
            $this->userRoleUpdaterService->updateRole((int) $id, $input->role_id ?? 1);
            return $this->respond(['status' => 200, 'message' => 'Rol actualizado'], 200);
        } catch (\Exception $e) {
            return $this->respond(['status' => 404, 'message' => $e->getMessage()], 404);
        }
    }

    public function updateBadge($id): ResponseInterface
    {
        $input = $this->request->getJSON();

        try {
            $this->userBadgeUpdaterService->updateBadge((int) $id, $input->badge_id ?? 1);
            return $this->respond(['status' => 200, 'message' => 'Badge actualizado'], 200);
        } catch (\Exception $e) {
            return $this->respond(['status' => 404, 'message' => $e->getMessage()], 404);
        }
    }

    public function toggleBan($id): ResponseInterface
    {
        try {
            $message = $this->userBanToggleService->toggle((int) $id);
            return $this->respond(['status' => 200, 'message' => $message], 200);
        } catch (\Exception $e) {
            return $this->respond(['status' => 404, 'message' => $e->getMessage()], 404);
        }
    }
}