<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationController extends Controller
{
    private const GENERIC_RESEND_MESSAGE = 'If an unverified account exists for that email, a new verification link has been sent.';

    public function notice(Request $request): Response
    {
        return Inertia::render('Auth/VerifyNotice', [
            'email' => $request->query('email'),
        ]);
    }

    /**
     * The route is protected by the "signed" middleware, so by the time we get
     * here the URL signature and expiry have already been validated.
     */
    public function verify(Request $request, int $id, string $hash): RedirectResponse
    {
        $user = User::findOrFail($id);

        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            abort(403, 'Invalid verification link.');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login')->with('status', 'Email already verified. Please login.');
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        return redirect()->route('login')->with('status', 'Email verified successfully! You can now login.');
    }

    /**
     * Always respond with the same message so the endpoint cannot be used to
     * discover which emails are registered.
     */
    public function resend(Request $request): RedirectResponse
    {
        $validated = $request->validate(['email' => 'required|email']);

        $user = User::where('email', $validated['email'])->first();

        if ($user && ! $user->hasVerifiedEmail()) {
            $user->sendEmailVerificationNotification();
        }

        return back()->with('status', self::GENERIC_RESEND_MESSAGE);
    }
}
