<?php 

namespace App\Services\News;

use App\Dto\Request\News\NewsRequest;
use App\Entity\News\News;
use App\Models\NewsModel;
use RuntimeException;

final class NewsUpdaterService {

    private NewsModel $newsModel;

    public function __construct() {
        $this->newsModel = new NewsModel();
    }

    public function update(int $id, NewsRequest $request): array
    {
        $existing = $this->newsModel->find($id);

        if (empty($existing)) {
            throw new RuntimeException("Noticia no encontrada", 404);
        }

        $news = new News(
            $id,
            $request->getTitle(),
            $request->getBody(),
            $request->getCategory(),
            $existing['author_id'],
            new \DateTime($existing['created_at']),
            new \DateTime()
        );

        $this->newsModel->update($news);

        return $this->newsModel->find($id);
    }
}