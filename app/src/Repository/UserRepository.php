<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }
    public function getUserPlace(User $user): int
    {
        $qb = $this->createQueryBuilder('u');
        $result = $qb
            ->select('COUNT(u.id) + 1 as place')
            ->where('u.score > :score')
            ->setParameter('score', $user->getScore())
            ->getQuery()
            ->getSingleScalarResult();
        
        return (int)$result;
    }
}


