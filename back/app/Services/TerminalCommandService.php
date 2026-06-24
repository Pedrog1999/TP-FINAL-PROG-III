<?php

namespace App\Services;

use App\Models\TerminalCommandModel;

class TerminalCommandService
{
    protected TerminalCommandModel $model;

    public function __construct()
    {
        $this->model = new TerminalCommandModel();
    }

    public function getAll(): array
    {
        $rows = $this->model->findAll();
        return array_map([$this, 'decode'], $rows);
    }

    public function getByCommand(string $command): ?array
    {
        $row = $this->model->findByCommand($command);
        return $row ? $this->decode($row) : null;
    }

    public function create(array $data): bool
    {
        $data['payload'] = json_encode($data['payload']);
        return $this->model->insert($data);
    }

    public function update(int $id, array $data): bool
    {
        if (isset($data['payload'])) {
            $data['payload'] = json_encode($data['payload']);
        }
        return $this->model->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->model->delete($id);
    }

    private function decode(array $row): array
    {
        $row['payload'] = json_decode($row['payload'], true);
        return $row;
    }
}