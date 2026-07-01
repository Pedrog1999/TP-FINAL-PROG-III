<?php

namespace App\Controllers;

use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;
use Config\Database;

final class TerminalCommandController extends ResourceController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }

    public function index(): ResponseInterface
    {
        $rows = $this->db->query("SELECT * FROM terminal_commands ORDER BY sort_order ASC")->getResult();
        foreach ($rows as $row) {
            $row->payload = json_decode($row->payload, true);
        }
        return $this->respond(['status' => 200, 'data' => $rows], 200);
    }

    public function create(): ResponseInterface
    {
        $input = $this->request->getJSON(true);

        if (in_array($input['output_type'], ['plain', 'ascii']) && isset($input['payload']['text'])) {
            $input['payload'] = [
                'lines' => [
                    ['text' => $input['payload']['text'], 'style' => 'dim']
                ]
            ];
        }

        $this->db->query(
            "INSERT INTO terminal_commands (command, description, output_type, payload, is_active, sort_order, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
            [
                $input['command'],
                $input['description'],
                $input['output_type'],
                json_encode($input['payload']),
                ($input['is_active'] ?? true) ? 1 : 0,
                $input['sort_order'] ?? 0,
            ]
        );

        $id = $this->db->insertID();
        $cmd = $this->db->query("SELECT * FROM terminal_commands WHERE id = ?", [$id])->getRow();
        $cmd->payload = json_decode($cmd->payload, true);

        return $this->respondCreated(['status' => 201, 'data' => $cmd]);
    }

    public function update($id = null): ResponseInterface
    {
        $input = $this->request->getJSON(true);

        if (in_array($input['output_type'], ['plain', 'ascii']) && isset($input['payload']['text'])) {
            $input['payload'] = [
                'lines' => [
                    ['text' => $input['payload']['text'], 'style' => 'dim']
                ]
            ];
        }

        $this->db->query(
            "UPDATE terminal_commands SET command=?, description=?, output_type=?, payload=?, is_active=?, sort_order=?, updated_at=NOW() WHERE id=?",
            [
                $input['command'],
                $input['description'],
                $input['output_type'],
                json_encode($input['payload']),
                ($input['is_active'] ?? true) ? 1 : 0,
                $input['sort_order'] ?? 0,
                (int)$id,
            ]
        );

        $cmd = $this->db->query("SELECT * FROM terminal_commands WHERE id = ?", [(int)$id])->getRow();
        $cmd->payload = json_decode($cmd->payload, true);

        return $this->respond(['status' => 200, 'data' => $cmd], 200);
    }

    public function delete($id = null): ResponseInterface
    {
        $this->db->query("DELETE FROM terminal_commands WHERE id = ?", [(int)$id]);
        return $this->respond(['status' => 200, 'message' => 'Comando eliminado'], 200);
    }
}