<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RatingController extends AbstractController
{
    #[Route('/rating', name: 'rating')]
    public function index(EntityManagerInterface $em): Response
    {
        $users = $em->getRepository(User::class)->findBy([], ['score' => 'DESC']);
        
        $usersData = [];
        foreach ($users as $user) {
            $unlockedAvatars = $user->getUnlockedAvatars() ?? [];
            $avatarsCount = count($unlockedAvatars);
            $calculatedScore = ($avatarsCount - 1) * 1000 + $user->getScore();
            
            $usersData[] = [
                'user' => $user,
                'calculatedScore' => $calculatedScore,
                'streak' => $user->getStreak(),
                'avatarsCount' => $avatarsCount,
            ];
        }
        usort($usersData, function($a, $b) {
            return $b['calculatedScore'] - $a['calculatedScore'];
        });
        
        return $this->render('rating/index.html.twig', [
            'page_title' => 'Рейтинг',
            'usersData' => $usersData,
        ]);
    }
}