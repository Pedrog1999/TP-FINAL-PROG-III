<?php 

namespace App\Dto\Response\User;

final readonly class UserResponse {
    public function __construct(
        public int $id,
        public string $username,
        public string $email,
    ) {}
}