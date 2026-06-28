<?php 

namespace App\Services\News;

use App\Models\NewsModel;
use RuntimeException;

final class NewsDeleterService {

    private NewsModel $newsModel;

    public function __construct() {
        $this->newsModel = new NewsModel();
    }

    public function delete(int $id): void
    {
        $existing = $this->newsModel->find($id);

        if (empty($existing)) {
            throw new RuntimeException("Noticia no encontrada", 404);
        }

        $this->newsModel->delete($id);
    }
}