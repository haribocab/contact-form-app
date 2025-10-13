<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EntryController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/test', [AuthController::class, 'test']);

Route::middleware('auth:api')->group(function () {
    Route::get('/entries', [EntryController::class, 'index']);
    Route::post('/entries', [EntryController::class, 'store']);
    Route::delete('/entries/{id}', [EntryController::class, 'destroy']);
});


Route::middleware(['auth:api'])->get('/me', function () {
    $user = auth('api')->user();
    return response()->json($user);
});