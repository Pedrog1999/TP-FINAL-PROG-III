<?php 

namespace App\Dto\Request\News;

final readonly class NewsRequest {
    public function __construct(
        private string $title,
        private string $body,
        private string $category,
        private ?string $imageUrl = null,
    ) {}
    
    public function getTitle(): string { return $this->title; }
    public function getBody(): string { return $this->body; }
    public function getCategory(): string { return $this->category; }
    public function getImageUrl(): ?string { return $this->imageUrl; }
}