<?php 

namespace App\Services\User;

use App\Dto\Request\User\UserLoginRequest;
use App\Dto\Response\User\UserLoginResponse;
use App\Exception\User\UserWrongPasswordException;
use App\Models\UserModel;

final class UserLoginService {
    
    private UserModel $userModel;
    private UserFinderByUsernameService $userFinderByUsernameService;

    public function __construct() {
        $this->userModel = new UserModel();
        $this->userFinderByUsernameService = new UserFinderByUsernameService();
    }

    public function login(UserLoginRequest $request): UserLoginResponse
    {
        $user = $this->userFinderByUsernameService->find($request->getUserName());

        if (!$user->verifyPassword($request->getPassword())) {
            throw new UserWrongPasswordException();
        }

        $user->generateToken();

        $this->userModel->update($user);

        return new UserLoginResponse($user->getToken());
    }
}