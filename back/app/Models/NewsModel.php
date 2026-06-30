<?php 

namespace App\Models;

use App\Entity\News\News;
use Config\Database;
use CodeIgniter\Database\BaseConnection;
use DateTime;

final class NewsModel {

    private BaseConnection $database;

    public function __construct() {
        $this->database = Database::connect();
    }

    public function insert(News $news): News
    {
        $query = "INSERT INTO news (title, body, image_url, category, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";

        $this->database->query($query, [
            $news->getTitle(),
            $news->getBody(),
            $news->getImageUrl(),
            $news->getCategory(),
            $news->getAuthorId(),
            $news->getCreatedAt()->format("Y-m-d H:i:s"),
            $news->getUpdatedAt()->format("Y-m-d H:i:s"),
        ]);

        $id = $this->database->insertID();

        return new News(
            $id,
            $news->getTitle(),
            $news->getBody(),
            $news->getCategory(),
            $news->getImageUrl(),
            $news->getAuthorId(),
            $news->getCreatedAt(),
            $news->getUpdatedAt()
        );
    }

    public function findAll(): array
    {
        $query = "SELECT n.*, u.username as author_name FROM news n JOIN users u ON n.author_id = u.id ORDER BY n.created_at DESC";
        $result = $this->database->query($query);
        $rows = $result->getResult();

        $news = [];
        foreach ($rows as $row) {
            $news[] = [
                'id' => $row->id,
                'title' => $row->title,
                'body' => $row->body,
                'image_url' => $row->image_url,
                'category' => $row->category,
                'author_id' => $row->author_id,
                'author_name' => $row->author_name,
                'created_at' => $row->created_at,
                'updated_at' => $row->updated_at,
            ];
        }

        return $news;
    }

    public function find(int $id): ?array
    {
        $query = "SELECT n.*, u.username as author_name FROM news n JOIN users u ON n.author_id = u.id WHERE n.id = ?";
        $result = $this->database->query($query, [$id]);
        $row = $result->getRow();

        if (empty($row)) return null;

        return [
            'id' => $row->id,
            'title' => $row->title,
            'body' => $row->body,
            'image_url' => $row->image_url,
            'category' => $row->category,
            'author_id' => $row->author_id,
            'author_name' => $row->author_name,
            'created_at' => $row->created_at,
            'updated_at' => $row->updated_at,
        ];
    }

    public function update(News $news): void
    {
        $query = "UPDATE news SET title = ?, body = ?, image_url = ?, category = ?, updated_at = ? WHERE id = ?";

        $this->database->query($query, [
            $news->getTitle(),
            $news->getBody(),
            $news->getImageUrl(),
            $news->getCategory(),
            (new DateTime())->format("Y-m-d H:i:s"),
            $news->getId(),
        ]);
    }

    public function delete(int $id): void
    {
        $query = "DELETE FROM news WHERE id = ?";
        $this->database->query($query, [$id]);
    }
}