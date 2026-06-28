<?php 
namespace App\Services\ReportComment;
use App\Dto\Request\Report\ReportCommentRequest;
use App\Entity\ReportComment\ReportComment;
use App\Models\ReportCommentModel;

final class ReportCommentCreatorService {
    private ReportCommentModel $model;
    public function __construct() { $this->model = new ReportCommentModel(); }
    public function create(ReportCommentRequest $req, int $reportId, int $authorId): void {
        $comment = ReportComment::fromRequest($req, $reportId, $authorId);
        $this->model->insert($comment);
    }
}