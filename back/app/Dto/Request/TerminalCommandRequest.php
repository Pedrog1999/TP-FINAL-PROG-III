<?php

namespace App\Dto\Request;

final readonly class TerminalCommandRequest
{
    public function __construct(
        public string $command,
        public string $description,
        public string $output_type,
        public array $payload,
        public ?bool $is_active = true,
        public ?int $sort_order = 0
    ) {}
}