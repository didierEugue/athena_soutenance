<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TacheParActiviteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TacheParActiviteRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['rja_read']],
    order: ['id' => 'DESC']
)]
class TacheParActivite
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["rja_read", "user_read", "affaire_read"])]
    private ?int $id = null;

    // #[ORM\ManyToOne(inversedBy: 'tacheParActivites')]
    // #[ORM\JoinColumn(nullable: false)]
    // private ?Utilisateur $executeur = null;

    #[ORM\ManyToOne(inversedBy: 'tacheParActivites')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["rja_read", "user_read", "affaire_read"])]
    private ?TacheFacturable $tache_facturable = null;

    #[ORM\ManyToOne(inversedBy: 'tacheParActivites')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["rja_read", "user_read"])]
    private ?OrdreFabrication $ordre_fabrication = null;

    #[ORM\Column(type: 'string')]
    // #[ORM\Column(type: 'string', columnDefinition: "ENUM('En Atelier', 'Sur Site Client') NOT NULL")]
    #[Groups(["rja_read", "user_read"])]
    private ?string $type_activite = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    #[Groups(["rja_read", "user_read", "affaire_read"])]
    private ?string $duree = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(["rja_read", "user_read", "affaire_read"])]
    private ?\DateTimeInterface $date = null;

    // #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    // private ?\DateTimeInterface $date_fin = null;

    #[ORM\Column(type: 'string', columnDefinition: "ENUM('Standby', 'Réfusé', 'Validé') NOT NULL DEFAULT 'Standby'")]
    #[Groups(["rja_read", "user_read", "affaire_read"])]
    private ?string $statut = null;

    #[ORM\ManyToOne(inversedBy: 'tacheParActivites')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["rja_read", "affaire_read"])]
    private ?Utilisateur $executeur = null;

    #[ORM\ManyToOne(inversedBy: 'tacheParActivites')]
    #[Groups(["rja_read"])]
    private ?Utilisateur $validateur = null;

    /**
     * @var Collection<int, Fichier>
     */
    #[ORM\OneToMany(targetEntity: Fichier::class, mappedBy: 'rja')]
    private Collection $fichiers;

    public function __construct()
    {
        $this->fichiers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    // public function getExecuteur(): ?Utilisateur
    // {
    //     return $this->executeur;
    // }

    // public function setExecuteur(?Utilisateur $executeur): static
    // {
    //     $this->executeur = $executeur;

    //     return $this;
    // }

    public function getTacheFacturable(): ?TacheFacturable
    {
        return $this->tache_facturable;
    }

    public function setTacheFacturable(?TacheFacturable $tache_facturable): static
    {
        $this->tache_facturable = $tache_facturable;

        return $this;
    }

    public function getOrdreFabrication(): ?OrdreFabrication
    {
        return $this->ordre_fabrication;
    }

    public function setOrdreFabrication(?OrdreFabrication $ordre_fabrication): static
    {
        $this->ordre_fabrication = $ordre_fabrication;

        return $this;
    }

    public function getTypeActivite(): ?string
    {
        return $this->type_activite;
    }

    public function setTypeActivite(string $type_activite): static
    {
        $this->type_activite = $type_activite;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDuree(): ?string
    {
        return $this->duree;
    }

    public function setDuree(?string $duree): static
    {
        $this->duree = $duree;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    // public function getDateFin(): ?\DateTimeInterface
    // {
    //     return $this->date_fin;
    // }

    // public function setDateFin(?\DateTimeInterface $date_fin): static
    // {
    //     $this->date_fin = $date_fin;

    //     return $this;
    // }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(?string $statut): static
    {
        $this->statut = $statut;

        return $this;
    }

    public function getExecuteur(): ?Utilisateur
    {
        return $this->executeur;
    }

    public function setExecuteur(?Utilisateur $executeur): static
    {
        $this->executeur = $executeur;

        return $this;
    }

    public function getValidateur(): ?Utilisateur
    {
        return $this->validateur;
    }

    public function setValidateur(?Utilisateur $validateur): static
    {
        $this->validateur = $validateur;

        return $this;
    }

    /**
     * @return Collection<int, Fichier>
     */
    public function getFichiers(): Collection
    {
        return $this->fichiers;
    }

    public function addFichier(Fichier $fichier): static
    {
        if (!$this->fichiers->contains($fichier)) {
            $this->fichiers->add($fichier);
            $fichier->setRja($this);
        }

        return $this;
    }

    public function removeFichier(Fichier $fichier): static
    {
        if ($this->fichiers->removeElement($fichier)) {
            // set the owning side to null (unless already changed)
            if ($fichier->getRja() === $this) {
                $fichier->setRja(null);
            }
        }

        return $this;
    }
}
