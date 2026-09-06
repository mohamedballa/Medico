<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->is_admin) {
            return Inertia::render('Error', [
                'status' => Response::HTTP_FORBIDDEN,
                'message' => 'Access denied. Admins only.',
            ])->toResponse($request)->setStatusCode(Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
