@component('mail::message')
# Hello {{ $user->name ?? 'User' }},

You are receiving this email because we received a **password reset request** for your account at **Medicosolomed**.

@component('mail::button', ['url' => $url, 'color' => 'primary'])
Reset Password
@endcomponent

This link will expire in **60 minutes**.  
If you did not request a password reset, no further action is required.

Thanks,<br>
The **Medicosolomed** Team
@endcomponent
