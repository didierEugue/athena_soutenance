<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ParticipantsGroupeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ParticipantsGroupeRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['participant_groupe_read']]
)]
class ParticipantsGroupe
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["participant_groupe_read"])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'participantsGroupes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["participant_groupe_read"])]
    private ?Participant $participant = null;

    #[ORM\ManyToOne(inversedBy: 'participantsGroupes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["participant_groupe_read"])]
    private ?Utilisateur $utilisateur = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getParticipant(): ?Participant
    {
        return $this->participant;
    }

    public function setParticipant(?Participant $participant): static
    {
        $this->participant = $participant;

        return $this;
    }

    public function getUtilisateur(): ?Utilisateur
    {
        return $this->utilisateur;
    }

    public function setUtilisateur(?Utilisateur $utilisateur): static
    {
        $this->utilisateur = $utilisateur;

        return $this;
    }
}
