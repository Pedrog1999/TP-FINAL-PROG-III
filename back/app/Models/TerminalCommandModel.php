<?php
// app/Models/TerminalCommandModel.php

namespace App\Models;

use CodeIgniter\Database\ConnectionInterface;

class TerminalCommandModel
{
    protected ConnectionInterface $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function findAll(): array
    {
        return $this->db
            ->table('terminal_commands')
            ->where('is_active', 1)
            ->orderBy('sort_order', 'ASC')
            ->get()
            ->getResultArray();
    }

    public function findByCommand(string $command): ?array
    {
        $row = $this->db
            ->table('terminal_commands')
            ->where('command', $command)
            ->where('is_active', 1)
            ->get()
            ->getRowArray();

        return $row ?: null;
    }

    public function insert(array $data): bool
    {
        return $this->db->table('terminal_commands')->insert($data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->db->table('terminal_commands')->where('id', $id)->update($data);
    }

    public function delete(int $id): bool
    {
        return $this->db->table('terminal_commands')->where('id', $id)->delete();
    }
}