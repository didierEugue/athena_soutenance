<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ChiffrageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ChiffrageRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['chiffrage_read']],
)]
class Chiffrage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["chiffrage_read"])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(["chiffrage_read"])]
    private ?float $cout = null;

    #[ORM\ManyToOne(inversedBy: 'chiffrages')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["chiffrage_read"])]
    private ?TypeChiffrage $type = null;

    #[ORM\ManyToOne(inversedBy: 'chiffrages')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["chiffrage_read"])]
    private ?Affaire $affaire = null;

    #[ORM\ManyToOne(inversedBy: 'chiffrages')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["chiffrage_read"])]
    private ?Fournisseur $fournisseur = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCout(): ?float
    {
        return $this->cout;
    }

    public function setCout(float $cout): static
    {
        $this->cout = $cout;

        return $this;
    }

    public function getType(): ?TypeChiffrage
    {
        return $this->type;
    }

    public function setType(?TypeChiffrage $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getAffaire(): ?Affaire
    {
        return $this->affaire;
    }

    public function setAffaire(?Affaire $affaire): static
    {
        $this->affaire = $affaire;

        return $this;
    }

    public function getFournisseur(): ?Fournisseur
    {
        return $this->fournisseur;
    }

    public function setFournisseur(?Fournisseur $fournisseur): static
    {
        $this->fournisseur = $fournisseur;

        return $this;
    }
}
