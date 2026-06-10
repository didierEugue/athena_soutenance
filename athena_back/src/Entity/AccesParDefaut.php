<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AccesParDefautRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AccesParDefautRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['accesdefaut_read']],
)]
class AccesParDefaut
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["accesdefaut_read"])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'accesParDefauts', targetEntity: Role::class, cascade: ['persist', 'remove'], fetch: 'LAZY')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["accesdefaut_read"])]
    private ?Role $role = null;

    // #[ORM\ManyToOne(inversedBy: 'accesParDefauts', targetEntity: Fonction::class, cascade: ['persist', 'remove'], fetch: 'LAZY')]
    // #[ORM\JoinColumn(nullable: false)]
    // #[Groups(["accesdefaut_read"])]
    // private ?Fonction $fonction = null;

    #[ORM\ManyToOne(inversedBy: 'accesParDefauts', targetEntity: Menu::class, cascade: ['persist', 'remove'], fetch: 'LAZY')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["accesdefaut_read"])]
    private ?Menu $menu = null;

    public function getId(): ?int
    {
        return $this->id;
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

    // public function getFonction(): ?Fonction
    // {
    //     return $this->fonction;
    // }

    // public function setFonction(?Fonction $fonction): static
    // {
    //     $this->fonction = $fonction;

    //     return $this;
    // }

    public function getMenu(): ?Menu
    {
        return $this->menu;
    }

    public function setMenu(?Menu $menu): static
    {
        $this->menu = $menu;

        return $this;
    }
}
