<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateNewsTable extends Migration
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
        'author_id' => [
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
            'constraint' => ['draft', 'published', 'deleted'],
            'default'    => 'draft',
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
    $this->forge->addKey('author_id');
    $this->forge->addForeignKey('author_id', 'users', 'id', 'CASCADE', 'RESTRICT');
    $this->forge->createTable('news');
}

public function down()
{
    $this->forge->dropTable('news');
}
}
