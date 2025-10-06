<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Config;

class VerifyEmailNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }


    protected function verificationUrl($notifiable)
    {
        $expiration = Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60));
        return URL::temporarySignedRoute(
            'verification.verify',
            $expiration,
            ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())]
        );
    }




    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = $this->verificationUrl($notifiable);
        
        return (new MailMessage)
        ->subject('Verify your email address | Medicosolomed')
        ->greeting("Hello {$notifiable->name}!")
        ->line('Please verify your email address to activate your account on Medicosolomed.')
        ->action('Verify Email', $url)
        ->line('This link will expire in '.Config::get('auth.verification.expire', 60).' minutes.')
        ->line('If you did not create an account, no action is required.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
