<?php


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render("Home");
});
Route::get('/Home', function () {
    return Inertia::render("Home");
});
Route::get('/Syllabus', function () {
    return Inertia::render("Syllabus");
});

// Route::inertia('/Syllabus','Syllabus');
Route::inertia('/About','About');
Route::inertia('/Syllabus2','Syllabus2');
Route::inertia('/Login','Login');
Route::inertia('/Signup','Signup');
Route::inertia('/Admin','Admin');
Route::inertia('/Dashboard','Dashboard');
