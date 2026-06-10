<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UtilisateurRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;


#[ORM\Entity(repositoryClass: UtilisateurRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[ApiResource(
    normalizationContext: ['groups'=> ['user_read']],
)]
#[ORM\HasLifecycleCallbacks]
class Utilisateur implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["user_read", "rja_read", "agenda_read", "message_read", "role_read", "objet_read", "participant_groupe_read", "message_groupe_read", "affaire_read", "consigne_read"])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(["user_read"])]
    private ?string $email = null;

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups(["user_read"])]
    private ?string $password = null;

    #[ORM\ManyToOne(targetEntity: Role::class, inversedBy: 'utilisateurs', cascade: ['persist'], fetch: 'LAZY')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["user_read", "affaire_read"])]
    private ?Role $role = null;

    #[ORM\Column(length: 100)]
    #[Groups(["user_read", "rja_read", "agenda_read", "message_read", "role_read", "objet_read", "participant_groupe_read", "message_groupe_read", "affaire_read", "consigne_read"])]
    private ?string $nom = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(["user_read", "rja_read", "agenda_read", "message_read", "role_read", "objet_read", "participant_groupe_read", "message_groupe_read", "affaire_read", "consigne_read"])]
    private ?string $prenoms = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(["user_read"])]
    private ?string $telephone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["user_read"])]
    private ?string $adresse = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_creation = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date_modif = null;

    #[ORM\Column]
    #[Groups(["user_read"])]
    private ?bool $actif = null;



    /**
     * @var Collection<int, AccesPersonnalise>
     */
    #[ORM\OneToMany(targetEntity: AccesPersonnalise::class, mappedBy: 'utilisateur', orphanRemoval: true)]
    private Collection $accesPersonnalises;

    // /**
    //  * @var Collection<int, TacheParActivite>
    //  */
    // #[ORM\OneToMany(targetEntity: TacheParActivite::class, mappedBy: 'executeur', orphanRemoval: true)]
    // private Collection $tacheParActivites;

    /**
     * @var Collection<int, Message>
     */
    // #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'expediteur', orphanRemoval: true)]
    // private Collection $messages;
    #[ORM\OneToMany(mappedBy: 'expediteur', targetEntity: Message::class)]
    private Collection $messagesEnvoyes;

    #[ORM\OneToMany(mappedBy: 'destinataire', targetEntity: Message::class)]
    private Collection $messagesRecus;

    /**
     * @var Collection<int, MessageGroupe>
     */
    #[ORM\OneToMany(targetEntity: MessageGroupe::class, mappedBy: 'expediteur', orphanRemoval: true)]
    private Collection $messageGroupes;

    /**
     * @var Collection<int, TacheParActivite>
     */
    #[ORM\OneToMany(targetEntity: TacheParActivite::class, mappedBy: 'executeur', orphanRemoval: true)]
    #[Groups(["user_read"])]
    private Collection $tacheParActivites;

    /**
     * @var Collection<int, Agenda>
     */
    #[ORM\OneToMany(targetEntity: Agenda::class, mappedBy: 'expediteur', orphanRemoval: true)]
    private Collection $agendas;

    /**
     * @var Collection<int, ParticipantsGroupe>
     */
    #[ORM\OneToMany(targetEntity: ParticipantsGroupe::class, mappedBy: 'utilisateur', orphanRemoval: true)]
    private Collection $participantsGroupes;

    /**
     * @var Collection<int, Consigne>
     */
    #[ORM\OneToMany(targetEntity: Consigne::class, mappedBy: 'expediteur', orphanRemoval: true)]
    private Collection $consignes;

    /**
     * @var Collection<int, Fichier>
     */
    #[ORM\OneToMany(targetEntity: Fichier::class, mappedBy: 'utilisateur')]
    private Collection $fichiers;

    public function __construct()
    {
        $this->accesPersonnalises = new ArrayCollection();
        // $this->tacheParActivites = new ArrayCollection();
        // $this->messages = new ArrayCollection();
        $this->messageGroupes = new ArrayCollection();
        $this->messagesEnvoyes = new ArrayCollection();
        $this->messagesRecus = new ArrayCollection();
        $this->actif = false;
        $this->agendas = new ArrayCollection();
        $this->participantsGroupes = new ArrayCollection();
        $this->consignes = new ArrayCollection();
        $this->fichiers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        // L'utilisateur a un seul rôle, stocké dans l'entité Role
        return $this->role ? [$this->role->getNom()] : ['ROLE_USER'];
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenoms(): ?string
    {
        return $this->prenoms;
    }

    public function setPrenoms(?string $prenoms): static
    {
        $this->prenoms = $prenoms;

        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(?string $telephone): static
    {
        $this->telephone = $telephone;

        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(?string $adresse): static
    {
        $this->adresse = $adresse;

        return $this;
    }

    public function getDateCreation(): ?\DateTimeInterface
    {
        return $this->date_creation;
    }

    public function setDateCreation(\DateTimeInterface $date_creation): static
    {
        $this->date_creation = $date_creation;

        return $this;
    }

    public function getDateModif(): ?\DateTimeInterface
    {
        return $this->date_modif;
    }

    public function setDateModif(?\DateTimeInterface $date_modif): static
    {
        $this->date_modif = $date_modif;

        return $this;
    }

    public function isActif(): ?bool
    {
        return $this->actif;
    }

    public function setActif(bool $actif): static
    {
        $this->actif = $actif;

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
            $accesPersonnalise->setUtilisateur($this);
        }

        return $this;
    }

    public function removeAccesPersonnalise(AccesPersonnalise $accesPersonnalise): static
    {
        if ($this->accesPersonnalises->removeElement($accesPersonnalise)) {
            // set the owning side to null (unless already changed)
            if ($accesPersonnalise->getUtilisateur() === $this) {
                $accesPersonnalise->setUtilisateur(null);
            }
        }

        return $this;
    }

    // /**
    //  * @return Collection<int, TacheParActivite>
    //  */
    // public function getTacheParActivites(): Collection
    // {
    //     return $this->tacheParActivites;
    // }

    // public function addTacheParActivite(TacheParActivite $tacheParActivite): static
    // {
    //     if (!$this->tacheParActivites->contains($tacheParActivite)) {
    //         $this->tacheParActivites->add($tacheParActivite);
    //         $tacheParActivite->setExecuteur($this);
    //     }

    //     return $this;
    // }

    // public function removeTacheParActivite(TacheParActivite $tacheParActivite): static
    // {
    //     if ($this->tacheParActivites->removeElement($tacheParActivite)) {
    //         // set the owning side to null (unless already changed)
    //         if ($tacheParActivite->getExecuteur() === $this) {
    //             $tacheParActivite->setExecuteur(null);
    //         }
    //     }

    //     return $this;
    // }

    /**
     * @return Collection<int, Message>
     */
    // public function getMessages(): Collection
    // {
    //     return $this->messages;
    // }

    // public function addMessage(Message $message): static
    // {
    //     if (!$this->messages->contains($message)) {
    //         $this->messages->add($message);
    //         $message->setExpediteur($this);
    //     }

    //     return $this;
    // }

    // public function removeMessage(Message $message): static
    // {
    //     if ($this->messages->removeElement($message)) {
    //         // set the owning side to null (unless already changed)
    //         if ($message->getExpediteur() === $this) {
    //             $message->setExpediteur(null);
    //         }
    //     }

    //     return $this;
    // }

    public function getMessagesEnvoyes(): Collection
    {
        return $this->messagesEnvoyes;
    }

    public function addMessageEnvoye(Message $message): static
    {
        if (!$this->messagesEnvoyes->contains($message)) {
            $this->messagesEnvoyes->add($message);
            $message->setExpediteur($this);
        }

        return $this;
    }

    public function removeMessageEnvoye(Message $message): static
    {
        if ($this->messagesEnvoyes->removeElement($message)) {
            if ($message->getExpediteur() === $this) {
                $message->setExpediteur(null);
            }
        }

        return $this;
    }

    public function getMessagesRecus(): Collection
    {
        return $this->messagesRecus;
    }

    public function addMessageRecu(Message $message): static
    {
        if (!$this->messagesRecus->contains($message)) {
            $this->messagesRecus->add($message);
            $message->setDestinataire($this);
        }

        return $this;
    }

    public function removeMessageRecu(Message $message): static
    {
        if ($this->messagesRecus->removeElement($message)) {
            if ($message->getDestinataire() === $this) {
                $message->setDestinataire(null);
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
            $messageGroupe->setExpediteur($this);
        }

        return $this;
    }

    public function removeMessageGroupe(MessageGroupe $messageGroupe): static
    {
        if ($this->messageGroupes->removeElement($messageGroupe)) {
            // set the owning side to null (unless already changed)
            if ($messageGroupe->getExpediteur() === $this) {
                $messageGroupe->setExpediteur(null);
            }
        }

        return $this;
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        if ($this->date_creation === null) {
            $this->date_creation = new \DateTimeImmutable();
        }
    }

 

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->date_modif = new \DateTimeImmutable();
    }

    /**
     * @return Collection<int, TacheParActivite>
     */
    public function getTacheParActivites(): Collection
    {
        return $this->tacheParActivites;
    }

    public function addTacheParActivite(TacheParActivite $tacheParActivite): static
    {
        if (!$this->tacheParActivites->contains($tacheParActivite)) {
            $this->tacheParActivites->add($tacheParActivite);
            $tacheParActivite->setExecuteur($this);
        }

        return $this;
    }

    public function removeTacheParActivite(TacheParActivite $tacheParActivite): static
    {
        if ($this->tacheParActivites->removeElement($tacheParActivite)) {
            // set the owning side to null (unless already changed)
            if ($tacheParActivite->getExecuteur() === $this) {
                $tacheParActivite->setExecuteur(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Agenda>
     */
    public function getAgendas(): Collection
    {
        return $this->agendas;
    }

    public function addAgenda(Agenda $agenda): static
    {
        if (!$this->agendas->contains($agenda)) {
            $this->agendas->add($agenda);
            $agenda->setExpediteur($this);
        }

        return $this;
    }

    public function removeAgenda(Agenda $agenda): static
    {
        if ($this->agendas->removeElement($agenda)) {
            // set the owning side to null (unless already changed)
            if ($agenda->getExpediteur() === $this) {
                $agenda->setExpediteur(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ParticipantsGroupe>
     */
    public function getParticipantsGroupes(): Collection
    {
        return $this->participantsGroupes;
    }

    public function addParticipantsGroupe(ParticipantsGroupe $participantsGroupe): static
    {
        if (!$this->participantsGroupes->contains($participantsGroupe)) {
            $this->participantsGroupes->add($participantsGroupe);
            $participantsGroupe->setUtilisateur($this);
        }

        return $this;
    }

    public function removeParticipantsGroupe(ParticipantsGroupe $participantsGroupe): static
    {
        if ($this->participantsGroupes->removeElement($participantsGroupe)) {
            // set the owning side to null (unless already changed)
            if ($participantsGroupe->getUtilisateur() === $this) {
                $participantsGroupe->setUtilisateur(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Consigne>
     */
    public function getConsignes(): Collection
    {
        return $this->consignes;
    }

    public function addConsigne(Consigne $consigne): static
    {
        if (!$this->consignes->contains($consigne)) {
            $this->consignes->add($consigne);
            $consigne->setExpediteur($this);
        }

        return $this;
    }

    public function removeConsigne(Consigne $consigne): static
    {
        if ($this->consignes->removeElement($consigne)) {
            // set the owning side to null (unless already changed)
            if ($consigne->getExpediteur() === $this) {
                $consigne->setExpediteur(null);
            }
        }

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
            $fichier->setUtilisateur($this);
        }

        return $this;
    }

    public function removeFichier(Fichier $fichier): static
    {
        if ($this->fichiers->removeElement($fichier)) {
            // set the owning side to null (unless already changed)
            if ($fichier->getUtilisateur() === $this) {
                $fichier->setUtilisateur(null);
            }
        }

        return $this;
    }

}