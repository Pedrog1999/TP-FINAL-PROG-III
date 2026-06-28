<?php 

namespace App\Dto\Request\Report;

final readonly class ReportRequest {
    public function __construct(
        private string $title,
        private string $body,
    ) {}
    
    public function getTitle(): string { return $this->title; }
    public function getBody(): string { return $this->body; }
}