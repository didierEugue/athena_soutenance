<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\AffaireRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Order;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AffaireRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['affaire_read']],
)]
#[ApiFilter(OrderFilter::class)]
class Affaire
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["affaire_read", "chiffrage_read", "ordre_fabrication_read", "rja_read", "user_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    #[Groups(["affaire_read", "chiffrage_read", "ordre_fabrication_read", "rja_read", "user_read"])]
    private ?string $numero = null;

    #[ORM\Column(length: 200)]
    #[Groups(["affaire_read", "chiffrage_read", "ordre_fabrication_read", "rja_read", "user_read"])]
    private ?string $nom = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(["affaire_read"])]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true, updatable: false)]
    #[Groups(["affaire_read"])]
    private ?\DateTimeInterface $date_creation = null;


    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(["affaire_read"])]
    private ?\DateTimeInterface $date_cloture = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    #[Groups(["affaire_read"])]
    private ?string $cout_total = null;

    #[ORM\Column(type: 'string', columnDefinition: "ENUM('standby', 'en_cours', 'terminé', 'cloture', 'archive') NOT NULL DEFAULT 'standby'")]
    #[Groups(["affaire_read", "chiffrage_read", "ordre_fabrication_read", "user_read"])]
    private ?string $statut = null;

    // #[ORM\ManyToOne(inversedBy: 'affaires', targetEntity: Client::class, cascade: ['persist'], fetch: 'LAZY')]
    // private ?Client $client = null;

    /**
     * @var Collection<int, OrdreFabrication>
     */
    #[ORM\OneToMany(targetEntity: OrdreFabrication::class, mappedBy: 'affaire', orphanRemoval: true)]
    #[Groups(["affaire_read"])]
    private Collection $ordreFabrications;

    #[ORM\ManyToOne(inversedBy: 'affaires', targetEntity: Client::class, cascade: ['persist'], fetch: 'LAZY')]
    #[Groups(["affaire_read", "chiffrage_read"])]
    private ?Client $client = null;

    /**
     * @var Collection<int, Chiffrage>
     */
    #[ORM\OneToMany(targetEntity: Chiffrage::class, mappedBy: 'affaire', orphanRemoval: true)]
    private Collection $chiffrages;

    public function __construct()
    {
        $this->ordreFabrications = new ArrayCollection();
        $this->date_creation = new \DateTimeImmutable();
        $this->chiffrages = new ArrayCollection();
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

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDateCreation(): ?\DateTimeInterface
    {
        return $this->date_creation;
    }

    public function setDateCreation(\DateTimeInterface $date_creation): static
    {
        $this->date_creation = $date_creation;

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

    public function getCoutTotal(): ?string
    {
        return $this->cout_total;
    }

    public function setCoutTotal(?string $cout_total): static
    {
        $this->cout_total = $cout_total;

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

    // public function getClient(): ?Client
    // {
    //     return $this->client;
    // }

    // public function setClient(?Client $client): static
    // {
    //     $this->client = $client;

    //     return $this;
    // }

    /**
     * @return Collection<int, OrdreFabrication>
     */
    public function getOrdreFabrications(): Collection
    {
        return $this->ordreFabrications;
    }

    public function addOrdreFabrication(OrdreFabrication $ordreFabrication): static
    {
        if (!$this->ordreFabrications->contains($ordreFabrication)) {
            $this->ordreFabrications->add($ordreFabrication);
            $ordreFabrication->setAffaire($this);
        }

        return $this;
    }

    public function removeOrdreFabrication(OrdreFabrication $ordreFabrication): static
    {
        if ($this->ordreFabrications->removeElement($ordreFabrication)) {
            // set the owning side to null (unless already changed)
            if ($ordreFabrication->getAffaire() === $this) {
                $ordreFabrication->setAffaire(null);
            }
        }

        return $this;
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        if ($this->date_creation === null) {
            $this->date_creation = new \DateTimeImmutable();
        }
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): static
    {
        $this->client = $client;

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
            $chiffrage->setAffaire($this);
        }

        return $this;
    }

    public function removeChiffrage(Chiffrage $chiffrage): static
    {
        if ($this->chiffrages->removeElement($chiffrage)) {
            // set the owning side to null (unless already changed)
            if ($chiffrage->getAffaire() === $this) {
                $chiffrage->setAffaire(null);
            }
        }

        return $this;
    }

}
