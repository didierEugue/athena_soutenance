<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\RoleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: RoleRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['role_read']],
)]
class Role
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["role_read","user_read", "objet_read", "message_groupe_read", "affaire_read", "accesdefaut_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 10)]
    #[Groups(["role_read","user_read", "objet_read", "message_groupe_read", "accesdefaut_read"])]
    private ?string $code = null;

    #[ORM\Column(length: 50)]
    #[Groups(["role_read","user_read", "objet_read", "message_groupe_read", "affaire_read", "accesdefaut_read"])]
    private ?string $nom = null;
    
    #[ORM\Column(type: Types::DECIMAL, precision: 3, scale: 2)]
    #[Groups(["role_read","user_read", "affaire_read"])]
    private ?string $coefficient_qualification = null;

    #[ORM\OneToMany(mappedBy: 'role', targetEntity: Utilisateur::class)]
    #[Groups(["role_read"])]
    private Collection $utilisateurs;

    /**
     * @var Collection<int, AccesParDefaut>
     */
    #[ORM\OneToMany(targetEntity: AccesParDefaut::class, mappedBy: 'role', orphanRemoval: true)]
    private Collection $accesParDefauts;

    /**
     * @var Collection<int, MessageGroupe>
     */
    #[ORM\OneToMany(targetEntity: MessageGroupe::class, mappedBy: 'role', orphanRemoval: true)]
    private Collection $messageGroupes;

    


    public function __construct()
    {
        $this->utilisateurs = new ArrayCollection();
        $this->accesParDefauts = new ArrayCollection();
        $this->messageGroupes = new ArrayCollection();
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
     * @return Collection<int, Utilisateur>
     */
    public function getUtilisateurs(): Collection
    {
        return $this->utilisateurs;
    }

    public function addUtilisateur(Utilisateur $utilisateur): static
    {
        if (!$this->utilisateurs->contains($utilisateur)) {
            $this->utilisateurs->add($utilisateur);
            $utilisateur->setRole($this);
        }

        return $this;
    }

    public function removeUtilisateur(Utilisateur $utilisateur): static
    {
        if ($this->utilisateurs->removeElement($utilisateur)) {
            // set the owning side to null (unless already changed)
            if ($utilisateur->getRole() === $this) {
                $utilisateur->setRole(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, AccesParDefaut>
     */
    public function getAccesParDefauts(): Collection
    {
        return $this->accesParDefauts;
    }

    public function addAccesParDefaut(AccesParDefaut $accesParDefaut): static
    {
        if (!$this->accesParDefauts->contains($accesParDefaut)) {
            $this->accesParDefauts->add($accesParDefaut);
            $accesParDefaut->setRole($this);
        }

        return $this;
    }

    public function removeAccesParDefaut(AccesParDefaut $accesParDefaut): static
    {
        if ($this->accesParDefauts->removeElement($accesParDefaut)) {
            // set the owning side to null (unless already changed)
            if ($accesParDefaut->getRole() === $this) {
                $accesParDefaut->setRole(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, MessageGroupe>
     */
    public function getMessageGroupes(): Collection
    {
        return $this->messageGroupes;
    }

    public function addMessageGroupe(MessageGroupe $messageGroupe): static
    {
        if (!$this->messageGroupes->contains($messageGroupe)) {
            $this->messageGroupes->add($messageGroupe);
            $messageGroupe->setRole($this);
        }

        return $this;
    }

    public function removeMessageGroupe(MessageGroupe $messageGroupe): static
    {
        if ($this->messageGroupes->removeElement($messageGroupe)) {
            // set the owning side to null (unless already changed)
            if ($messageGroupe->getRole() === $this) {
                $messageGroupe->setRole(null);
            }
        }

        return $this;
    }

    public function getCoefficientQualification(): ?string
    {
        return $this->coefficient_qualification;
    }

    public function setCoefficientQualification(string $coefficient_qualification): static
    {
        $this->coefficient_qualification = $coefficient_qualification;

        return $this;
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
}