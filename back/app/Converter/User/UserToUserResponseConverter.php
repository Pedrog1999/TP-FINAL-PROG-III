<?php 

namespace App\Converter\User;

use App\Dto\Response\User\UserResponse;
use App\Entity\User\User;

final class UserToUserResponseConverter {

    public function convert(User $user): UserResponse
    {
        return new UserResponse(
            $user->getId(),
            $user->getUserName(),
            $user->getEmail()
        );
    }
}