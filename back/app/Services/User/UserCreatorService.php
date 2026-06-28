<?php 

namespace App\Services\User;

use App\Converter\User\UserToUserResponseConverter;
use App\Dto\Request\User\UserRequest;
use App\Dto\Response\User\UserResponse;
use App\Entity\User\User;
use App\Exception\User\UserAlreadyExistsException;
use App\Models\UserModel;

final class UserCreatorService {

    private UserModel $userModel;
    private UserToUserResponseConverter $converter;

    public function __construct() {
        $this->userModel = new UserModel();
        $this->converter = new UserToUserResponseConverter();
    }

    public function create(UserRequest $request): UserResponse
    {
        $existingEmail = $this->userModel->findByEmail($request->getEmail());
        if (!empty($existingEmail)) {
            throw new UserAlreadyExistsException('email');
        }

        $existingUsername = $this->userModel->findByUsername($request->getUserName());
        if (!empty($existingUsername)) {
            throw new UserAlreadyExistsException('usuario');
        }

        $user = User::convertFromRequest($request);
        $newUser = $this->userModel->insert($user);

        return $this->converter->convert($newUser);
    }
}