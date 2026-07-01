<?php

namespace App\Services\TerminalCommand;

use App\Models\TerminalCommandModel;
use RuntimeException;

final class TerminalCommandFinderService
{
    private TerminalCommandModel $model;

    public function __construct() { $this->model = new TerminalCommandModel(); }

    public function findAll(): array { return $this->model->findAll(); }

    public function find(int $id): object
    {
        $cmd = $this->model->find($id);
        if (!$cmd) throw new RuntimeException("Comando no encontrado", 404);
        return $cmd;
    }
}