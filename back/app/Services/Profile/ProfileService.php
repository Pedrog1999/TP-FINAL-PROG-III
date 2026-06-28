<?php 

namespace App\Services\Profile;

use App\Entity\Profile\Profile;
use App\Models\ProfileModel;
use App\Models\UserModel;
use RuntimeException;

final class ProfileService {

    private ProfileModel $profileModel;
    private UserModel $userModel;

    public function __construct() {
        $this->profileModel = new ProfileModel();
        $this->userModel = new UserModel();
    }

    public function getByUsername(string $username): array
    {
        $user = $this->userModel->findByUsername($username);

        if (empty($user)) {
            throw new RuntimeException("Usuario no encontrado", 404);
        }

        $profile = $this->profileModel->findByUserId($user->getId());

        if (empty($profile)) {
            throw new RuntimeException("Perfil no encontrado", 404);
        }

        return [
            'username' => $user->getUserName(),
            'bio' => $profile->getBio(),
            'signature' => $profile->getSignature(),
            'profile_picture' => $profile->getProfilePicture(),
            'badge_id' => $profile->getBadgeId(),
            'created_at' => $profile->getCreatedAt()->format("Y-m-d"),
        ];
    }

    public function update(int $userId, array $data): array
    {
        $profile = $this->profileModel->findByUserId($userId);

        if (empty($profile)) {
            throw new RuntimeException("Perfil no encontrado", 404);
        }

        if (isset($data['bio'])) $profile->setBio($data['bio']);
        if (isset($data['signature'])) $profile->setSignature($data['signature']);
        if (isset($data['profile_picture'])) $profile->setProfilePicture($data['profile_picture']);

        $this->profileModel->update($profile);

        return [
            'username' => '',
            'bio' => $profile->getBio(),
            'signature' => $profile->getSignature(),
            'profile_picture' => $profile->getProfilePicture(),
        ];
    }
}