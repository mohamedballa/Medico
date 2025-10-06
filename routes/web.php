<?php


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use App\Models\User;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Auth;

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
})->middleware(['auth'])->name('dashboard');


        // Reset Password
Route::get('/forgot-password', [PasswordResetController::class, 'requestForm'])->name('password.request');
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])->name('password.email');
Route::get('/reset-password/{token}', [PasswordResetController::class, 'resetForm'])->name('password.reset');
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])->name('password.update');
        
 






// Notice page - user sees this after signup
Route::get('/email/verify', function (Request $request) {
    $email = $request->query('email');
    return Inertia::render('Auth/VerifyNotice' , [
        'email' => $request->query('email'),
    ]);       
})->name('verification.notice');

// Signed verification link (from email)
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = User::find($id);

    if (!$user) {
        abort(404);
    }

    if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        abort(403, 'Invalid verification link.');
    }

    if ($user->hasVerifiedEmail()) {
        return redirect()->route('login')->with('status', 'Email already verified. Please login.');
    }

    $user->markEmailAsVerified();
    event(new Verified($user));
    Auth::logout();

    return redirect()->route('login')->with('status', 'Email verified successfully! You can now login.');
})->name('verification.verify');

// Resend verification email without login
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