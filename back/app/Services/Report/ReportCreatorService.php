<?php 
namespace App\Services\Report;
use App\Dto\Request\Report\ReportRequest;
use App\Entity\Report\Report;
use App\Models\ReportModel;

final class ReportCreatorService {
    private ReportModel $model;
    public function __construct() { $this->model = new ReportModel(); }
    
    public function create(ReportRequest $req, int $authorId): object {
        $report = Report::fromRequest($req, $authorId);
        $saved = $this->model->insert($report);
        return $this->model->find($saved->getId());
    }
}