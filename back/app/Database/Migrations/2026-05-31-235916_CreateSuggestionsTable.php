<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSuggestionsTable extends Migration
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
        'report_id' => [
            'type'       => 'INT',
            'constraint' => 11,
            'unsigned'   => true,
        ],
        'user_id' => [
            'type'       => 'INT',
            'constraint' => 11,
            'unsigned'   => true,
        ],
        'parent_id' => [
            'type'       => 'INT',
            'constraint' => 11,
            'unsigned'   => true,
            'null'       => true,
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
    $this->forge->addKey('report_id');
    $this->forge->addKey('user_id');
    $this->forge->addKey('parent_id');
    $this->forge->addForeignKey('report_id', 'reports', 'id', 'CASCADE', 'CASCADE');
    $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'RESTRICT');
    $this->forge->addForeignKey('parent_id', 'suggestions', 'id', 'CASCADE', 'SET NULL');
    $this->forge->createTable('suggestions');
}

public function down()
{
    $this->forge->dropTable('suggestions');
}
}
