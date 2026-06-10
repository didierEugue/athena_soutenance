<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TypeChiffrageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TypeChiffrageRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['typeChiffrage_read']],
)]
class TypeChiffrage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["typeChiffrage_read","chiffrage_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["typeChiffrage_read","chiffrage_read"])]
    private ?string $nom = null;

    /**
     * @var Collection<int, Chiffrage>
     */
    #[ORM\OneToMany(targetEntity: Chiffrage::class, mappedBy: 'type', orphanRemoval: true)]
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
            $chiffrage->setType($this);
        }

        return $this;
    }

    public function removeChiffrage(Chiffrage $chiffrage): static
    {
        if ($this->chiffrages->removeElement($chiffrage)) {
            // set the owning side to null (unless already changed)
            if ($chiffrage->getType() === $this) {
                $chiffrage->setType(null);
            }
        }

        return $this;
    }
}
