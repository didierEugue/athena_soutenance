<?php

namespace App\Controller;

use App\Entity\Fichier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class FichierController extends AbstractController
{
    #[Route('/api/upload', name: 'api_upload_fichier', methods: ['POST'])]
    public function upload(
        Request $request, 
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger
    ): JsonResponse
    {
        $uploadedFile = $request->files->get('file');

        dd($uploadedFile);

        if (!$uploadedFile) {
            return new JsonResponse(['error' => 'Aucun fichier n\'a été envoyé'], 400);
        }

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename.'-'.uniqid().'.'.$uploadedFile->guessExtension();

        // Création du répertoire s'il n'existe pas
        $uploadPath = $this->getParameter('uploads_directory');
        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        try {
            // Création de l'entité avant le déplacement du fichier
            $fichier = new Fichier();
            $fichier->setNom($originalFilename);
            $fichier->setChemin($newFilename);
            $fichier->setMimeType($uploadedFile->getMimeType());

            // Déplacement du fichier
            $uploadedFile->move(
                $uploadPath,
                $newFilename
            );

            // Vérification du fichier déplacé
            if (!file_exists($uploadPath.'/'.$newFilename)) {
                throw new FileException('Échec du déplacement du fichier.');
            }

            dd($fichier);

            // Persistance en base de données
            $entityManager->persist($fichier);
            $entityManager->flush();

            return new JsonResponse([
                'success' => true,
                'fichier' => [
                    'id' => $fichier->getId(),
                    'nom' => $fichier->getNom(),
                    'chemin' => $fichier->getChemin(),
                    'mimeType' => $fichier->getMimeType(),
                    'createdAt' => $fichier->getCreatedAt()->format('Y-m-d H:i:s')
                ]
            ], 201);

        } catch (FileException $e) {
            return new JsonResponse([
                'error' => 'Erreur lors du déplacement du fichier',
                'details' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            // Si le fichier a été déplacé mais qu'il y a une erreur de BDD, on le supprime
            if (file_exists($uploadPath.'/'.$newFilename)) {
                unlink($uploadPath.'/'.$newFilename);
            }
            
            return new JsonResponse([
                'error' => 'Une erreur est survenue',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}