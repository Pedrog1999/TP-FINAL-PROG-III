<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->get('/', 'Home::index');

$routes->resource('terminal-commands', [
    'controller' => 'TerminalCommandController'
]);

// Auth
$routes->options('api/login', '\App\Controllers\User\UserLoginController::login');
$routes->options('api/register', '\App\Controllers\User\UserRegisterController::register');
$routes->post('api/login', '\App\Controllers\User\UserLoginController::create');
$routes->post('api/register', '\App\Controllers\User\UserRegisterController::create');

// Perfil
$routes->get('api/perfil/(:segment)', '\App\Controllers\Profile\ProfileController::show/$1', ['filter' => 'auth']);
$routes->put('api/perfil', '\App\Controllers\Profile\ProfileController::editProfile', ['filter' => 'auth']);

// noticias
$routes->get('api/noticias', '\App\Controllers\News\NewsController::index', ['filter' => 'auth']);
$routes->get('api/noticias/(:num)', '\App\Controllers\News\NewsController::show/$1', ['filter' => 'auth']);
$routes->post('api/noticias', '\App\Controllers\News\NewsController::create', ['filter' => 'role:2,3']);
$routes->put('api/noticias/(:num)', '\App\Controllers\News\NewsController::update/$1', ['filter' => 'role:2,3']);
$routes->delete('api/noticias/(:num)', '\App\Controllers\News\NewsController::delete/$1', ['filter' => 'role:2,3']);

// Administradorr
$routes->get('api/usuarios', '\App\Controllers\Admin\AdminController::users', ['filter' => 'role:3']);
$routes->put('api/admin/usuarios/(:num)/rol', '\App\Controllers\Admin\AdminController::updateRole/$1', ['filter' => 'role:3']);
$routes->put('api/admin/usuarios/(:num)/ban', '\App\Controllers\Admin\AdminController::toggleBan/$1', ['filter' => 'role:3']);
$routes->put('api/admin/usuarios/(:num)/badge', '\App\Controllers\Admin\AdminController::updateBadge/$1', ['filter' => 'role:3']);
$routes->put('api/admin/usuarios/(:num)/readonly', '\App\Controllers\Admin\AdminController::toggleReadonly/$1', ['filter' => 'role:3']);

// Reportes
$routes->get('api/reportes', '\App\Controllers\Report\ReportController::index', ['filter' => 'auth']);
$routes->get('api/reportes/(:num)', '\App\Controllers\Report\ReportController::show/$1', ['filter' => 'auth']);
$routes->post('api/reportes', '\App\Controllers\Report\ReportController::create', ['filter' => 'auth']);
$routes->delete('api/reportes/(:num)', '\App\Controllers\Report\ReportController::delete/$1', ['filter' => 'auth']);

// Comentarios
$routes->get('api/reportes/(:num)/comentarios', '\App\Controllers\ReportComment\ReportCommentController::index/$1', ['filter' => 'auth']);
$routes->post('api/reportes/(:num)/comentarios', '\App\Controllers\ReportComment\ReportCommentController::create/$1', ['filter' => 'auth']);
$routes->delete('api/comentarios/(:num)', '\App\Controllers\ReportComment\ReportCommentController::delete/$1', ['filter' => 'auth']);

// Terminal commands (público)
$routes->get('api/terminal-commands', '\App\Controllers\TerminalCommandController::index');

// Gestión (solo admin)
$routes->post('api/terminal-commands', '\App\Controllers\TerminalCommandController::create', ['filter' => 'role:3']);
$routes->put('api/terminal-commands/(:num)', '\App\Controllers\TerminalCommandController::update/$1', ['filter' => 'role:3']);
$routes->delete('api/terminal-commands/(:num)', '\App\Controllers\TerminalCommandController::delete/$1', ['filter' => 'role:3']);

// PRUEBA PARA VER SI ANDA EL MIDDLEWARE, 401 SIN TOKEN, CON TOKEN LOGEA (RUTA PROTECTED)

// $routes->get('api/test-auth', function() {
//    return service('response')->setJSON(['message' => 'Token válido']);
//  }, ['filter' => 'auth']);