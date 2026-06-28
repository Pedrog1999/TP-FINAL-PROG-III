<?php 

namespace App\Services\User;

use App\Models\UserModel;
use RuntimeException;

final class UserRoleUpdaterService {

    private UserModel $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    public function updateRole(int $userId, int $roleId): void
    {
        $user = $this->userModel->find($userId);

        if (empty($user)) {
            throw new RuntimeException("Usuario no encontrado", 404);
        }

        $db = \Config\Database::connect();
        $db->query("UPDATE users SET role_id = ? WHERE id = ?", [$roleId, $userId]);
    }
}