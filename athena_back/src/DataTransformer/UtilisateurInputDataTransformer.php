<?php

namespace App\DataTransformer;

use ApiPlatform\Core\DataTransformer\DataTransformerInterface;
use App\Entity\Utilisateur;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class UtilisateurInputDataTransformer implements DataTransformerInterface
{
    public function transform($data, string $to, array $context = [])
    {
        $utilisateur = new Utilisateur();

        if (isset($data['email'])) {
            $utilisateur->setEmail($data['email']);
        }
        if (isset($data['password'])) {
            $utilisateur->setPassword($data['password']);
        }
        if (isset($data['nom'])) {
            $utilisateur->setNom($data['nom']);
        }
        if (isset($data['prenoms'])) {
            $utilisateur->setPrenoms($data['prenoms']);
        }
        if (isset($data['telephone'])) {
            $utilisateur->setTelephone($data['telephone']);
        }
        if (isset($data['adresse'])) {
            $utilisateur->setAdresse($data['adresse']);
        }
        if (isset($data['actif'])) {
            $utilisateur->setActif($data['actif']);
        }
        if (isset($data['imageFile']) && $data['imageFile'] instanceof UploadedFile) {
            $utilisateur->setImageFile($data['imageFile']);
        }

        return $utilisateur;
    }

    public function supportsTransformation($data, string $to, array $context = []): bool
    {
        if ($data instanceof Utilisateur) {
            return false;
        }

        return Utilisateur::class === $to && null !== ($context['input']['class'] ?? null);
    }
}
