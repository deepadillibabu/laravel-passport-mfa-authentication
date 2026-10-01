<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MfaController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');





Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::post('/mfa/setup', [MfaController::class, 'setup'])
    ->middleware('auth:api');

Route::post('/mfa/verify', [MfaController::class, 'verify'])
    ->middleware('auth:api');



Route::get('/users', [UserController::class, 'index'])
    ->middleware('auth:api');

Route::get('/users/export', [UserController::class, 'exportCsv'])
    ->middleware('auth:api');
