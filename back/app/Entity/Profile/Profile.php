<?php 

namespace App\Entity\Profile;

use DateTime;

final class Profile {
    public function __construct(
        private ?int $id,
        private int $userId,
        private string $bio,
        private string $signature,
        private ?string $profilePicture,
        private int $badgeId,
        private ?DateTime $createdAt,
        private ?DateTime $updatedAt
    ) {}

    public function getId(): ?int { return $this->id; }
    public function getUserId(): int { return $this->userId; }
    public function getBio(): string { return $this->bio; }
    public function getSignature(): string { return $this->signature; }
    public function getProfilePicture(): ?string { return $this->profilePicture; }
    public function getBadgeId(): int { return $this->badgeId; }
    public function getCreatedAt(): ?DateTime { return $this->createdAt; }
    public function getUpdatedAt(): ?DateTime { return $this->updatedAt; }

    public function setBio(string $bio): void { $this->bio = $bio; }
    public function setSignature(string $signature): void { $this->signature = $signature; }
    public function setProfilePicture(?string $url): void { $this->profilePicture = $url; }

    public static function create(int $userId): self
    {
        return new self(null, $userId, 'Novato en el foro', '', null, 1, new DateTime(), new DateTime());
    }
}