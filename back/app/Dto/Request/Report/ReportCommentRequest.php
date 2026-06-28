<?php 

namespace App\Dto\Request\Report;

final readonly class ReportCommentRequest {
    public function __construct(
        private string $body,
    ) {}
    
    public function getBody(): string { return $this->body; }
}