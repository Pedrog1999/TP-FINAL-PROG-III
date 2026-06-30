<?php 

namespace App\Services\User;

use App\Dto\Request\User\UserLoginRequest;
use App\Dto\Response\User\UserLoginResponse;
use App\Exception\User\UserWrongPasswordException;
use App\Models\UserModel;
use RuntimeException;

final class UserLoginService {
    
    private UserModel $userModel;
    private UserFinderByUsernameService $userFinderByUsernameService;

    public function __construct() {
        $this->userModel = new UserModel();
        $this->userFinderByUsernameService = new UserFinderByUsernameService();
    }

    public function login(UserLoginRequest $request): UserLoginResponse
    {
        try {
            $user = $this->userFinderByUsernameService->find($request->getUserName());
        } catch (\App\Exception\User\UserNotFoundException $e) {
            throw new UserWrongPasswordException();
        }

        if ($user->getIsBanned()) {
            throw new RuntimeException("Tu cuenta fue suspendida");
        }

        if (!$user->verifyPassword($request->getPassword())) {
            throw new UserWrongPasswordException();
        }

        $user->generateToken();
        $this->userModel->update($user);

        return new UserLoginResponse(
            $user->getToken(),
            $user->getRoleId(),
            $user->getUserName()
        );
    }
}