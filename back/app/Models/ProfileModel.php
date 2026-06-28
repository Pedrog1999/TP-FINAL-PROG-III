<?php 

namespace App\Models;

use App\Entity\Profile\Profile;
use Config\Database;
use CodeIgniter\Database\BaseConnection;
use DateTime;

final class ProfileModel {

    private BaseConnection $database;

    public function __construct() {
        $this->database = Database::connect();
    }

    public function insert(Profile $profile): Profile
    {
        $query = "INSERT INTO profiles (user_id, bio, signature, profile_picture, badge_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";

        $this->database->query($query, [
            $profile->getUserId(),
            $profile->getBio(),
            $profile->getSignature(),
            $profile->getProfilePicture(),
            $profile->getBadgeId(),
            $profile->getCreatedAt()->format("Y-m-d H:i:s"),
            $profile->getUpdatedAt()->format("Y-m-d H:i:s"),
        ]);

        $id = $this->database->insertID();

        return new Profile(
            $id,
            $profile->getUserId(),
            $profile->getBio(),
            $profile->getSignature(),
            $profile->getProfilePicture(),
            $profile->getBadgeId(),
            $profile->getCreatedAt(),
            $profile->getUpdatedAt()
        );
    }

    public function findByUserId(int $userId): ?Profile
    {
        $query = "SELECT * FROM profiles WHERE user_id = ?";
        $result = $this->database->query($query, [$userId]);
        $row = $result->getRow();

        if (empty($row)) return null;

        return new Profile(
            $row->id, $row->user_id, $row->bio, $row->signature,
            $row->profile_picture, $row->badge_id,
            new DateTime($row->created_at), new DateTime($row->updated_at)
        );
    }

    public function update(Profile $profile): Profile
    {
        $query = "UPDATE profiles SET bio = ?, signature = ?, profile_picture = ?, updated_at = ? WHERE user_id = ?";

        $this->database->query($query, [
            $profile->getBio(),
            $profile->getSignature(),
            $profile->getProfilePicture(),
            (new DateTime())->format("Y-m-d H:i:s"),
            $profile->getUserId(),
        ]);

        return $profile;
    }
}