<?php 

namespace App\Dto\Request\News;

final readonly class NewsRequest {
    public function __construct(
        private string $title,
        private string $body,
        private string $category,
    ) {}
    
    public function getTitle(): string { return $this->title; }
    public function getBody(): string { return $this->body; }
    public function getCategory(): string { return $this->category; }
}