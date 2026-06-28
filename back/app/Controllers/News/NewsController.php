<?php 

namespace App\Controllers\News;

use App\Dto\Request\News\NewsRequest;
use App\Models\UserModel;
use App\Services\News\NewsCreatorService;
use App\Services\News\NewsDeleterService;
use App\Services\News\NewsFinderService;
use App\Services\News\NewsUpdaterService;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

final class NewsController extends ResourceController {

    private NewsFinderService $newsFinderService;
    private NewsCreatorService $newsCreatorService;
    private NewsUpdaterService $newsUpdaterService;
    private NewsDeleterService $newsDeleterService;
    private UserModel $userModel;

    public function __construct() {
        $this->newsFinderService = new NewsFinderService();
        $this->newsCreatorService = new NewsCreatorService();
        $this->newsUpdaterService = new NewsUpdaterService();
        $this->newsDeleterService = new NewsDeleterService();
        $this->userModel = new UserModel();
    }

    private function getCurrentUser()
    {
        $token = $this->request->getHeaderLine('Authorization');
        $token = str_replace('Bearer ', '', $token);
        return $this->userModel->findByToken($token);
    }

    public function index(): ResponseInterface
    {
        $news = $this->newsFinderService->findAll();
        return $this->respond(['status' => 200, 'data' => $news], 200);
    }

    public function show($id = null): ResponseInterface
    {
        try {
            $news = $this->newsFinderService->find((int) $id);
            return $this->respond(['status' => 200, 'data' => $news], 200);
        } catch (\Exception $e) {
            return $this->respond(['status' => 404, 'message' => $e->getMessage()], 404);
        }
    }

    public function create(): ResponseInterface
    {
        $user = $this->getCurrentUser();
        $input = $this->request->getJSON();

        $request = new NewsRequest(
            $input->title,
            $input->body,
            $input->category ?? 'news'
        );

        try {
            $news = $this->newsCreatorService->create($request, $user->getId());
            return $this->respondCreated(['status' => 201, 'data' => $news]);
        } catch (\Exception $e) {
            return $this->respond(['status' => 500, 'message' => $e->getMessage()], 500);
        }
    }

    public function update($id = null): ResponseInterface
    {
        $input = $this->request->getJSON();

        $request = new NewsRequest(
            $input->title,
            $input->body,
            $input->category ?? 'news'
        );

        try {
            $news = $this->newsUpdaterService->update((int) $id, $request);
            return $this->respond(['status' => 200, 'data' => $news], 200);
        } catch (\Exception $e) {
            return $this->respond(['status' => 404, 'message' => $e->getMessage()], 404);
        }
    }

public function delete($id = null): ResponseInterface
{
    $user = $this->getCurrentUser();

    if ($user->getRoleId() !== 3) {
        $news = $this->newsFinderService->find((int)$id);
        if ($news['author_id'] != $user->getId()) {
            return $this->respond(['status' => 403, 'message' => 'No tenés permisos'], 403);
        }
    }

    try {
        $this->newsDeleterService->delete((int)$id);
        return $this->respond(['status' => 200, 'message' => 'Noticia eliminada'], 200);
    } catch (\Exception $e) {
        return $this->respond(['status' => 404, 'message' => $e->getMessage()], 404);
    }
}
}