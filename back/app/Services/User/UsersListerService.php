<?php 

namespace App\Services\User;

use Config\Database;

final class UsersListerService {

    public function listAll(): array
    {
        $db = Database::connect();
        $result = $db->query("SELECT id, username, email, role_id, is_banned, created_at FROM users ORDER BY id ASC");
        return $result->getResult();
    }
}