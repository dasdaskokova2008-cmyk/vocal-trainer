<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: 'App\Repository\UserRepository')]
#[ORM\Table(name: 'users')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(type: 'json')]
    private array $roles = ['ROLE_USER'];

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $score = 0;
    
    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $voiceLight = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $voiceHard = null;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $skipIntro = false;
    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    private int $streak = 0;

    #[ORM\Column(type: 'date', nullable: true)]
    private ?\DateTimeInterface $lastActivityDate = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $avatar = null; 

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private bool $emailVerified = false;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $hearingLight = null; 

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $hearingHard = null; 

    public function getAvatar(): ?string { return $this->avatar; }
    public function setAvatar(?string $avatar): self { $this->avatar = $avatar; return $this; }

    public function isEmailVerified(): bool { return $this->emailVerified; }
    public function setEmailVerified(bool $emailVerified): self { $this->emailVerified = $emailVerified; return $this; }

    public function getHearingLight(): ?array { return $this->hearingLight; }
    public function setHearingLight(?array $hearingLight): self { $this->hearingLight = $hearingLight; return $this; }

    public function getHearingHard(): ?array { return $this->hearingHard; }
    public function setHearingHard(?array $hearingHard): self { $this->hearingHard = $hearingHard; return $this; }

    public function getStreak(): int
    {
        return $this->streak;
    }

    public function setStreak(int $streak): self
    {
        $this->streak = $streak;
        return $this;
    }

    public function getLastActivityDate(): ?\DateTimeInterface
    {
        return $this->lastActivityDate;
    }

    public function setLastActivityDate(?\DateTimeInterface $lastActivityDate): self
    {
        $this->lastActivityDate = $lastActivityDate;
        return $this;
    }

    public function getSkipIntro(): bool
    {
        return $this->skipIntro;
    }

    public function setSkipIntro(bool $skipIntro): self
    {
        $this->skipIntro = $skipIntro;
        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }

    public function eraseCredentials(): void
    {
    }

    public function getUserIdentifier(): string
    {
        return $this->username ?? '';
    }

    public function getScore(): int
    {
        return $this->score;
    }

    public function setScore(int $score): self
    {
        $this->score = $score;
        return $this;
    }

    public function addScore(int $points): self
    {
        $this->score += $points;
        return $this;
    }
    
    public function getVoiceLight(): ?array
    {
        return $this->voiceLight;
    }

    public function setVoiceLight(?array $voiceLight): self
    {
        $this->voiceLight = $voiceLight;
        return $this;
    }

    public function getVoiceHard(): ?array
    {
        return $this->voiceHard;
    }

    public function setVoiceHard(?array $voiceHard): self
    {
        $this->voiceHard = $voiceHard;
        return $this;
    }

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $unlockedAvatars = [];

    public function getUnlockedAvatars(): ?array
    {
        return $this->unlockedAvatars;
    }

    public function setUnlockedAvatars(?array $unlockedAvatars): self
    {
        $this->unlockedAvatars = $unlockedAvatars;
        return $this;
    }

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $melodyLight = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $melodyHard = null;
    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $melodyUser = null; 

    public function getMelodyLight(): ?array { return $this->melodyLight; }
    public function setMelodyLight(?array $melodyLight): self { $this->melodyLight = $melodyLight; return $this; }

    public function getMelodyHard(): ?array { return $this->melodyHard; }
    public function setMelodyHard(?array $melodyHard): self { $this->melodyHard = $melodyHard; return $this; }

    public function getMelodyUser(): ?array { return $this->melodyUser; }
    public function setMelodyUser(?array $melodyUser): self { $this->melodyUser = $melodyUser; return $this; }
}