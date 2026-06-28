<?php 

namespace App\Services\User;

use App\Entity\User\User;
use App\Exception\User\UserNotFoundException;
use App\Models\UserModel;

final class UserFinderByUsernameService {
    
    private UserModel $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    public function find(string $username): User
    {
        $user = $this->userModel->findByUsername($username);

        if (empty($user)) {
            throw new UserNotFoundException();
        }

        return $user;
    }
}