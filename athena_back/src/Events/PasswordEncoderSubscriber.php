<?php 

namespace App\Events;
use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Utilisateur;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface{
    /**
     * Summary of hasher
     * @var UserPasswordHasherInterface
     */
    private $hasher;
    public function __construct(UserPasswordHasherInterface $hasher) {
        $this->hasher = $hasher;
    }
    public static function getSubscribedEvents(){
        return [
            KernelEvents::VIEW => [
                'encodePassword', EventPriorities::PRE_WRITE
            ]
        ];
    }

    public function encodePassword(ViewEvent $event){
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($user instanceof Utilisateur && $method === "POST") {
            $hash = $this->hasher->hashPassword($user, $user->getPassword());
            $user->setPassword($hash);
            //dd($user);
        }
    }
}