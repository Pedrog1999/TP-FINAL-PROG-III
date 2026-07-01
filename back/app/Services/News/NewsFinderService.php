<?php 

namespace App\Services\News;

use App\Models\NewsModel;
use RuntimeException;

final class NewsFinderService {

    private NewsModel $newsModel;

    public function __construct() {
        $this->newsModel = new NewsModel();
    }

public function findAll(int $page = 1, int $limit = 10): array
{
    return [
        'items' => $this->newsModel->findAll($page, $limit),
        'total' => $this->newsModel->count(),
        'page' => $page,
        'limit' => $limit,
    ];
}

    public function find(int $id): array
    {
        $news = $this->newsModel->find($id);

        if (empty($news)) {
            throw new RuntimeException("Noticia no encontrada", 404);
        }

        return $news;
    }
}