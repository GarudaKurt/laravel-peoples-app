<?php

use App\Http\Controllers\Api\PersonController;
use Illuminate\Support\Facades\Route;

Route::apiResource('people', PersonController::class)->only([
    'index', 'store', 'update', 'destroy'
]);