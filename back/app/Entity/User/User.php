<?php 

namespace App\Entity\User;

use App\Dto\Request\User\UserRequest;
use DateTime;

final class User {
    public function __construct(
        private ?int $id,
        private string $username,
        private string $email,
        private string $password,
        private int $roleId,
        private bool $isBanned = false,
        private ?DateTime $createdAt = null,
        private ?DateTime $updatedAt = null,
        private ?string $token = null,
        private ?DateTime $tokenExpirationDate = null
    ) {}

    public function update(UserRequest $request): void
    {
        $this->username = $request->getUserName();
        $this->email = $request->getEmail();
        $this->password = $request->getPassword();
    }

    public function getId(): ?int { return $this->id; }
    public function getUserName(): string { return $this->username; }
    public function getEmail(): string { return $this->email; }
    public function getPassword(): string { return $this->password; }
    public function getRoleId(): int { return $this->roleId; }
    public function getIsBanned(): bool { return $this->isBanned; }
    public function getCreatedAt(): ?DateTime { return $this->createdAt; }
    public function getUpdatedAt(): ?DateTime { return $this->updatedAt; }
    public function getToken(): ?string { return $this->token; }
    public function getTokenExpirationDate(): ?DateTime { return $this->tokenExpirationDate; }

    public function verifyPassword(string $password): bool
    {
        return password_verify($password, $this->password);
    }

    public function generateToken(): void
    {
        $this->token = md5($this->email.rand(1000,9999).date("YmdHis"));
        $this->tokenExpirationDate = new DateTime("+1 hours");
    }

    public static function convertFromRequest(UserRequest $request): User
    {
        return new User(
            null,
            $request->getUserName(),
            $request->getEmail(),
            password_hash($request->getPassword(), PASSWORD_BCRYPT),
            1,
            false,
            new DateTime(),
            new DateTime(),
            null,
            null
        );
    }
}