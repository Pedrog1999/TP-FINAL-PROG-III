<?php

namespace App\Services\TerminalCommand;

use App\Models\TerminalCommandModel;
use RuntimeException;

final class TerminalCommandDeleterService
{
    private TerminalCommandModel $model;

    public function __construct() { $this->model = new TerminalCommandModel(); }

    public function delete(int $id): void
    {
        if (!$this->model->find($id)) throw new RuntimeException("Comando no encontrado", 404);
        $this->model->delete($id);
    }
}