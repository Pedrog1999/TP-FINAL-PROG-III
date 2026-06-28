<?php 

namespace App\Exception\User;

use RuntimeException;

final class UserAlreadyExistsException extends RuntimeException {
    public function __construct(string $field) {
        parent::__construct("El $field ya está registrado", 409);
    }
}