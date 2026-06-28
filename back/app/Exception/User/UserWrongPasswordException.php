<?php 

namespace App\Exception\User;

use RuntimeException;

final class UserWrongPasswordException extends RuntimeException {
    public function __construct() {
        parent::__construct("Datos inválidos.", 401);
    }
}