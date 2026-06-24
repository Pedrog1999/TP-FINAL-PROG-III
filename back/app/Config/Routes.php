<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->get('/', 'Home::index');

$routes->resource('terminal-commands', [
    'controller' => 'TerminalCommandController'
]);