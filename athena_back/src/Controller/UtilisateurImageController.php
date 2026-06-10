<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UtilisateurImageController
{
    public function __invoke(Request $request){
        $utilisateur = $request->attributes->get('data');
        if(!($utilisateur instanceof Utilisateur)){
            throw new \Exception('Utilisateur non trouvé');
        }
        $utilisateur->setFile($request->files->get('file'));
        $utilisateur->setUpdatedAt(new \DateTime());
        return $utilisateur;
    }
}
