<?php 

namespace App\Controllers\Report;

use App\Dto\Request\Report\ReportRequest;
use App\Models\UserModel;
use App\Services\Report\ReportCreatorService;
use App\Services\Report\ReportDeleterService;
use App\Services\Report\ReportFinderService;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

final class ReportController extends ResourceController {

    private ReportFinderService $finder;
    private ReportCreatorService $creator;
    private ReportDeleterService $deleter;
    private UserModel $userModel;

    public function __construct() {
        $this->finder = new ReportFinderService();
        $this->creator = new ReportCreatorService();
        $this->deleter = new ReportDeleterService();
        $this->userModel = new UserModel();
    }

    private function getCurrentUser() {
        $token = str_replace('Bearer ', '', $this->request->getHeaderLine('Authorization'));
        return $this->userModel->findByToken($token);
    }

    public function index(): ResponseInterface {
        return $this->respond(['status' => 200, 'data' => $this->finder->findAll()], 200);
    }

    public function show($id = null): ResponseInterface {
        try { return $this->respond(['status' => 200, 'data' => $this->finder->find((int)$id)], 200); }
        catch (\Exception $e) { return $this->respond(['status' => 404, 'message' => $e->getMessage()], 404); }
    }

    public function create(): ResponseInterface {
        $user = $this->getCurrentUser();
        $input = $this->request->getJSON();
        $req = new ReportRequest($input->title, $input->body);
        try {
            $report = $this->creator->create($req, $user->getId());
            return $this->respondCreated(['status' => 201, 'data' => $report]);
        } catch (\Exception $e) {
            return $this->respond(['status' => 500, 'message' => $e->getMessage()], 500);
        }
    }

    public function delete($id = null): ResponseInterface
    {
        $user = $this->getCurrentUser();
        $report = $this->finder->find((int)$id);

        if (empty($report)) {
            return $this->respond(['status' => 404, 'message' => 'Reporte no encontrado'], 404);
        }

        if ($user->getRoleId() !== 3 && $report->author_id != $user->getId()) {
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