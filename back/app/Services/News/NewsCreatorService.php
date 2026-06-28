<?php 

namespace App\Services\News;

use App\Dto\Request\News\NewsRequest;
use App\Entity\News\News;
use App\Models\NewsModel;

final class NewsCreatorService {

    private NewsModel $newsModel;

    public function __construct() {
        $this->newsModel = new NewsModel();
    }

    public function create(NewsRequest $request, int $authorId): array
    {
        $news = News::fromRequest($request, $authorId);
        $saved = $this->newsModel->insert($news);

        return $this->newsModel->find($saved->getId());
    }
}