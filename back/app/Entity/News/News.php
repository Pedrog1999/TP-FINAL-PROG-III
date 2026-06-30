<?php 

namespace App\Entity\News;

use App\Dto\Request\News\NewsRequest;
use DateTime;

final class News {
    public function __construct(
        private ?int $id,
        private string $title,
        private string $body,
        private string $category,
        private ?string $imageUrl,
        private int $authorId,
        private ?DateTime $createdAt,
        private ?DateTime $updatedAt
    ) {}

    public function getId(): ?int { return $this->id; }
    public function getTitle(): string { return $this->title; }
    public function getBody(): string { return $this->body; }
    public function getCategory(): string { return $this->category; }
    public function getImageUrl(): ?string { return $this->imageUrl; }
    public function getAuthorId(): int { return $this->authorId; }
    public function getCreatedAt(): ?DateTime { return $this->createdAt; }
    public function getUpdatedAt(): ?DateTime { return $this->updatedAt; }

    public function setTitle(string $title): void { $this->title = $title; }
    public function setBody(string $body): void { $this->body = $body; }
    public function setCategory(string $category): void { $this->category = $category; }
    public function setImageUrl(?string $url): void { $this->imageUrl = $url; }

    public static function fromRequest(NewsRequest $request, int $authorId): self
    {
        return new self(
            null,
            $request->getTitle(),
            $request->getBody(),
            $request->getCategory(),
            $request->getImageUrl(),
            $authorId,
            new DateTime(),
            new DateTime()
        );
    }
}