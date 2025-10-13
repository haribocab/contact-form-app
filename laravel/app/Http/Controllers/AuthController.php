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

    // public function login(Request $request)
    // {
    //     $credentials = $request->only('username', 'password');

    //     if (!$token = JWTAuth::attempt($credentials)) {
    //         return response()->json(['error' => 'Invalid credentials'], 401);
    //     }

    //     return response()->json([
    //         'message' => 'Successful login!',
    //         'user' => auth()->user()->username,
    //         'token' => $token,
    //     ]);
    // }

    public function login(Request $request)
    {
        // 確認用にJWT発行を飛ばして、ただメッセージを返す
        return response()->json(['message' => 'Login success.']);
    }


}
