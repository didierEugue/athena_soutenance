<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ConsigneRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ConsigneRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['consigne_read']],
)]
class Consigne
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["consigne_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 30)]
    #[Groups(["consigne_read"])]
    private ?string $titre = null;

    #[ORM\Column(length: 15)]
    #[Groups(["consigne_read"])]
    private ?string $type = null;

    #[ORM\Column(length: 255)]
    #[Groups(["consigne_read"])]
    private ?string $contenu = null;

    #[ORM\Column(length: 10)]
    #[Groups(["consigne_read"])]
    private ?string $etat = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(["consigne_read"])]
    private ?\DateTimeInterface $date_creation = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(["consigne_read"])]
    private ?\DateTimeInterface $date_echeance = null;

    #[ORM\Column(length: 30)]
    #[Groups(["consigne_read"])]
    private ?string $priorite = null;

    #[ORM\ManyToOne(inversedBy: 'consignes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["consigne_read"])]
    private ?Utilisateur $expediteur = null;

    #[ORM\ManyToOne(inversedBy: 'consignes')]
    #[Groups(["consigne_read"])]
    private ?Utilisateur $destinataire = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

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

    public function getEtat(): ?string
    {
        return $this->etat;
    }

    public function setEtat(string $etat): static
    {
        $this->etat = $etat;

        return $this;
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

    public function getDateEcheance(): ?\DateTimeInterface
    {
        return $this->date_echeance;
    }

    public function setDateEcheance(?\DateTimeInterface $date_echeance): static
    {
        $this->date_echeance = $date_echeance;

        return $this;
    }

    public function getPriorite(): ?string
    {
        return $this->priorite;
    }

    public function setPriorite(string $priorite): static
    {
        $this->priorite = $priorite;

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

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        if ($this->date_creation === null) {
            $this->date_creation = new \DateTimeImmutable();
        }
    }
}
