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

// Profile
$routes->get('api/perfil/(:segment)', '\App\Controllers\Profile\ProfileController::show/$1', ['filter' => 'auth']);
$routes->put('api/perfil', '\App\Controllers\Profile\ProfileController::editProfile', ['filter' => 'auth']);

// News (falta finder)
$routes->get('api/noticias', '\App\Controllers\News\NewsController::index', ['filter' => 'auth']);
$routes->get('api/noticias/(:num)', '\App\Controllers\News\NewsController::show/$1', ['filter' => 'auth']);
$routes->post('api/noticias', '\App\Controllers\News\NewsController::create', ['filter' => 'role:2,3']);
$routes->put('api/noticias/(:num)', '\App\Controllers\News\NewsController::update/$1', ['filter' => 'role:2,3']);
$routes->delete('api/noticias/(:num)', '\App\Controllers\News\NewsController::delete/$1', ['filter' => 'role:3']);

// Admin
$routes->get('api/usuarios', '\App\Controllers\Admin\AdminController::users', ['filter' => 'role:3']);
$routes->put('api/admin/usuarios/(:num)/rol', '\App\Controllers\Admin\AdminController::updateRole/$1', ['filter' => 'role:3']);
$routes->put('api/admin/usuarios/(:num)/ban', '\App\Controllers\Admin\AdminController::toggleBan/$1', ['filter' => 'role:3']);

// PRUEBA PARA VER SI ANDA EL MIDDLEWARE, 401 SIN TOKEN, CON TOKEN LOGEA (RUTA PROTECTED)
// $routes->get('api/test-auth', function() {
//    return service('response')->setJSON(['message' => 'Token válido']);
//  }, ['filter' => 'auth']);