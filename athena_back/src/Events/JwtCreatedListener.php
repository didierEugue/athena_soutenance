<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class JwtCreatedListener
{
    public function onJwtCreated(JWTCreatedEvent $event)
    {
        $user = $event->getUser();
        $payload = $event->getData();

        if ($user instanceof UserInterface) {
            $payload['id'] = $user->getId();
            $payload['nom'] = $user->getNom();
            $payload['prenom'] = $user->getPrenoms();
            $payload['telephone'] = $user->getTelephone();
            $payload['adresse'] = $user->getAdresse();
            $payload['actif'] = $user->isActif();
        }

        $event->setData($payload);
    }
}
