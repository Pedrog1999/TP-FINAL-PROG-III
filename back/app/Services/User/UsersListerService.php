<?php 

namespace App\Services\User;

use Config\Database;

final class UsersListerService {

    public function listAll(): array
    {
        $db = Database::connect();
        $result = $db->query(
            "SELECT u.id, u.username, u.email, u.role_id, u.is_banned, u.created_at, 
                    COALESCE(p.badge_id, 1) as badge_id 
             FROM users u 
             LEFT JOIN profiles p ON u.id = p.user_id 
             ORDER BY u.id ASC"
        );
        return $result->getResult();
    }
}