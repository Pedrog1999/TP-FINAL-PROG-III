<?php 

namespace App\Controllers\ReportComment;

use App\Dto\Request\Report\ReportCommentRequest;
use App\Models\UserModel;
use App\Services\ReportComment\ReportCommentCreatorService;
use App\Services\ReportComment\ReportCommentDeleterService;
use App\Services\ReportComment\ReportCommentFinderService;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

final class ReportCommentController extends ResourceController {

    private ReportCommentFinderService $finder;
    private ReportCommentCreatorService $creator;
    private ReportCommentDeleterService $deleter;
    private UserModel $userModel;

    public function __construct() {
        $this->finder = new ReportCommentFinderService();
        $this->creator = new ReportCommentCreatorService();
        $this->deleter = new ReportCommentDeleterService();
        $this->userModel = new UserModel();
    }

    private function getCurrentUser() {
        $token = str_replace('Bearer ', '', $this->request->getHeaderLine('Authorization'));
        return $this->userModel->findByToken($token);
    }

    private function getReportId(): int
    {
        $segments = $this->request->getUri()->getSegments();
        return (int) ($segments[2] ?? 0);
    }

    public function index(): ResponseInterface
    {
        $reportId = $this->getReportId();
        return $this->respond(['status' => 200, 'data' => $this->finder->findByReport($reportId)], 200);
    }

    public function create(): ResponseInterface
    {
        $reportId = $this->getReportId();
        $user = $this->getCurrentUser();
        $input = $this->request->getJSON();
        $req = new ReportCommentRequest($input->body);
        try {
            $this->creator->create($req, $reportId, $user->getId());
            $comments = $this->finder->findByReport($reportId);
            return $this->respondCreated(['status' => 201, 'data' => $comments]);
        } catch (\Exception $e) {
            return $this->respond(['status' => 500, 'message' => $e->getMessage()], 500);
        }
    }

    public function delete($id = null): ResponseInterface
    {
        $user = $this->getCurrentUser();
        $comment = $this->finder->find((int)$id);

        if (empty($comment)) {
            return $this->respond(['status' => 404, 'message' => 'Comentario no encontrado'], 404);
        }

        if ($user->getRoleId() !== 3 && $comment->author_id != $user->getId()) {
            return $this->respond(['status' => 403, 'message' => 'No tenés permisos'], 403);
        }

        try {
            $this->deleter->delete((int)$id);
            return $this->respond(['status' => 200, 'message' => 'Eliminado'], 200);
        } catch (\Exception $e) {
            return $this->respond(['status' => 404, 'message' => $e->getMessage()], 404);
        }
    }
}