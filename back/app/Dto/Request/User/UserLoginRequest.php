<?php 

namespace App\Dto\Request\User;

final readonly class UserLoginRequest {
    public function __construct(
        private string $username,
        private string $password,
    ) {}
    
    public function getUserName(): string { return $this->username; }
    public function getPassword(): string { return $this->password; }
}