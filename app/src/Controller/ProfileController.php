<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Csrf\CsrfToken;

class ProfileController extends AbstractController
{
    #[Route('/profile', name: 'profile')]
    public function index(EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->redirectToRoute('training');
        }

        if (!$user->getAvatar()) {
            $randomId = rand(1, 63);
            $randomAvatar = 'avatar_' . $randomId . '.png';
            $user->setAvatar($randomAvatar);
            
            if (!$user->getUnlockedAvatars()) {
                $user->setUnlockedAvatars([$randomId]); 
            }
            $em->flush();
        }

        return $this->render('profile/index.html.twig', [
            'page_title' => 'Профиль',
            'user' => $user,
            'avatar' => $user->getAvatar(),
        ]);
    }

    #[Route('/profile/update', name: 'profile_update', methods: ['POST'])]
    public function update(
        Request $request, 
        EntityManagerInterface $em, 
        UserPasswordHasherInterface $passwordHasher,
        CsrfTokenManagerInterface $csrfTokenManager
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['success' => false, 'error' => 'Не авторизован'], 401);
        }

        $data = json_decode($request->getContent(), true);
        
        $csrfToken = $data['_csrf_token'] ?? $request->headers->get('X-CSRF-Token');
        if (!$csrfToken || !$csrfTokenManager->isTokenValid(new CsrfToken('pitch_result', $csrfToken))) {
            return $this->json(['success' => false, 'error' => 'Неверный CSRF токен'], 403);
        }

        $username = trim($data['username'] ?? '');
        $avatar = $data['avatar'] ?? null;
        $oldPassword = $data['oldPassword'] ?? null;
        $newPassword = $data['newPassword'] ?? null;
        $confirmPassword = $data['confirmPassword'] ?? null;

        if (!empty($username)) {
            if (!preg_match('/^[A-Za-z0-9]+$/', $username)) {
                return $this->json(['success' => false, 'error' => 'Только латиница и цифры']);
            }
            $existing = $em->getRepository(User::class)->findOneBy(['username' => $username]);
            if ($existing && $existing->getId() !== $user->getId()) {
                return $this->json(['success' => false, 'error' => 'Логин уже занят']);
            }
            $user->setUsername($username);
        }

        if ($avatar) {
            if (!preg_match('/^avatar_(\d+)\.png$/', $avatar, $matches) || 
                (int)$matches[1] < 1 || (int)$matches[1] > 63) {
                return $this->json(['success' => false, 'error' => 'Недопустимый аватар'], 400);
            }
            $user->setAvatar($avatar);
        }

        if ($oldPassword && $newPassword && $confirmPassword) {
            if (!$passwordHasher->isPasswordValid($user, $oldPassword)) {
                return $this->json(['success' => false, 'error' => 'Неверный старый пароль']);
            }
            if (strlen($newPassword) < 6) {
                return $this->json(['success' => false, 'error' => 'Пароль должен быть минимум 6 символов']);
            }
            if ($newPassword !== $confirmPassword) {
                return $this->json(['success' => false, 'error' => 'Пароли не совпадают']);
            }
            $user->setPassword($passwordHasher->hashPassword($user, $newPassword));
        }

        $em->flush();

        return $this->json([
            'success' => true,
            'username' => $user->getUsername(),
            'avatar' => $user->getAvatar(),
        ]);
    }

    #[Route('/profile/change-password', name: 'profile_change_password', methods: ['POST'])]
    public function changePassword(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        CsrfTokenManagerInterface $csrfTokenManager
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['success' => false, 'error' => 'Не авторизован'], 401);
        }

        $data = json_decode($request->getContent(), true);
        
        $csrfToken = $data['_csrf_token'] ?? $request->headers->get('X-CSRF-Token');
        if (!$csrfToken || !$csrfTokenManager->isTokenValid(new CsrfToken('pitch_result', $csrfToken))) {
            return $this->json(['success' => false, 'error' => 'Неверный CSRF токен'], 403);
        }

        $oldPassword = $data['oldPassword'] ?? '';
        $newPassword = $data['newPassword'] ?? '';
        $confirmPassword = $data['confirmPassword'] ?? '';

        if (!$passwordHasher->isPasswordValid($user, $oldPassword)) {
            return $this->json(['success' => false, 'error' => 'Неверный старый пароль']);
        }
        if (strlen($newPassword) < 6) {
            return $this->json(['success' => false, 'error' => 'Пароль должен быть минимум 6 символов']);
        }
        if ($newPassword !== $confirmPassword) {
            return $this->json(['success' => false, 'error' => 'Пароли не совпадают']);
        }

        $user->setPassword($passwordHasher->hashPassword($user, $newPassword));
        $em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/profile/bind-email', name: 'profile_bind_email', methods: ['POST'])]
    public function bindEmail(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['success' => false, 'error' => 'Не авторизован'], 401);
        }

        $data = json_decode($request->getContent(), true);
        $email = trim($data['email'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['success' => false, 'error' => 'Неверный email']);
        }

        $existing = $em->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existing && $existing->getId() !== $user->getId()) {
            return $this->json(['success' => false, 'error' => 'Email уже занят']);
        }

        $user->setEmail($email);
        $user->setEmailVerified(false);
        $em->flush();

        return $this->json(['success' => true, 'email' => $email]);
    }

    #[Route('/profile/delete', name: 'profile_delete', methods: ['POST'])]
    public function deleteAccount(
        Request $request,
        EntityManagerInterface $em,
        TokenStorageInterface $tokenStorage
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['success' => false, 'error' => 'Не авторизован'], 401);
        }

        $data = json_decode($request->getContent(), true);
        $confirm = $data['confirm'] ?? false;
        
        if (!$confirm) {
            return $this->json(['success' => false, 'error' => 'Подтвердите удаление']);
        }

        try {
            $em->remove($user);
            $em->flush();
            
            $tokenStorage->setToken(null);
            $request->getSession()->invalidate();

            return $this->json(['success' => true]);
        } catch (\Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException $e) {
            return $this->json([
                'success' => false, 
                'error' => 'Невозможно удалить аккаунт: существуют связанные записи тренировок. (Требуется миграция БД)'
            ], 400);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false, 
                'error' => 'Произошла ошибка при удалении: ' . $e->getMessage()
            ], 500);
        }
    }

    #[Route('/profile/stats', name: 'profile_stats')]
    public function getStats(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Не авторизован'], 401);
        }

        $voiceLight = $user->getVoiceLight() ?? [];
        $voiceHard = $user->getVoiceHard() ?? [];
        $hearingLight = $user->getHearingLight() ?? [];
        $hearingHard = $user->getHearingHard() ?? [];

        $calculateAverage = function($data, $limit) {
            if (empty($data)) return 0;
            $slice = array_slice($data, -$limit);
            return round(array_sum($slice) / count($slice));
        };

        return $this->json([
            'voiceLight' => $calculateAverage($voiceLight, 10),
            'voiceHard' => $calculateAverage($voiceHard, 10),
            'hearingLight' => $calculateAverage($hearingLight, 20),
            'hearingHard' => $calculateAverage($hearingHard, 20),
        ]);
    }

    #[Route('/profile/unlock-avatar', name: 'profile_unlock_avatar', methods: ['POST'])]
    public function unlockAvatar(
        EntityManagerInterface $em,
        Request $request,
        CsrfTokenManagerInterface $csrfTokenManager
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['success' => false, 'error' => 'Не авторизован'], 401);
        }

        $data = json_decode($request->getContent(), true);
        $csrfToken = $data['_csrf_token'] ?? $request->headers->get('X-CSRF-Token');
        if (!$csrfToken || !$csrfTokenManager->isTokenValid(new CsrfToken('pitch_result', $csrfToken))) {
            return $this->json(['success' => false, 'error' => 'Неверный CSRF токен'], 403);
        }

        if ($user->getScore() < 1000) {
            return $this->json(['success' => false, 'error' => 'Недостаточно очков. Нужно 1000']);
        }

        $unlocked = $user->getUnlockedAvatars() ?? [];
        $allAvatars = range(1, 63);
        $available = array_diff($allAvatars, $unlocked);

        if (empty($available)) {
            return $this->json(['success' => false, 'error' => 'Все аватары уже разблокированы!']);
        }

        $randomId = $available[array_rand($available)];
        $avatarName = 'avatar_' . $randomId . '.png';

        $user->setScore($user->getScore() - 1000);
        $unlocked[] = $randomId;
        $user->setUnlockedAvatars($unlocked);
        $user->setAvatar($avatarName);

        $em->flush();

        return $this->json([
            'success' => true,
            'avatar' => $avatarName,
            'id' => $randomId,
            'newScore' => $user->getScore(),
            'message' => 'Новый аватар разблокирован!'
        ]);
    }

    #[Route('/profile/avatars', name: 'profile_avatars', methods: ['GET'])]
    public function getAvatars(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Не авторизован'], 401);
        }

        $unlocked = $user->getUnlockedAvatars() ?? [];
        
        if (empty($unlocked)) {
            $unlocked = [1];
            $user->setUnlockedAvatars($unlocked);
            $user->setAvatar('avatar_1.png');
            $em->flush();
        }

        return $this->json([
            'unlocked' => $unlocked,
            'current' => $user->getAvatar(),
        ]);
    }
    
    #[Route('/profile/skip-intro', name: 'profile_skip_intro', methods: ['POST'])]
    public function skipIntro(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Не авторизован'], 401);
        }

        $user->setSkipIntro(true);
        $em->flush();

        return $this->json(['success' => true]);
    }
}