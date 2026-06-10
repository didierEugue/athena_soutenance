<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AgendaRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AgendaRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['agenda_read']],
)]
class Agenda
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["agenda_read"])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(["agenda_read"])]
    private ?\DateTimeInterface $date_debut = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(["agenda_read"])]
    private ?\DateTimeInterface $date_fin = null;

    #[ORM\Column(length: 50)]
    #[Groups(["agenda_read"])]
    private ?string $titre = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["agenda_read"])]
    private ?string $description = null;

    #[ORM\Column(length: 50)]
    #[Groups(["agenda_read"])]
    private ?string $importance = null;

    #[ORM\ManyToOne(inversedBy: 'agendas')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["agenda_read"])]
    private ?Utilisateur $expediteur = null;

    #[ORM\ManyToOne(inversedBy: 'agendas')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["agenda_read"])]
    private ?Utilisateur $destinataire = null;

    #[ORM\Column(length: 20)]
    #[Groups(["agenda_read"])]
    private ?string $type = null;

    #[ORM\Column(type: 'string', columnDefinition: "ENUM('standby','terminé') NOT NULL DEFAULT 'standby'")]
    #[Groups(["agenda_read"])]
    private ?string $statut = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateDebut(): ?\DateTimeInterface
    {
        return $this->date_debut;
    }

    public function setDateDebut(\DateTimeInterface $date_debut): static
    {
        $this->date_debut = $date_debut;

        return $this;
    }

    public function getDateFin(): ?\DateTimeInterface
    {
        return $this->date_fin;
    }

    public function setDateFin(\DateTimeInterface $date_fin): static
    {
        $this->date_fin = $date_fin;

        return $this;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): static
    {
        $this->titre = $titre;

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

    public function getImportance(): ?string
    {
        return $this->importance;
    }

    public function setImportance(string $importance): static
    {
        $this->importance = $importance;

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

    public function getDestinataire(): ?Utilisateur
    {
        return $this->destinataire;
    }

    public function setDestinataire(?Utilisateur $destinataire): static
    {
        $this->destinataire = $destinataire;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

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
}
