<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ClientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['client_read']],
)]
class Client
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["client_read", "affaire_read", "chiffrage_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(["client_read", "affaire_read", "chiffrage_read"])]
    private ?string $nom = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(["client_read", "affaire_read"])]
    private ?string $telephone = null;

    #[ORM\Column(length: 100)]
    #[Groups(["client_read", "affaire_read"])]
    private ?string $email = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(["client_read", "affaire_read"])]
    private ?string $adresse = null;

    /**
     * @var Collection<int, Affaire>
     */
    #[ORM\OneToMany(targetEntity: Affaire::class, mappedBy: 'client')]
    private Collection $affaires;


    public function __construct()
    {
        // $this->affaires = new ArrayCollection();
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
     * @return Collection<int, Affaire>
     */
    public function getAffaires(): Collection
    {
        return $this->affaires;
    }

    public function addAffaire(Affaire $affaire): static
    {
        if (!$this->affaires->contains($affaire)) {
            $this->affaires->add($affaire);
            $affaire->setClient($this);
        }

        return $this;
    }

    public function removeAffaire(Affaire $affaire): static
    {
        if ($this->affaires->removeElement($affaire)) {
            // set the owning side to null (unless already changed)
            if ($affaire->getClient() === $this) {
                $affaire->setClient(null);
            }
        }

        return $this;
    }
}
