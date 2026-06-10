<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SousMenuRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SousMenuRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['sousmenu_read']],
)]
class SousMenu
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["sousmenu_read", "menu_read", "accesdefaut_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 4)]
    #[Groups(["sousmenu_read", "menu_read", "accesdefaut_read"])]
    private ?string $code = null;

    #[ORM\Column(length: 255)]
    #[Groups(["sousmenu_read", "menu_read", "accesdefaut_read"])]
    private ?string $nom = null;

    #[ORM\ManyToOne(inversedBy: 'sousMenus')]
    private ?Menu $menu = null;

    /**
     * @var Collection<int, FonctionSousMenu>
     */
    #[ORM\OneToMany(targetEntity: FonctionSousMenu::class, mappedBy: 'sousmenu')]
    #[Groups(["sousmenu_read", "menu_read", "accesdefaut_read"])]
    private Collection $fonctionSousMenus;

    public function __construct()
    {
        $this->fonctionSousMenus = new ArrayCollection();
    }


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

    public function getMenu(): ?Menu
    {
        return $this->menu;
    }

    public function setMenu(?Menu $menu): static
    {
        $this->menu = $menu;

        return $this;
    }

    /**
     * @return Collection<int, FonctionSousMenu>
     */
    public function getFonctionSousMenus(): Collection
    {
        return $this->fonctionSousMenus;
    }

    public function addFonctionSousMenu(FonctionSousMenu $fonctionSousMenu): static
    {
        if (!$this->fonctionSousMenus->contains($fonctionSousMenu)) {
            $this->fonctionSousMenus->add($fonctionSousMenu);
            $fonctionSousMenu->setSousmenu($this);
        }

        return $this;
    }

    public function removeFonctionSousMenu(FonctionSousMenu $fonctionSousMenu): static
    {
        if ($this->fonctionSousMenus->removeElement($fonctionSousMenu)) {
            // set the owning side to null (unless already changed)
            if ($fonctionSousMenu->getSousmenu() === $this) {
                $fonctionSousMenu->setSousmenu(null);
            }
        }

        return $this;
    }

}
