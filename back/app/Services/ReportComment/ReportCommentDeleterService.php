<?php 
namespace App\Services\ReportComment;
use App\Models\ReportCommentModel;
use RuntimeException;

final class ReportCommentDeleterService {
    private ReportCommentModel $model;
    public function __construct() { $this->model = new ReportCommentModel(); }
    public function delete(int $id): void {
        if (!$this->model->find($id)) throw new RuntimeException("No encontrado", 404);
        $this->model->delete($id);
    }
}