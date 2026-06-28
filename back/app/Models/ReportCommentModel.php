<?php 

namespace App\Models;

use App\Entity\ReportComment\ReportComment;
use Config\Database;
use CodeIgniter\Database\BaseConnection;

final class ReportCommentModel {

    private BaseConnection $database;

    public function __construct() {
        $this->database = Database::connect();
    }

    public function insert(ReportComment $comment): ReportComment
    {
        $query = "INSERT INTO report_comments (body, report_id, author_id, created_at) VALUES (?, ?, ?, ?)";
        $this->database->query($query, [
            $comment->getBody(), $comment->getReportId(), $comment->getAuthorId(),
            $comment->getCreatedAt()->format("Y-m-d H:i:s"),
        ]);

        $id = $this->database->insertID();
        return new ReportComment($id, $comment->getBody(), $comment->getReportId(), $comment->getAuthorId(), $comment->getCreatedAt());
    }

    public function findByReport(int $reportId): array
    {
        $query = "SELECT c.*, u.username as author_name, u.role_id as author_role, p.profile_picture as author_avatar
                  FROM report_comments c 
                  JOIN users u ON c.author_id = u.id 
                  LEFT JOIN profiles p ON u.id = p.user_id 
                  WHERE c.report_id = ? 
                  ORDER BY c.created_at ASC";
        return $this->database->query($query, [$reportId])->getResult();
    }

    public function find(int $id): ?object
    {
        return $this->database->query("SELECT * FROM report_comments WHERE id = ?", [$id])->getRow();
    }

    public function delete(int $id): void
    {
        $this->database->query("DELETE FROM report_comments WHERE id = ?", [$id]);
    }
}