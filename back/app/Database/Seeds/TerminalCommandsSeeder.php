<?php


namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class TerminalCommandsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'command'     => 'show tables;',
                'description' => 'lista las 6 entidades',
                'output_type' => 'table',
                'sort_order'  => 1,
                'payload'     => json_encode([
                    'rows' => [
                        ['name' => 'roles',         'fields' => ['id','name'],                                                       'note' => 'USER · AUDITOR · ADMIN'],
                        ['name' => 'users',         'fields' => ['id','username','email','password_hash','role_id','is_banned'],      'note' => 'FK → roles'],
                        ['name' => 'user_profiles', 'fields' => ['id','user_id','bio','avatar_path'],                                'note' => 'FULLTEXT: bio'],
                        ['name' => 'news',          'fields' => ['id','author_id','title','body','status'],                          'note' => 'draft · published · deleted'],
                        ['name' => 'reports',       'fields' => ['id','user_id','title','body','status','created_at'],               'note' => 'FULLTEXT: title + body — entidad central'],
                        ['name' => 'suggestions',   'fields' => ['id','report_id','user_id','parent_id','body','status'],            'note' => 'self-ref → hilo anidado'],
                    ],
                ]),
            ],
            [
                'command'     => 'describe architecture;',
                'description' => '8 capas del backend',
                'output_type' => 'list',
                'sort_order'  => 2,
                'payload'     => json_encode([
                    'items' => [
                        ['label' => 'Entity',     'desc' => 'Mapeo directo de la tabla. Sin lógica.'],
                        ['label' => 'Model',      'desc' => 'Queries, scopes y acceso a la BD.'],
                        ['label' => 'DTO',        'desc' => 'Objeto de transferencia entre capas.'],
                        ['label' => 'Converter',  'desc' => 'Transforma Entity ↔ DTO.'],
                        ['label' => 'Request',    'desc' => 'Valida y encapsula la entrada HTTP.'],
                        ['label' => 'Service',    'desc' => 'Lógica de negocio pura. Orquesta el flujo.'],
                        ['label' => 'Response',   'desc' => 'Formatea la salida HTTP.'],
                        ['label' => 'Controller', 'desc' => 'Solo entrada/salida. Delega al Service.'],
                    ],
                ]),
            ],
            [
                'command'     => 'explain decisions;',
                'description' => 'decisiones técnicas y por qué',
                'output_type' => 'keyval',
                'sort_order'  => 3,
                'payload'     => json_encode([
                    'items' => [
                        ['title' => 'Única responsabilidad por capa',            'body' => 'El Controller no conoce la BD, el Model no conoce HTTP. Si algo falla, el problema está acotado a una sola capa.'],
                        ['title' => 'Soft delete en lugar de borrado físico',    'body' => 'News, reports y suggestions usan status="deleted". Los datos no se pierden y se pueden auditar.'],
                        ['title' => 'user_profiles separado de users',           'body' => 'users maneja autenticación. user_profiles maneja presentación pública. Responsabilidades distintas.'],
                        ['title' => 'FULLTEXT sobre reports y profiles',         'body' => 'LIKE es lento en tablas grandes. FULLTEXT indexa el contenido y devuelve resultados por pertinencia.'],
                        ['title' => 'parent_id auto-referencial en suggestions', 'body' => 'Un campo parent_id nullable sobre la misma tabla resuelve el hilo anidado sin tabla extra.'],
                        ['title' => 'is_banned en users para auth rápida',       'body' => 'El login chequea is_banned sin joinear la tabla de bans. Rendimiento en el punto más crítico.'],
                    ],
                ]),
            ],
            [
                'command'     => 'show relations;',
                'description' => 'relaciones entre entidades',
                'output_type' => 'list',
                'sort_order'  => 4,
                'payload'     => json_encode([
                    'items' => [
                        ['label' => 'roles → users',           'desc' => '1 ──< un rol tiene muchos usuarios'],
                        ['label' => 'users → user_profiles',   'desc' => '1 ──1 perfil público separado de auth'],
                        ['label' => 'users → reports',         'desc' => '1 ──< un usuario crea muchos reportes'],
                        ['label' => 'users → news',            'desc' => '1 ──< auditores y admins publican noticias'],
                        ['label' => 'users → suggestions',     'desc' => '1 ──< un usuario hace muchas sugerencias'],
                        ['label' => 'reports → suggestions',   'desc' => '1 ──< un reporte tiene muchas sugerencias'],
                        ['label' => 'suggestions → suggestions','desc' => '1 ──< self-ref: hilo anidado'],
                    ],
                ]),
            ],
            [
                'command'     => 'show roles;',
                'description' => 'permisos por rol',
                'output_type' => 'keyval',
                'sort_order'  => 5,
                'payload'     => json_encode([
                    'items' => [
                        ['title' => 'USER (id=1)',    'body' => 'Leer noticias · Crear reportes · Buscar perfiles y reportes · Participar en hilos · Administrar perfil y avatar'],
                        ['title' => 'AUDITOR (id=2)', 'body' => 'Todo lo del USER · Publicar y editar noticias · Distintivo en avatar · Sus sugerencias se destacan visualmente'],
                        ['title' => 'ADMIN (id=3)',   'body' => 'Todo lo del AUDITOR · Ascender usuarios a cualquier rol · Banear usuarios temporal o permanentemente · Eliminar reportes y noticias'],
                    ],
                ]),
            ],
            [
                'command'     => 'whoami',
                'description' => 'autor del proyecto',
                'output_type' => 'ascii',
                'sort_order'  => 6,
                'payload'     => json_encode([
                    'lines' => [
                        ['text' => ' +---------------------------+ ', 'style' => 'green'],
                        ['text' => ' |          U T N            | ', 'style' => 'dimGreen'],
                        ['text' => ' |   PROGRAMACION III        | ', 'style' => 'green'],
                        ['text' => ' +---------------------------+ ', 'style' => 'dimGreen'],
                        ['text' => '  by Pedro Gianibelli — UTN Tecnicatura Universitaria en Programación (Prog III)', 'style' => 'dim'],
                    ],
                ]),
            ],
            [
                'command'     => '/terminal',
                'description' => 'cómo funciona la consola',
                'output_type' => 'plain',
                'sort_order'  => 7,
                'payload'     => json_encode([
                    'lines' => [
                        ['text' => 'ACCESS DENIED TERMINAL v1.0',                                                                  'style' => 'green'],
                        ['text' => 'Esta consola es una simulación interactiva del backend del proyecto.',                         'style' => 'dim'],
                        ['text' => 'Los comandos muestran entidades, arquitectura, relaciones y decisiones técnicas implementadas.','style' => 'dim'],
                        ['text' => 'Tip: explorá los comandos ocultos además de /help.',                                           'style' => 'dimGreen'],
                    ],
                ]),
            ],
            [
                'command'     => '/project',
                'description' => 'información del proyecto',
                'output_type' => 'plain',
                'sort_order'  => 8,
                'payload'     => json_encode([
                    'lines' => [
                        ['text' => 'ACCESS DENIED',                                              'style' => 'green'],
                        ['text' => 'Proyecto final de Programación III.',                        'style' => 'dim'],
                        ['text' => 'Comunidad orientada a hacking ético y ciberseguridad.',      'style' => 'dim'],
                        ['text' => 'React · CodeIgniter 4 · MySQL · JWT · Docker.',              'style' => 'dim'],
                    ],
                ]),
            ],
            [
                'command'     => '/security',
                'description' => 'resumen de seguridad',
                'output_type' => 'plain',
                'sort_order'  => 9,
                'payload'     => json_encode([
                    'lines' => [
                        ['text' => '[ SECURITY OVERVIEW ]',    'style' => 'green'],
                        ['text' => '• JWT Authentication',     'style' => 'dim'],
                        ['text' => '• Roles & Permissions',    'style' => 'dim'],
                        ['text' => '• Soft Delete Strategy',   'style' => 'dim'],
                        ['text' => '• Input Validation',       'style' => 'dim'],
                        ['text' => '• Layered Architecture',   'style' => 'dim'],
                    ],
                ]),
            ],
            [
                'command'     => '/docker',
                'description' => 'infraestructura containerizada',
                'output_type' => 'plain',
                'sort_order'  => 10,
                'payload'     => json_encode([
                    'lines' => [
                        ['text' => '[services:]',              'style' => 'green'],
                        ['text' => 'frontend → React + Vite',  'style' => 'dim'],
                        ['text' => 'backend → CodeIgniter 4',  'style' => 'dim'],
                        ['text' => 'database → MySQL 8',       'style' => 'dim'],
                        ['text' => 'phpmyadmin',               'style' => 'dim'],
                    ],
                ]),
            ],
            [
                'command'     => '/hack',
                'description' => 'easter egg',
                'output_type' => 'ascii',
                'sort_order'  => 11,
                'payload'     => json_encode([
                    'lines' => [
                        ['text' => '██╗  ██╗ █████╗  ██████╗██╗  ██╗', 'style' => 'green'],
                        ['text' => '██║  ██║██╔══██╗██╔════╝██║ ██╔╝', 'style' => 'green'],
                        ['text' => '███████║███████║██║     █████╔╝ ', 'style' => 'green'],
                        ['text' => '██╔══██║██╔══██║██║     ██╔═██╗ ', 'style' => 'green'],
                        ['text' => '██║  ██║██║  ██║╚██████╗██║  ██╗', 'style' => 'green'],
                        ['text' => '╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝','style' => 'green'],
                        ['text' => 'Hack the planet.',                  'style' => 'dim'],
                    ],
                ]),
            ],
            [
                'command'     => '/matrix',
                'description' => 'acceso al mainframe',
                'output_type' => 'ascii',
                'sort_order'  => 12,
                'payload'     => json_encode([
                    'lines' => [
                        ['text' => '01001000 01000001 01000011 01001011', 'style' => 'green'],
                        ['text' => 'ACCESSING MAINFRAME...',             'style' => 'dimGreen'],
                        ['text' => '█ █ █ █ █ █ █ █ █ █ █ █ █',         'style' => 'green'],
                        ['text' => 'Access granted.',                    'style' => 'dim'],
                    ],
                ]),
            ],
            [
                'command'     => '/coffee',
                'description' => 'combustible del desarrollador',
                'output_type' => 'ascii',
                'sort_order'  => 13,
                'payload'     => json_encode([
                    'lines' => [
                        ['text' => ' ( (',     'style' => 'green'],
                        ['text' => '  ) )',    'style' => 'green'],
                        ['text' => '........', 'style' => 'green'],
                        ['text' => '|      |]','style' => 'green'],
                        ['text' => '\\      /','style' => 'green'],
                        ['text' => " `----'", 'style' => 'green'],
                        ['text' => 'Developer fuel detected.', 'style' => 'dim'],
                    ],
                ]),
            ],
            [
                'command'     => '/ghost',
                'description' => 'visitante anónimo',
                'output_type' => 'ascii',
                'sort_order'  => 14,
                'payload'     => json_encode([
                    'lines' => [
                        ['text' => ' .-. ',  'style' => 'green'],
                        ['text' => '(o o)', 'style' => 'green'],
                        ['text' => '| O |', 'style' => 'green'],
                        ['text' => '|   |', 'style' => 'green'],
                        ['text' => "'~~~'", 'style' => 'green'],
                        ['text' => 'Anonymous visitor detected.', 'style' => 'dim'],
                    ],
                ]),
            ],
            [
                'command'     => '/cat',
                'description' => 'cyber cat',
                'output_type' => 'ascii',
                'sort_order'  => 15,
                'payload'     => json_encode([
                    'lines' => [
                        ['text' => '/\\_/\\\\', 'style' => 'green'],
                        ['text' => '( o.o )', 'style' => 'green'],
                        ['text' => ' > ^ <',  'style' => 'green'],
                        ['text' => 'Cyber cat online.', 'style' => 'dim'],
                    ],
                ]),
            ],
            [
                'command'     => 'iddqd',
                'description' => 'easter egg Doom',
                'output_type' => 'plain',
                'sort_order'  => 16,
                'payload'     => json_encode([
                    'lines' => [
                        ['text' => 'CHEAT CODE ACCEPTED',                                       'style' => 'green'],
                        ['text' => '+30 puntos por revisar el proyecto completo.',              'style' => 'dim'],
                        ['text' => 'Achievement unlocked: Curious Professor',                  'style' => 'dimGreen'],
                    ],
                ]),
            ],
        ];

        $this->db->table('terminal_commands')->insertBatch($data);
    }
}