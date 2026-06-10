<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ParticipantRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ParticipantRepository::class)]
#[ApiResource(
    normalizationContext: ['groups'=> ['participant_read']]
)]
class Participant
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["participant_read", "message_groupe_read"])]
    private ?int $id = null;

    /**
     * @var Collection<int, ParticipantsGroupe>
     */
    #[ORM\OneToMany(targetEntity: ParticipantsGroupe::class, mappedBy: 'participant', orphanRemoval: true)]
    private Collection $participantsGroupes;

    /**
     * @var Collection<int, MessageGroupe>
     */
    #[ORM\OneToMany(targetEntity: MessageGroupe::class, mappedBy: 'participant')]
    private Collection $messageGroupes;

    public function __construct()
    {
        $this->participantsGroupes = new ArrayCollection();
        $this->messageGroupes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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
            $participantsGroupe->setParticipant($this);
        }

        return $this;
    }

    public function removeParticipantsGroupe(ParticipantsGroupe $participantsGroupe): static
    {
        if ($this->participantsGroupes->removeElement($participantsGroupe)) {
            // set the owning side to null (unless already changed)
            if ($participantsGroupe->getParticipant() === $this) {
                $participantsGroupe->setParticipant(null);
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
            $messageGroupe->setParticipant($this);
        }

        return $this;
    }

    public function removeMessageGroupe(MessageGroupe $messageGroupe): static
    {
        if ($this->messageGroupes->removeElement($messageGroupe)) {
            // set the owning side to null (unless already changed)
            if ($messageGroupe->getParticipant() === $this) {
                $messageGroupe->setParticipant(null);
            }
        }

        return $this;
    }
}
