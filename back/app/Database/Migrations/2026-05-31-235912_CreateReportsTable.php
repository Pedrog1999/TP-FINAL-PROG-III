<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateReportsTable extends Migration
{
public function up()
{
    $this->forge->addField([
        'id' => [
            'type'           => 'INT',
            'constraint'     => 11,
            'unsigned'       => true,
            'auto_increment' => true,
        ],
        'user_id' => [
            'type'       => 'INT',
            'constraint' => 11,
            'unsigned'   => true,
        ],
        'title' => [
            'type'       => 'VARCHAR',
            'constraint' => 255,
        ],
        'body' => [
            'type' => 'TEXT',
        ],
        'status' => [
            'type'       => 'ENUM',
            'constraint' => ['active', 'deleted'],
            'default'    => 'active',
        ],
        'created_at' => [
            'type' => 'DATETIME',
            'null' => true,
        ],
        'updated_at' => [
            'type' => 'DATETIME',
            'null' => true,
        ],
    ]);

    $this->forge->addKey('id', true);
    $this->forge->addKey('user_id');
    $this->forge->addKey('created_at');
    $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'RESTRICT');
    $this->forge->createTable('reports');

    $this->db->query('ALTER TABLE reports ADD FULLTEXT INDEX ft_reports (title, body)');
}

public function down()
{
    $this->forge->dropTable('reports');
}
}
