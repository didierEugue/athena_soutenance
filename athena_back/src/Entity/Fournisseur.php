<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\FournisseurRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FournisseurRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['fournisseur_read']],
)]
class Fournisseur
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["fournisseur_read", "chiffrage_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["fournisseur_read", "chiffrage_read"])]
    private ?string $nom = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(["fournisseur_read"])]
    private ?string $telephone = null;

    #[ORM\Column(length: 100)]
    #[Groups(["fournisseur_read"])]
    private ?string $email = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(["fournisseur_read"])]
    private ?string $adresse = null;

    /**
     * @var Collection<int, Chiffrage>
     */
    #[ORM\OneToMany(targetEntity: Chiffrage::class, mappedBy: 'fournisseur')]
    private Collection $chiffrages;

    public function __construct()
    {
        $this->chiffrages = new ArrayCollection();
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

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(?string $telephone): static
    {
        $this->telephone = $telephone;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(?string $adresse): static
    {
        $this->adresse = $adresse;

        return $this;
    }

    /**
     * @return Collection<int, Chiffrage>
     */
    public function getChiffrages(): Collection
    {
        return $this->chiffrages;
    }

    public function addChiffrage(Chiffrage $chiffrage): static
    {
        if (!$this->chiffrages->contains($chiffrage)) {
            $this->chiffrages->add($chiffrage);
            $chiffrage->setFournisseur($this);
        }

        return $this;
    }

    public function removeChiffrage(Chiffrage $chiffrage): static
    {
        if ($this->chiffrages->removeElement($chiffrage)) {
            // set the owning side to null (unless already changed)
            if ($chiffrage->getFournisseur() === $this) {
                $chiffrage->setFournisseur(null);
            }
        }

        return $this;
    }
}
