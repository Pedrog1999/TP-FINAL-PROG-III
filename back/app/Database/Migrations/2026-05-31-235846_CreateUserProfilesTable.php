<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateUserProfilesTable extends Migration
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
        'bio' => [
            'type' => 'TEXT',
            'null' => true,
        ],
        'avatar_path' => [
            'type'       => 'VARCHAR',
            'constraint' => 255,
            'null'       => true,
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
    $this->forge->addUniqueKey('user_id');
    $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
    $this->forge->createTable('user_profiles');

    $this->db->query('ALTER TABLE user_profiles ADD FULLTEXT INDEX ft_profile (bio)');
}



public function down()
{
    $this->forge->dropTable('user_profiles');
}
}