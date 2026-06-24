<?php
// app/Controllers/TerminalCommandController.php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Services\TerminalCommandService;

class TerminalCommandController extends ResourceController
{
    protected TerminalCommandService $service;

    public function __construct()
    {
        $this->service = new TerminalCommandService();
    }

    // GET /terminal-commands
    public function index()
    {
        return $this->respond([
            'status' => 'ok',
            'data'   => $this->service->getAll(),
        ]);
    }

    // GET /terminal-commands/(:segment)  → por command string
    public function show($command = null)
    {
        $result = $this->service->getByCommand(urldecode($command));

        if (!$result) {
            return $this->failNotFound('Comando no encontrado');
        }

        return $this->respond(['status' => 'ok', 'data' => $result]);
    }

    // POST /terminal-commands
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$data) {
            return $this->failValidationErrors('Payload inválido');
        }

        $this->service->create($data);
        return $this->respondCreated(['status' => 'created']);
    }

    // PUT /terminal-commands/(:num)
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);

        if (!$data) {
            return $this->failValidationErrors('Payload inválido');
        }

        $this->service->update((int)$id, $data);
        return $this->respond(['status' => 'updated']);
    }

    // DELETE /terminal-commands/(:num)
    public function delete($id = null)
    {
        $this->service->delete((int)$id);
        return $this->respondDeleted(['status' => 'deleted']);
    }
}