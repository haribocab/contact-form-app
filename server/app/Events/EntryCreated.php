<?php
namespace App\Events;

use App\Models\Entry;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class EntryCreated implements ShouldBroadcastNow
{
    public $entry;

    public function __construct(Entry $entry)
    {
        $this->entry = $entry;
    }

    public function broadcastOn()
    {
        return new Channel('entries');
    }
}
