<?php 

namespace App\Services\User;

use App\Models\UserModel;
use RuntimeException;

final class UserBadgeUpdaterService {

    private UserModel $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    public function updateBadge(int $userId, int $badgeId): void
    {
        $user = $this->userModel->find($userId);

        if (empty($user)) {
            throw new RuntimeException("Usuario no encontrado", 404);
        }

        $db = \Config\Database::connect();
        $db->query("UPDATE profiles SET badge_id = ? WHERE user_id = ?", [$badgeId, $userId]);
    }
}