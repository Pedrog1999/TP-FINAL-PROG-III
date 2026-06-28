<?php 

namespace App\Models;

use App\Converter\User\PrimitiveToUserConverter;
use App\Entity\User\User;
use Config\Database;
use CodeIgniter\Database\BaseConnection;
use DateTime;

final class UserModel {

    private BaseConnection $database;
    private PrimitiveToUserConverter $converter;

    public function __construct() {
        $this->database = Database::connect();
        $this->converter = new PrimitiveToUserConverter();
    }

    public function insert(User $user): User
    {
        $now = new DateTime();
        $createdAt = $user->getCreatedAt() ?? $now;
        $updatedAt = $user->getUpdatedAt() ?? $now;

        $query = "INSERT INTO users (username, email, password_hash, role_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)";

        $this->database->query($query, [
            $user->getUserName(), 
            $user->getEmail(), 
            $user->getPassword(), 
            $user->getRoleId(),
            $createdAt->format("Y-m-d H:i:s"),
            $updatedAt->format("Y-m-d H:i:s"),
        ]);

        $id = $this->database->insertID();

        return new User(
            $id,
            $user->getUserName(), 
            $user->getEmail(), 
            $user->getPassword(), 
            $user->getRoleId(),
            false,
            $createdAt,
            $updatedAt,
            null,
            null
        );
    }

    public function update(User $user): User
    {
        $tokenExp = $user->getTokenExpirationDate();
        $now = new DateTime();

        $query = "UPDATE users SET username = ?, email = ?, password_hash = ?, token = ?, token_expiration_date = ?, updated_at = ? WHERE id = ?";

        $this->database->query($query, [
            $user->getUserName(), 
            $user->getEmail(), 
            $user->getPassword(), 
            $user->getToken(),
            $tokenExp ? $tokenExp->format("Y-m-d H:i:s") : $now->format("Y-m-d H:i:s"),
            $now->format("Y-m-d H:i:s"),
            $user->getId()
        ]);

        return $user;
    }

    public function find(int $id): ?User
    {
        $query = "SELECT * FROM users WHERE id = ?";
        $result = $this->database->query($query, [$id]);
        $primitive = $result->getRow();

        if (empty($primitive)) return null;

        return $this->converter->convert($primitive);
    }

    public function findByUsername(string $username): ?User
    {
        $query = "SELECT * FROM users WHERE username = ?";
        $result = $this->database->query($query, [$username]);
        $primitive = $result->getRow();

        if (empty($primitive)) return null;

        return $this->converter->convert($primitive);
    }

    public function findByEmail(string $email): ?User
    {
        $query = "SELECT * FROM users WHERE email = ?";
        $result = $this->database->query($query, [$email]);
        $primitive = $result->getRow();

        if (empty($primitive)) return null;

        return $this->converter->convert($primitive);
    }

    public function findByToken(string $token): ?User
    {
        $now = new DateTime();
        $dateNow = $now->format("Y-m-d H:i:s");

        $query = "SELECT * FROM users WHERE token = ? AND token_expiration_date >= ?";
        $result = $this->database->query($query, [$token, $dateNow]);
        $primitive = $result->getRow();

        if (empty($primitive)) return null;

        return $this->converter->convert($primitive);
    }

    public function findAllWithProfile(): array
    {
        $query = "SELECT u.id, u.username, u.email, u.role_id, u.is_banned, u.created_at, 
                         COALESCE(p.badge_id, 1) as badge_id 
                  FROM users u 
                  LEFT JOIN profiles p ON u.id = p.user_id 
                  ORDER BY u.id ASC";

        $result = $this->database->query($query);
        return $result->getResult();
    }
}