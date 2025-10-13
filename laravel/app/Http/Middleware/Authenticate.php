<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * 未認証時にリダイレクト先を返す
     */
    protected function redirectTo($request)
    {
        // APIリクエストの場合はJSONで401
        if ($request->expectsJson()) {
            abort(401, 'Unauthorized');
        }

        // Webリクエストの場合はログインページにリダイレクト
        return route('login');
    }
}