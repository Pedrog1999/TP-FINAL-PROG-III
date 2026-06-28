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



// PRUEBA PARA VER SI ANDA EL MIDDLEWARE, 401 SIN TOKEN, CON TOKEN LOGEA (RUTA PROTECTED)
// $routes->get('api/test-auth', function() {
//    return service('response')->setJSON(['message' => 'Token válido']);
//  }, ['filter' => 'auth']);