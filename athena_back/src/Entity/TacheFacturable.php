<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TacheFacturableRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TacheFacturableRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['tache_facturable_read']],
)]
class TacheFacturable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["tache_facturable_read", "rja_read", "user_read", "affaire_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 8)]
    #[Groups(["tache_facturable_read", "rja_read", "user_read", "affaire_read"])]
    private ?string $code = null;

    #[ORM\Column(length: 100)]
    #[Groups(["tache_facturable_read", "rja_read", "user_read", "affaire_read"])]
    private ?string $nom = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Groups(["tache_facturable_read", "user_read", "affaire_read"])]
    private ?string $cout_horaire = null;

    #[ORM\Column]
    #[Groups(["tache_facturable_read", "user_read", "affaire_read"])]
    private ?bool $facturable = null;

    #[ORM\Column(type: 'string', columnDefinition: "ENUM('Production', 'Installation', 'Autres') NOT NULL")]
    #[Groups(["tache_facturable_read", "user_read"])]
    private ?string $categorie = null;

    /**
     * @var Collection<int, TacheParActivite>
     */
    #[ORM\OneToMany(targetEntity: TacheParActivite::class, mappedBy: 'tache_facturable', orphanRemoval: true)]
    private Collection $tacheParActivites;

    public function __construct()
    {
        $this->tacheParActivites = new ArrayCollection();
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

    public function getCoutHoraire(): ?string
    {
        return $this->cout_horaire;
    }

    public function setCoutHoraire(string $cout_horaire): static
    {
        $this->cout_horaire = $cout_horaire;

        return $this;
    }

    public function isFacturable(): ?bool
    {
        return $this->facturable;
    }

    public function setFacturable(bool $facturable): static
    {
        $this->facturable = $facturable;

        return $this;
    }

    public function getCategorie(): ?string
    {
        return $this->categorie;
    }

    public function setCategorie(string $categorie): static
    {
        $this->categorie = $categorie;

        return $this;
    }

    /**
     * @return Collection<int, TacheParActivite>
     */
    public function getTacheParActivites(): Collection
    {
        return $this->tacheParActivites;
    }

    public function addTacheParActivite(TacheParActivite $tacheParActivite): static
    {
        if (!$this->tacheParActivites->contains($tacheParActivite)) {
            $this->tacheParActivites->add($tacheParActivite);
            $tacheParActivite->setTacheFacturable($this);
        }

        return $this;
    }

    public function removeTacheParActivite(TacheParActivite $tacheParActivite): static
    {
        if ($this->tacheParActivites->removeElement($tacheParActivite)) {
            // set the owning side to null (unless already changed)
            if ($tacheParActivite->getTacheFacturable() === $this) {
                $tacheParActivite->setTacheFacturable(null);
            }
        }

        return $this;
    }
}
