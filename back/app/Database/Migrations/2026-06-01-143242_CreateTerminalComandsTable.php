<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTerminalCommandsTable extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'command' => [
                'type'       => 'VARCHAR',
                'constraint' => 60,
                'unique'     => true,
            ],
            'description' => [
                'type'       => 'VARCHAR',
                'constraint' => 160,
            ],
            // 'table' | 'list' | 'keyval' | 'ascii' | 'plain'
            'output_type' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            // JSON — estructura depende de output_type
            'payload' => [
                'type' => 'JSON',
            ],
            'is_active' => [
                'type'    => 'TINYINT',
                'constraint' => 1,
                'default' => 1,
            ],
            'sort_order' => [
                'type'    => 'INT',
                'constraint' => 11,
                'default' => 0,
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
        $this->forge->createTable('terminal_commands');
    }

    public function down(): void
    {
        $this->forge->dropTable('terminal_commands');
    }
}