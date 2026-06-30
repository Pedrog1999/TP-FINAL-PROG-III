<?php 

namespace App\Services\User;

use App\Models\UserModel;
use RuntimeException;

final class UserBanToggleService {

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

        if ($user->getRoleId() === 3) {
            throw new RuntimeException("No se puede banear a un administrador", 403);
        }

        $newStatus = $user->getIsBanned() ? 0 : 1;
        $db = \Config\Database::connect();
        $db->query("UPDATE users SET is_banned = ? WHERE id = ?", [$newStatus, $userId]);

        return $newStatus ? 'Usuario baneado' : 'Usuario desbaneado';
    }
}