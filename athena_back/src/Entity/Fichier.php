<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'fichiers')]
class Fichier
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $chemin = null;

    #[ORM\Column(length: 100)]
    private ?string $mimeType = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'fichiers')]
    private ?Utilisateur $utilisateur = null;

    #[ORM\ManyToOne(inversedBy: 'fichiers')]
    private ?OrdreFabrication $ofab = null;

    #[ORM\ManyToOne(inversedBy: 'fichiers')]
    private ?TacheParActivite $rja = null;

    #[ORM\ManyToOne(inversedBy: 'fichiers')]
    private ?MessageGroupe $mg = null;

    #[ORM\ManyToOne(inversedBy: 'fichiers')]
    private ?Message $message_prive = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getChemin(): ?string
    {
        return $this->chemin;
    }

    public function setChemin(string $chemin): static
    {
        $this->chemin = $chemin;
        return $this;
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(string $mimeType): static
    {
        $this->mimeType = $mimeType;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->createdAt = new \DateTimeImmutable();
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

    public function getOfab(): ?OrdreFabrication
    {
        return $this->ofab;
    }

    public function setOfab(?OrdreFabrication $ofab): static
    {
        $this->ofab = $ofab;

        return $this;
    }

    public function getRja(): ?TacheParActivite
    {
        return $this->rja;
    }

    public function setRja(?TacheParActivite $rja): static
    {
        $this->rja = $rja;

        return $this;
    }

    public function getMg(): ?MessageGroupe
    {
        return $this->mg;
    }

    public function setMg(?MessageGroupe $mg): static
    {
        $this->mg = $mg;

        return $this;
    }

    public function getMessagePrive(): ?Message
    {
        return $this->message_prive;
    }

    public function setMessagePrive(?Message $message_prive): static
    {
        $this->message_prive = $message_prive;

        return $this;
    }
}
