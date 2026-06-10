<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\MessageGroupeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MessageGroupeRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['message_groupe_read']]
)]
class MessageGroupe
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["message_groupe_read"])]
    private ?int $id = null;

    // #[ORM\Column(length: 100, nullable:true)]
    // private ?string $nom = null;

    #[ORM\ManyToOne(inversedBy: 'messageGroupes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["message_groupe_read"])]
    private ?Objet $objet = null;

    #[ORM\ManyToOne(inversedBy: 'messageGroupes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["message_groupe_read"])]
    private ?Utilisateur $expediteur = null;

    #[ORM\ManyToOne(inversedBy: 'messageGroupes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["message_groupe_read"])]
    private ?Role $role = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(["message_groupe_read"])]
    private ?string $contenu = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(["message_groupe_read"])]
    private ?\DateTimeInterface $date_envoi = null;

    #[ORM\ManyToOne(inversedBy: 'messageGroupes')]
    #[Groups(["message_groupe_read"])]
    private ?Participant $participant = null;

    /**
     * @var Collection<int, Fichier>
     */
    #[ORM\OneToMany(targetEntity: Fichier::class, mappedBy: 'mg')]
    private Collection $fichiers;

    public function __construct()
    {
        $this->fichiers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    // public function getNom(): ?string
    // {
    //     return $this->nom;
    // }

    // public function setNom(string $nom): static
    // {
    //     $this->nom = $nom;

    //     return $this;
    // }

    public function getObjet(): ?Objet
    {
        return $this->objet;
    }

    public function setObjet(?Objet $objet): static
    {
        $this->objet = $objet;

        return $this;
    }

    public function getExpediteur(): ?Utilisateur
    {
        return $this->expediteur;
    }

    public function setExpediteur(?Utilisateur $expediteur): static
    {
        $this->expediteur = $expediteur;

        return $this;
    }

    public function getRole(): ?Role
    {
        return $this->role;
    }

    public function setRole(?Role $role): static
    {
        $this->role = $role;

        return $this;
    }

    public function getContenu(): ?string
    {
        return $this->contenu;
    }

    public function setContenu(string $contenu): static
    {
        $this->contenu = $contenu;

        return $this;
    }

    public function getDateEnvoi(): ?\DateTimeInterface
    {
        return $this->date_envoi;
    }

    public function setDateEnvoi(\DateTimeInterface $date_envoi): static
    {
        $this->date_envoi = $date_envoi;

        return $this;
    }

    public function getParticipant(): ?Participant
    {
        return $this->participant;
    }

    public function setParticipant(?Participant $participant): static
    {
        $this->participant = $participant;

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
            $fichier->setMg($this);
        }

        return $this;
    }

    public function removeFichier(Fichier $fichier): static
    {
        if ($this->fichiers->removeElement($fichier)) {
            // set the owning side to null (unless already changed)
            if ($fichier->getMg() === $this) {
                $fichier->setMg(null);
            }
        }

        return $this;
    }
}
