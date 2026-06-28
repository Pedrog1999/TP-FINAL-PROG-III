<?php 
namespace App\Services\Report;
use App\Models\ReportModel;
use RuntimeException;

final class ReportDeleterService {
    private ReportModel $model;
    public function __construct() { $this->model = new ReportModel(); }
    public function delete(int $id): void {
        if (!$this->model->find($id)) throw new RuntimeException("No encontrado", 404);
        $this->model->delete($id);
    }
}