<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ResetStreakCommand extends Command
{
    protected function configure(): void
    {
        $this->setName('app:reset-streak')
             ->setDescription('Сбрасывает стрик у пользователей, пропустивших день');
    }

    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        parent::__construct();
        $this->em = $em;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $today = new \DateTime('today');
        $yesterday = (clone $today)->modify('-1 day');
        
        $users = $this->em->getRepository(User::class)->findAll();
        $resetCount = 0;
        
        foreach ($users as $user) {
            $lastActivity = $user->getLastActivityDate();
            
            if ($lastActivity && $lastActivity < $yesterday) {
                $user->setStreak(0);
                $resetCount++;
                $output->writeln("🔥 Сброшен стрик для: " . $user->getUsername());
            }
        }
        
        $this->em->flush();
        $output->writeln("✅ Сброшено стриков: $resetCount");
        
        return Command::SUCCESS;
    }
}