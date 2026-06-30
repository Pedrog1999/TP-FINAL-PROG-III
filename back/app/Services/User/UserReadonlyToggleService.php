<?php 

namespace App\Services\User;

use App\Models\UserModel;
use RuntimeException;

final class UserReadonlyToggleService {

    private UserModel $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    public function toggle(int $userId): string
    {
        $user = $this->userModel->find($userId);

        if (empty($user)) {
            throw new RuntimeException("Usuario no encontrado", 404);
        }

        $db = \Config\Database::connect();
        $result = $db->query("SELECT is_readonly FROM users WHERE id = ?", [$userId])->getRow();
        $newStatus = $result->is_readonly ? 0 : 1;
        $db->query("UPDATE users SET is_readonly = ? WHERE id = ?", [$newStatus, $userId]);

        return $newStatus ? 'Usuario en solo lectura' : 'Usuario desbloqueado';
    }
}