<?php 

namespace App\Exception\User;

use RuntimeException;

final class UserNotFoundException extends RuntimeException {
    public function __construct() {
        parent::__construct("Usuario no encontrado", 404);
    }
}