<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function showSignup()
    {
        return Inertia::render('Signup');
    }

    public function signup(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, 
        ]);

        Auth::login($user);

        // queue verification email
        $user->sendEmailVerificationNotification();
        // Logout immediately (in case it auto-logs in)
            Auth::logout();
        // send to verification notice
        return redirect()->route('verification.notice');

        return redirect()->route('dashboard');
    }

    public function showLogin()
    {
        return Inertia::render('Login');
    }

    public function login(Request $request)
    {
       $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $remember = $request->has('remember');
        
        $user = \App\Models\User::where('email', $request->email)->first();

        // dd([
        //     'input_password' => $request->password,
        //     'db_password' => $user->password,
        //     'check' => Hash::check($request->password, $user->password),
        // ]);


        if (!$user) {
            // Email not found
            return back()->withErrors(['email' => 'This email does not exist.']);
        }
    
        if (!Hash::check($request->password, $user->password)) {
            // Password wrong
            return back()->withErrors(['password' => 'Wrong password.']);
        }

        if (!$user->hasVerifiedEmail()) {
            return redirect()->route('verification.notice')
                ->with('status', 'Please verify your email before logging in.');
        }


        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->intended('dashboard');
    }

    public function logout(Request $request)
    {
       
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
