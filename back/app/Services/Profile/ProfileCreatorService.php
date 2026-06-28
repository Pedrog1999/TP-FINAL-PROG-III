<?php 

namespace App\Services\Profile;

use App\Entity\Profile\Profile;
use App\Models\ProfileModel;

final class ProfileCreatorService {

    private ProfileModel $profileModel;

    public function __construct() {
        $this->profileModel = new ProfileModel();
    }

    public function create(int $userId): Profile
    {
        $profile = Profile::create($userId);
        return $this->profileModel->insert($profile);
    }
}