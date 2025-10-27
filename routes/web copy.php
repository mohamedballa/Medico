<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\ChapterController;
use App\Http\Controllers\Admin\ModuleController;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

/* --------------------------------------------------------------
   PUBLIC FRONT-END PAGES
-------------------------------------------------------------- */
Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/Home', function () {
    return Inertia::render('Home');
});

Route::get('/Syllabus', function () {
    return Inertia::render('Syllabus');
});

Route::inertia('/About', 'About');
Route::inertia('/Syllabus2', 'Syllabus2');
Route::inertia('/Login', 'Login');
Route::inertia('/Signup', 'Signup');
Route::inertia('/Admin', 'Admin');
Route::inertia('/Dashboard', 'Dashboard');
Route::inertia('/Terms', 'Terms&Conditions');

/* --------------------------------------------------------------
   AUTHENTICATION
-------------------------------------------------------------- */
Route::get('/signup', [AuthController::class, 'showSignup'])->name('signup');
Route::post('/signup', [AuthController::class, 'signup']);

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

/* --------------------------------------------------------------
   USER DASHBOARD
-------------------------------------------------------------- */
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

/* --------------------------------------------------------------
   PASSWORD RESET
-------------------------------------------------------------- */
Route::get('/forgot-password', [PasswordResetController::class, 'requestForm'])
    ->name('password.request');
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])
    ->name('password.email');

Route::get('/reset-password/{token}', [PasswordResetController::class, 'resetForm'])
    ->name('password.reset');
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])
    ->name('password.update');

/* --------------------------------------------------------------
   EMAIL VERIFICATION
-------------------------------------------------------------- */
Route::get('/email/verify', function (Request $request) {
    return Inertia::render('Auth/VerifyNotice', [
        'email' => $request->query('email')
    ]);
})->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = User::findOrFail($id);

    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        abort(403, 'Invalid verification link.');
    }

    if ($user->hasVerifiedEmail()) {
        return redirect()->route('login')
            ->with('status', 'Email already verified. Please login.');
    }

    $user->markEmailAsVerified();
    event(new Verified($user));
    Auth::logout();

    return redirect()->route('login')
        ->with('status', 'Email verified successfully! You can now login.');
})->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return back()->with('status', 'No account found with that email address.');
    }

    if ($user->hasVerifiedEmail()) {
        return back()->with('status', 'Your email is already verified.');
    }

    $user->sendEmailVerificationNotification();

    return back()->with('status', 'Verification link sent to your email!');
})->name('verification.resend');

/* --------------------------------------------------------------
   ADMIN PANEL
-------------------------------------------------------------- */
Route::prefix('admin')
    ->middleware(['auth', 'admin'])
    ->group(function () {

        // Admin Dashboard
        Route::get('/', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin.dashboard');

        // Resource Routes
        Route::resource('subjects', SubjectController::class)->except(['show']);
        Route::resource('chapters', ChapterController::class)->except(['show']);
        Route::resource('modules', ModuleController::class)->except(['show']);
    });