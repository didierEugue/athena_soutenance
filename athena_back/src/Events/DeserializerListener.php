<?php 

namespace App\Events;

use ApiPlatform\Symfony\EventListener\DeserializeListener as DecoratedListener;

class DeserializerListener{
    public function __construct(private DecoratedListener $decorated)
    {
    }
}