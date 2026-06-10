<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\MessageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['message_read']],
)]
class Message
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["message_read"])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'messagesEnvoyes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["message_read"])]
    private ?Utilisateur $expediteur = null;

    #[ORM\ManyToOne(inversedBy: 'messagesRecus')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["message_read"])]
    private ?Utilisateur $destinataire = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(["message_read"])]
    private ?string $contenu = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(["message_read"])]
    private ?\DateTimeInterface $date_envoie = null;

    #[ORM\Column]
    #[Groups(["message_read"])]
    private ?bool $statut = null;

    /**
     * @var Collection<int, Fichier>
     */
    #[ORM\OneToMany(targetEntity: Fichier::class, mappedBy: 'message_prive')]
    private Collection $fichiers;

    public function __construct()
    {
        $this->fichiers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getDestinataire(): ?Utilisateur
    {
        return $this->destinataire;
    }

    public function setDestinataire(?Utilisateur $destinataire): static
    {
        $this->destinataire = $destinataire;

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

    public function getDateEnvoie(): ?\DateTimeInterface
    {
        return $this->date_envoie;
    }

    public function setDateEnvoie(\DateTimeInterface $date_envoie): static
    {
        $this->date_envoie = $date_envoie;

        return $this;
    }

    public function isStatut(): ?bool
    {
        return $this->statut;
    }

    public function setStatut(bool $statut): static
    {
        $this->statut = $statut;

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
            $fichier->setMessagePrive($this);
        }

        return $this;
    }

    public function removeFichier(Fichier $fichier): static
    {
        if ($this->fichiers->removeElement($fichier)) {
            // set the owning side to null (unless already changed)
            if ($fichier->getMessagePrive() === $this) {
                $fichier->setMessagePrive(null);
            }
        }

        return $this;
    }
}
