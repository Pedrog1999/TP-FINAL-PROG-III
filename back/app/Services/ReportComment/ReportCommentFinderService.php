<?php 

namespace App\Services\ReportComment;

use App\Models\ReportCommentModel;

final class ReportCommentFinderService {

    private ReportCommentModel $model;

    public function __construct() {
        $this->model = new ReportCommentModel();
    }

    public function findByReport(int $reportId): array
    {
        return $this->model->findByReport($reportId);
    }

    public function find(int $id): ?object
    {
        return $this->model->find($id);
    }
}