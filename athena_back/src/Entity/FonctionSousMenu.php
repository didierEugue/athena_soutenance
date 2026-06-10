<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\FonctionSousMenuRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FonctionSousMenuRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['fonctionsmenu_read']],
)]
class FonctionSousMenu
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["fonctionsmenu_read", "sousmenu_read", "menu_read", "accesdefaut_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 4)]
    #[Groups(["fonctionsmenu_read", "sousmenu_read", "menu_read", "accesdefaut_read"])]
    private ?string $code = null;

    #[ORM\Column(length: 255)]
    #[Groups(["fonctionsmenu_read", "sousmenu_read", "menu_read", "accesdefaut_read"])]
    private ?string $nom = null;

    #[ORM\ManyToOne(inversedBy: 'fonctionSousMenus')]
    private ?SousMenu $sousmenu = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getSousmenu(): ?SousMenu
    {
        return $this->sousmenu;
    }

    public function setSousmenu(?SousMenu $sousmenu): static
    {
        $this->sousmenu = $sousmenu;

        return $this;
    }
}
