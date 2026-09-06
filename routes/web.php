<?php

use App\Http\Controllers\Admin\ChapterController;
use App\Http\Controllers\Admin\FlashcardController;
use App\Http\Controllers\Admin\FolioController;
use App\Http\Controllers\Admin\FolioSlideController;
use App\Http\Controllers\Admin\ImageUploadController;
use App\Http\Controllers\Admin\ModuleController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\TopicController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public pages
|--------------------------------------------------------------------------
*/

Route::inertia('/', 'Home')->name('home');
Route::inertia('/Home', 'Home');
Route::inertia('/Syllabus', 'Syllabus')->name('syllabus');
Route::inertia('/About', 'About')->name('about');
Route::inertia('/Terms', 'Terms&Conditions')->name('terms');

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
| Credential-accepting endpoints use the "auth" limiter (AppServiceProvider):
| 6/min per email+IP and 60/min per IP, so shared campus NAT is not punished.
*/

Route::get('/signup', [AuthController::class, 'showSignup'])->name('signup');
Route::post('/signup', [AuthController::class, 'signup'])->middleware('throttle:auth');

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth');

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
    ->middleware('auth')
    ->name('dashboard');

// Password reset
Route::get('/forgot-password', [PasswordResetController::class, 'requestForm'])->name('password.request');
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])
    ->middleware('throttle:auth')
    ->name('password.email');
Route::get('/reset-password/{token}', [PasswordResetController::class, 'resetForm'])->name('password.reset');
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])
    ->middleware('throttle:auth')
    ->name('password.update');

// Email verification (links are temporary signed URLs, see VerifyEmailNotification)
Route::get('/email/verify', [EmailVerificationController::class, 'notice'])->name('verification.notice');
Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware(['signed', 'throttle:60,1'])
    ->name('verification.verify');
Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
    ->middleware('throttle:auth')
    ->name('verification.resend');

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->middleware(['auth', 'admin'])
    ->name('admin.')
    ->group(function () {
        Route::get('/', fn () => Inertia::render('Admin/Dashboard'))->name('dashboard');

        Route::resource('subjects', SubjectController::class)->except('show');
        Route::resource('topics', TopicController::class)->except('show');
        Route::resource('chapters', ChapterController::class)->except('show');
        Route::resource('modules', ModuleController::class)->except('show');
        Route::resource('folios', FolioController::class)->except('show');
        Route::resource('questions', QuestionController::class)->except('show');
        Route::resource('flashcards', FlashcardController::class)->except('show');
        Route::resource('folio-slides', FolioSlideController::class)->except(['index', 'show']);

        Route::post('/upload-image', ImageUploadController::class)->name('upload-image');
    });
