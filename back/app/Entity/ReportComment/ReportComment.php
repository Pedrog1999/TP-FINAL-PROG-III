<?php 

namespace App\Entity\ReportComment;

use App\Dto\Request\Report\ReportCommentRequest;
use DateTime;

final class ReportComment {
    public function __construct(
        private ?int $id,
        private string $body,
        private int $reportId,
        private int $authorId,
        private ?DateTime $createdAt
    ) {}

    public function getId(): ?int { return $this->id; }
    public function getBody(): string { return $this->body; }
    public function getReportId(): int { return $this->reportId; }
    public function getAuthorId(): int { return $this->authorId; }
    public function getCreatedAt(): ?DateTime { return $this->createdAt; }

    public static function fromRequest(ReportCommentRequest $request, int $reportId, int $authorId): self
    {
        return new self(null, $request->getBody(), $reportId, $authorId, new DateTime());
    }
}