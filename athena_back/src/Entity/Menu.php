<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\MenuRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MenuRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['menu_read']],
)]
class Menu
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["menu_read", "accesdefaut_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(["menu_read", "accesdefaut_read"])]
    private ?string $code = null;

    #[ORM\Column(length: 100)]
    #[Groups(["menu_read", "accesdefaut_read"])]
    private ?string $nom = null;


    /**
     * @var Collection<int, AccesParDefaut>
     */
    #[ORM\OneToMany(targetEntity: AccesParDefaut::class, mappedBy: 'menu', orphanRemoval: true)]
    private Collection $accesParDefauts;

    /**
     * @var Collection<int, AccesPersonnalise>
     */
    #[ORM\OneToMany(targetEntity: AccesPersonnalise::class, mappedBy: 'menu', orphanRemoval: true)]
    private Collection $accesPersonnalises;

    /**
     * @var Collection<int, SousMenu>
     */
    #[ORM\OneToMany(targetEntity: SousMenu::class, mappedBy: 'menu')]
    #[Groups(["menu_read", "accesdefaut_read"])]
    private Collection $sousMenus;



    public function __construct()
    {
        // $this->menus = new ArrayCollection();
        $this->accesParDefauts = new ArrayCollection();
        $this->accesPersonnalises = new ArrayCollection();
        // $this->sousMenus = new ArrayCollection();
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
            $accesParDefaut->setMenu($this);
        }

        return $this;
    }

    public function removeAccesParDefaut(AccesParDefaut $accesParDefaut): static
    {
        if ($this->accesParDefauts->removeElement($accesParDefaut)) {
            // set the owning side to null (unless already changed)
            if ($accesParDefaut->getMenu() === $this) {
                $accesParDefaut->setMenu(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, AccesPersonnalise>
     */
    public function getAccesPersonnalises(): Collection
    {
        return $this->accesPersonnalises;
    }

    public function addAccesPersonnalise(AccesPersonnalise $accesPersonnalise): static
    {
        if (!$this->accesPersonnalises->contains($accesPersonnalise)) {
            $this->accesPersonnalises->add($accesPersonnalise);
            $accesPersonnalise->setMenu($this);
        }

        return $this;
    }

    public function removeAccesPersonnalise(AccesPersonnalise $accesPersonnalise): static
    {
        if ($this->accesPersonnalises->removeElement($accesPersonnalise)) {
            // set the owning side to null (unless already changed)
            if ($accesPersonnalise->getMenu() === $this) {
                $accesPersonnalise->setMenu(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, SousMenu>
     */
    public function getSousMenus(): Collection
    {
        return $this->sousMenus;
    }

    public function addSousMenu(SousMenu $sousMenu): static
    {
        if (!$this->sousMenus->contains($sousMenu)) {
            $this->sousMenus->add($sousMenu);
            $sousMenu->setMenu($this);
        }

        return $this;
    }

    public function removeSousMenu(SousMenu $sousMenu): static
    {
        if ($this->sousMenus->removeElement($sousMenu)) {
            // set the owning side to null (unless already changed)
            if ($sousMenu->getMenu() === $this) {
                $sousMenu->setMenu(null);
            }
        }

        return $this;
    }

}
