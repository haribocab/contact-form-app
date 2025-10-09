<?php
namespace App\Http\Controllers;

use App\Models\Entry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\EntryCreated;

class EntryController extends Controller
{
    public function index()
    {
        return Entry::with('user:id,username')->orderByDesc('created_at')->get();
    }

    public function store(Request $request)
    {
        $user = auth('api')->user();
        $entry = Entry::create([
            'content' => $request->input('content'),
            'user_id' => $user->id,
        ])->load('user:id,username');

        broadcast(new EntryCreated($entry))->toOthers();

        return response()->json($entry, 201);
    }

    public function destroy($id)
    {
        $entry = Entry::findOrFail($id);
        $entry->delete();

        return response()->json(['message' => 'Entry deleted', 'entry' => $entry]);
    }
}
