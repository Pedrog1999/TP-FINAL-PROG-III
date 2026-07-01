<?php

namespace App\Entity;

use App\Dto\Request\TerminalCommandRequest;
use DateTime;

final class TerminalCommand
{
    public function __construct(
        private ?int $id,
        private string $command,
        private string $description,
        private string $outputType,
        private array $payload,
        private bool $isActive,
        private int $sortOrder,
        private ?DateTime $createdAt,
        private ?DateTime $updatedAt
    ) {}

    public static function fromRequest(TerminalCommandRequest $request): self
    {
        return new self(
            null,
            $request->command,
            $request->description,
            $request->output_type,
            $request->payload,
            $request->is_active ?? true,
            $request->sort_order ?? 0,
            new DateTime(),
            new DateTime()
        );
    }

    // Getters y setters...
    public function getId(): ?int { return $this->id; }
    public function getCommand(): string { return $this->command; }
    public function getDescription(): string { return $this->description; }
    public function getOutputType(): string { return $this->outputType; }
    public function getPayload(): array { return $this->payload; }
    public function isActive(): bool { return $this->isActive; }
    public function getSortOrder(): int { return $this->sortOrder; }
    public function getCreatedAt(): ?DateTime { return $this->createdAt; }
    public function getUpdatedAt(): ?DateTime { return $this->updatedAt; }

    public function setCommand(string $command): void { $this->command = $command; }
    public function setDescription(string $description): void { $this->description = $description; }
    public function setOutputType(string $outputType): void { $this->outputType = $outputType; }
    public function setPayload(array $payload): void { $this->payload = $payload; }
    public function setIsActive(bool $isActive): void { $this->isActive = $isActive; }
    public function setSortOrder(int $sortOrder): void { $this->sortOrder = $sortOrder; }
}