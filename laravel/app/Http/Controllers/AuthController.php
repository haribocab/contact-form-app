<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'User is created.']);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');

        $user = \App\Models\User::where('username', $credentials['username'])->first();

        if (!$user) {
            return response()->json(['debug' => 'User not found']);
        }

        $passwordCheck = \Illuminate\Support\Facades\Hash::check($credentials['password'], $user->password);

        if (!$passwordCheck) {
            return response()->json(['debug' => 'Password does not match']);
        }

        $token = \Tymon\JWTAuth\Facades\JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'JWT generated',
            'token' => $token,
        ]);
    }

    public function test(Request $request)
    {
        return response()->json([
            'message' => 'Test endpoint accessed successfully!',
            'method' => $request->method(),
            'headers' => $request->headers->all(),
            'body' => $request->all(),
        ]);
    }


}
