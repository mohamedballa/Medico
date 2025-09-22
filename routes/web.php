<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::inertia('/Syllabus');
Route::inertia('/About');
Route::inertia('/Syllabus2');
Route::inertia('/Login');
Route::inertia('/Signup');
Route::inertia('/Admin');
Route::inertia('/Dashboard');
