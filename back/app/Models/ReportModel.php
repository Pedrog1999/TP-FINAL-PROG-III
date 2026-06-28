<?php 

namespace App\Models;

use App\Entity\Report\Report;
use Config\Database;
use CodeIgniter\Database\BaseConnection;
use DateTime;

final class ReportModel {

    private BaseConnection $database;

    public function __construct() {
        $this->database = Database::connect();
    }

    public function insert(Report $report): Report
    {
        $query = "INSERT INTO reports (title, body, author_id, created_at) VALUES (?, ?, ?, ?)";
        $this->database->query($query, [
            $report->getTitle(), $report->getBody(), $report->getAuthorId(),
            $report->getCreatedAt()->format("Y-m-d H:i:s"),
        ]);

        $id = $this->database->insertID();
        return new Report($id, $report->getTitle(), $report->getBody(), $report->getAuthorId(), $report->getCreatedAt());
    }

    public function findAll(): array
    {
        $query = "SELECT r.*, u.username as author_name, u.role_id as author_role, p.profile_picture as author_avatar, 
                         (SELECT COUNT(*) FROM report_comments WHERE report_id = r.id) as comment_count
                  FROM reports r 
                  JOIN users u ON r.author_id = u.id 
                  LEFT JOIN profiles p ON u.id = p.user_id 
                  ORDER BY r.created_at DESC";
        return $this->database->query($query)->getResult();
    }

    public function find(int $id): ?object
    {
        $query = "SELECT r.*, u.username as author_name, u.role_id as author_role, p.profile_picture as author_avatar
                  FROM reports r 
                  JOIN users u ON r.author_id = u.id 
                  LEFT JOIN profiles p ON u.id = p.user_id 
                  WHERE r.id = ?";
        return $this->database->query($query, [$id])->getRow();
    }

    public function findByAuthor(int $authorId): array
    {
        $query = "SELECT r.*, u.username as author_name, u.role_id as author_role,
                         (SELECT COUNT(*) FROM report_comments WHERE report_id = r.id) as comment_count
                  FROM reports r 
                  JOIN users u ON r.author_id = u.id 
                  WHERE r.author_id = ? 
                  ORDER BY r.created_at DESC";
        return $this->database->query($query, [$authorId])->getResult();
    }

    public function countByAuthor(int $authorId): int
    {
        $query = "SELECT COUNT(*) as total FROM reports WHERE author_id = ?";
        return $this->database->query($query, [$authorId])->getRow()->total ?? 0;
    }

    public function delete(int $id): void
    {
        $this->database->query("DELETE FROM reports WHERE id = ?", [$id]);
    }
}