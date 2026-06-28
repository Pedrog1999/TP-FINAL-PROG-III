<?php 
namespace App\Services\Report;
use App\Models\ReportModel;
use RuntimeException;

final class ReportFinderService {
    private ReportModel $model;
    public function __construct() { $this->model = new ReportModel(); }
    public function findAll(): array { return $this->model->findAll(); }
    public function find(int $id): object {
        $r = $this->model->find($id);
        if (!$r) throw new RuntimeException("Reporte no encontrado", 404);
        return $r;
    }
    public function findByAuthor(int $id): array { return $this->model->findByAuthor($id); }
    public function countByAuthor(int $id): int { return $this->model->countByAuthor($id); }
}