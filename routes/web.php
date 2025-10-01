<?php


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;

//  Routes FronEnd

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
Route::inertia('/Terms','Terms&Conditions');



//  Auth Controller

Route::get('/signup', [AuthController::class, 'showSignup'])->name('signup');
Route::post('/signup', [AuthController::class, 'signup']);

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/dashboard', function () {
    return inertia('Dashboard');
})->middleware('auth')->name('dashboard');


        // Reset Password
Route::get('/forgot-password', [PasswordResetController::class, 'requestForm'])->name('password.request');
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])->name('password.email');
Route::get('/reset-password/{token}', [PasswordResetController::class, 'resetForm'])->name('password.reset');
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])->name('password.update');
        
        