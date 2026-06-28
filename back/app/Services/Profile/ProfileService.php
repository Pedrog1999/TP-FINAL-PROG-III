<?php 

namespace App\Services\Profile;

use App\Entity\Profile\Profile;
use App\Models\ProfileModel;
use App\Models\UserModel;
use App\Models\ReportModel;
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

        $reportModel = new ReportModel();
        $reportCount = $reportModel->countByAuthor($user->getId());
        $reports = $reportModel->findByAuthor($user->getId());

        return [
            'username' => $user->getUserName(),
            'role_id' => $user->getRoleId(),
            'bio' => $profile->getBio(),
            'signature' => $profile->getSignature(),
            'profile_picture' => $profile->getProfilePicture(),
            'badge' => $this->getBadgeName($profile->getBadgeId()),
            'created_at' => $profile->getCreatedAt()->format("Y-m-d"),
            'stats' => [
                'reports' => $reportCount,
            ],
            'reports' => $reports,
        ];
    }

    private function getBadgeName(int $badgeId): string
    {
        $badges = [1 => 'Newbie', 2 => 'Hacker', 3 => 'Elite', 4 => 'Auditor', 5 => 'Admin'];
        return $badges[$badgeId] ?? 'Newbie';
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
            'bio' => $profile->getBio(),
            'signature' => $profile->getSignature(),
            'profile_picture' => $profile->getProfilePicture(),
        ];
    }
}