<?php

namespace App\Models;

use Config\Database;
use CodeIgniter\Database\BaseConnection;

final class TerminalCommandModel
{
    private BaseConnection $database;

    public function __construct()
    {
        $this->database = Database::connect();
    }

    public function findAll(): array
    {
        $rows = $this->database->query(
            "SELECT * FROM terminal_commands ORDER BY sort_order ASC"
        )->getResult();

        foreach ($rows as $row) {
            $row->payload = json_decode($row->payload, true);
        }

        return $rows;
    }

    public function find(int $id): ?object
    {
        $row = $this->database->query(
            "SELECT * FROM terminal_commands WHERE id = ?", [$id]
        )->getRow();

        if ($row) {
            $row->payload = json_decode($row->payload, true);
        }

        return $row;
    }

    public function insert(array $data): int
    {
        $this->database->query(
            "INSERT INTO terminal_commands (command, description, output_type, payload, is_active, sort_order, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
            [
                $data['command'],
                $data['description'],
                $data['output_type'],
                json_encode($data['payload']),
                $data['is_active'] ? 1 : 0,
                $data['sort_order'] ?? 0,
            ]
        );

        return $this->database->insertID();
    }

    public function update(int $id, array $data): void
    {
        $this->database->query(
            "UPDATE terminal_commands SET command=?, description=?, output_type=?, payload=?, is_active=?, sort_order=?, updated_at=NOW() WHERE id=?",
            [
                $data['command'],
                $data['description'],
                $data['output_type'],
                json_encode($data['payload']),
                $data['is_active'] ? 1 : 0,
                $data['sort_order'] ?? 0,
                $id,
            ]
        );
    }

    public function delete(int $id): void
    {
        $this->database->query("DELETE FROM terminal_commands WHERE id = ?", [$id]);
    }
}