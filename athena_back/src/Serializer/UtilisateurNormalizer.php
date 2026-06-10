<?php 

namespace App\Serializer;

use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class UtilisateurNormalizer 
{
    public function __invoke($utilisateur, $format, $context)
    {
        $utilisateur->setFile($context['request']->files->get('file'));
        $utilisateur->setUpdatedAt(new \DateTime());
        return $utilisateur;
    }
}
