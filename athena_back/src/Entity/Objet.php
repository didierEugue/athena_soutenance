<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ObjetRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ObjetRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['objet_read']]
)]
class Objet
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["objet_read", "message_groupe_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["objet_read", "message_groupe_read"])]
    private ?string $objet_discussion = null;

    #[ORM\Column(type: 'string', columnDefinition: "ENUM('Actif', 'Résolue', 'Archivé') NOT NULL DEFAULT 'Actif'")]
    #[Groups(["objet_read", "message_groupe_read"])]
    private ?string $statut = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(["objet_read", "message_groupe_read"])]
    private ?string $reponse = null;

    #[ORM\Column]
    #[Groups(["objet_read", "message_groupe_read"])]
    private ?bool $archiver = null;

    /**
     * @var Collection<int, MessageGroupe>
     */
    #[ORM\OneToMany(targetEntity: MessageGroupe::class, mappedBy: 'objet', orphanRemoval: true)]
    private Collection $messageGroupes;

    #[ORM\Column(length: 100)]
    #[Groups(["objet_read", "message_groupe_read"])]
    private ?string $nature = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_creation = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_resolu = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_archive = null;

    public function __construct()
    {
        $this->messageGroupes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getObjetDiscussion(): ?string
    {
        return $this->objet_discussion;
    }

    public function setObjetDiscussion(string $objet_discussion): static
    {
        $this->objet_discussion = $objet_discussion;

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

    public function getReponse(): ?string
    {
        return $this->reponse;
    }

    public function setReponse(?string $reponse): static
    {
        $this->reponse = $reponse;

        return $this;
    }

    public function isArchiver(): ?bool
    {
        return $this->archiver;
    }

    public function setArchiver(bool $archiver): static
    {
        $this->archiver = $archiver;

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
            $messageGroupe->setObjet($this);
        }

        return $this;
    }

    public function removeMessageGroupe(MessageGroupe $messageGroupe): static
    {
        if ($this->messageGroupes->removeElement($messageGroupe)) {
            // set the owning side to null (unless already changed)
            if ($messageGroupe->getObjet() === $this) {
                $messageGroupe->setObjet(null);
            }
        }

        return $this;
    }

    public function getNature(): ?string
    {
        return $this->nature;
    }

    public function setNature(string $nature): static
    {
        $this->nature = $nature;

        return $this;
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        if ($this->date_creation === null) {
            $this->date_creation = new \DateTimeImmutable();
        }
    }

    public function getDateCreation(): ?\DateTimeInterface
    {
        return $this->date_creation;
    }

    public function setDateCreation(?\DateTimeInterface $date_creation): static
    {
        $this->date_creation = $date_creation;

        return $this;
    }

    public function getDateResolu(): ?\DateTimeInterface
    {
        return $this->date_resolu;
    }

    public function setDateResolu(?\DateTimeInterface $date_resolu): static
    {
        $this->date_resolu = $date_resolu;

        return $this;
    }

    public function getDateArchive(): ?\DateTimeInterface
    {
        return $this->date_archive;
    }

    public function setDateArchive(?\DateTimeInterface $date_archive): static
    {
        $this->date_archive = $date_archive;

        return $this;
    }
}
