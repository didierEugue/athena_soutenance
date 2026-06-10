<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\OrdreFabricationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: OrdreFabricationRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['ordre_fabrication_read']],
)]
class OrdreFabrication
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["ordre_fabrication_read", "affaire_read", "rja_read", "user_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 15)]
    #[Groups(["ordre_fabrication_read", "affaire_read", "rja_read", "user_read"])]
    private ?string $numero = null;

    #[ORM\Column(length: 100)]
    #[Groups(["ordre_fabrication_read", "affaire_read", "rja_read", "user_read"])]
    private ?string $nom = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(["ordre_fabrication_read", "affaire_read"])]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(["ordre_fabrication_read", "affaire_read"])]
    private ?\DateTimeInterface $date_cloture = null;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Groups(["ordre_fabrication_read", "affaire_read"])]
    private ?int $indice = null;

    #[ORM\Column(type: 'string', columnDefinition: "ENUM('standby', 'en_cours', 'terminé', 'annulé') NOT NULL DEFAULT 'standby'")]
    #[Groups(["ordre_fabrication_read", "affaire_read", "rja_read", "user_read"])]
    private ?string $statut = null;

    #[ORM\ManyToOne(inversedBy: 'ordreFabrications')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["ordre_fabrication_read", "rja_read"])]
    private ?Affaire $affaire = null;

    /**
     * @var Collection<int, TacheParActivite>
     */
    #[ORM\OneToMany(targetEntity: TacheParActivite::class, mappedBy: 'ordre_fabrication', orphanRemoval: true)]
    #[Groups(["ordre_fabrication_read", "affaire_read"])]
    private Collection $tacheParActivites;

    /**
     * @var Collection<int, Fichier>
     */
    #[ORM\OneToMany(targetEntity: Fichier::class, mappedBy: 'ofab')]
    private Collection $fichiers;

    public function __construct()
    {
        $this->tacheParActivites = new ArrayCollection();
        $this->indice = 1;
        $this->fichiers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumero(): ?string
    {
        return $this->numero;
    }

    public function setNumero(string $numero): static
    {
        $this->numero = $numero;

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDateCloture(): ?\DateTimeInterface
    {
        return $this->date_cloture;
    }

    public function setDateCloture(?\DateTimeInterface $date_cloture): static
    {
        $this->date_cloture = $date_cloture;

        return $this;
    }

    public function getIndice(): ?int
    {
        return $this->indice;
    }

    public function setIndice(int $indice): static
    {
        $this->indice = $indice;

        return $this;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): static
    {
        $this->statut = $statut;

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
            $tacheParActivite->setOrdreFabrication($this);
        }

        return $this;
    }

    public function removeTacheParActivite(TacheParActivite $tacheParActivite): static
    {
        if ($this->tacheParActivites->removeElement($tacheParActivite)) {
            // set the owning side to null (unless already changed)
            if ($tacheParActivite->getOrdreFabrication() === $this) {
                $tacheParActivite->setOrdreFabrication(null);
            }
        }

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
            $fichier->setOfab($this);
        }

        return $this;
    }

    public function removeFichier(Fichier $fichier): static
    {
        if ($this->fichiers->removeElement($fichier)) {
            // set the owning side to null (unless already changed)
            if ($fichier->getOfab() === $this) {
                $fichier->setOfab(null);
            }
        }

        return $this;
    }
}
