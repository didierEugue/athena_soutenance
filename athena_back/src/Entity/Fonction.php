<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\FonctionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FonctionRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['fonction_read']],
)]
class Fonction
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["fonction_read", "accesdefaut_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(["fonction_read", "accesdefaut_read"])]
    private ?string $code = null;

    #[ORM\Column(length: 100)]
    #[Groups(["fonction_read", "accesdefaut_read"])]
    private ?string $nom = null;

    /**
     * @var Collection<int, AccesParDefaut>
     */
    #[ORM\OneToMany(targetEntity: AccesParDefaut::class, mappedBy: 'fonction', orphanRemoval: true)]
    private Collection $accesParDefauts;

    /**
     * @var Collection<int, AccesPersonnalise>
     */
    #[ORM\OneToMany(targetEntity: AccesPersonnalise::class, mappedBy: 'fonction', orphanRemoval: true)]
    private Collection $accesPersonnalises;

    public function __construct()
    {
        $this->accesParDefauts = new ArrayCollection();
        $this->accesPersonnalises = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;

        return $this;
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

    /**
     * @return Collection<int, AccesParDefaut>
     */
    public function getAccesParDefauts(): Collection
    {
        return $this->accesParDefauts;
    }

    // public function addAccesParDefaut(AccesParDefaut $accesParDefaut): static
    // {
    //     if (!$this->accesParDefauts->contains($accesParDefaut)) {
    //         $this->accesParDefauts->add($accesParDefaut);
    //         $accesParDefaut->setFonction($this);
    //     }

    //     return $this;
    // }

    // public function removeAccesParDefaut(AccesParDefaut $accesParDefaut): static
    // {
    //     if ($this->accesParDefauts->removeElement($accesParDefaut)) {
    //         // set the owning side to null (unless already changed)
    //         if ($accesParDefaut->getFonction() === $this) {
    //             $accesParDefaut->setFonction(null);
    //         }
    //     }

    //     return $this;
    // }

    /**
     * @return Collection<int, AccesPersonnalise>
     */
    public function getAccesPersonnalises(): Collection
    {
        return $this->accesPersonnalises;
    }

    public function addAccesPersonnalise(AccesPersonnalise $accesPersonnalise): static
    {
        if (!$this->accesPersonnalises->contains($accesPersonnalise)) {
            $this->accesPersonnalises->add($accesPersonnalise);
            $accesPersonnalise->setFonction($this);
        }

        return $this;
    }

    public function removeAccesPersonnalise(AccesPersonnalise $accesPersonnalise): static
    {
        if ($this->accesPersonnalises->removeElement($accesPersonnalise)) {
            // set the owning side to null (unless already changed)
            if ($accesPersonnalise->getFonction() === $this) {
                $accesPersonnalise->setFonction(null);
            }
        }

        return $this;
    }
}
