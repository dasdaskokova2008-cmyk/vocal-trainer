<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Routing\Annotation\Route;
use Google\Client as GoogleClient;
use Google\Service\Oauth2 as GoogleOauth2;

class AuthController extends AbstractController
{
    #[Route('/login', name: 'login')]
    public function login(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher): Response
    {
            error_log('=== LOGIN AJAX ===');
        error_log('Username: ' . $request->request->get('username'));
        error_log('Is AJAX: ' . ($request->isXmlHttpRequest() ? 'yes' : 'no'));
        if ($this->getUser()) {
            $user = $this->getUser();
            if ($request->isXmlHttpRequest()) {
                $place = $em->getRepository(User::class)->getUserPlace($user);
                return $this->json([
                    'success' => true,
                    'username' => $user->getUsername(),
                    'score' => $user->getScore(),
                    'streak' => $user->getStreak(),
                    'place' => $place,
                ]);
            }
            return $this->redirectToRoute('training');
        }
        if ($request->isXmlHttpRequest()) {
            $username = $request->request->get('username');
            $password = $request->request->get('password');
            $user = $em->getRepository(User::class)->findOneBy(['username' => $username]);
            if (!$user) {
                return $this->json([
                    'success' => false,
                    'error' => '❌ Пользователь с таким логином не найден'
                ]);
            }
            if (!$passwordHasher->isPasswordValid($user, $password)) {
                return $this->json([
                    'success' => false,
                    'error' => '❌ Неверный пароль'
                ]);
            }
            $token = new UsernamePasswordToken($user, 'main', $user->getRoles());
            $this->container->get('security.token_storage')->setToken($token);
            $request->getSession()->set('_security_main', serialize($token));
            $place = $em->getRepository(User::class)->getUserPlace($user);
            return $this->json([
                'success' => true,
                'username' => $user->getUsername(),
                'score' => $user->getScore(),
                'streak' => $user->getStreak(),
                'place' => $place,
            ]);
        }
        return $this->redirectToRoute('training');
    }

    #[Route('/logout', name: 'logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route('/register', name: 'register')]
    public function register(
        Request $request, 
        UserPasswordHasherInterface $passwordHasher, 
        EntityManagerInterface $em,
        TokenStorageInterface $tokenStorage
    ): Response {
        if ($this->getUser()) {
            return $this->redirectToRoute('training');
        }
        
        $error = null;
        
        if ($request->isMethod('POST')) {
            $username = trim($request->request->get('username'));
            $password = $request->request->get('password');
            $passwordRepeat = $request->request->get('password_repeat');
            
            // 👇 ПОЛУЧАЕМ АВАТАР ИЗ ЗАПРОСА (ЕСЛИ ПЕРЕДАН)
            $avatar = $request->request->get('avatar', '');
            
            if (empty($username)) {
                $baseUsername = 'user';
                $randomDigits = str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);
                $username = $baseUsername . $randomDigits;
                
                while ($em->getRepository(User::class)->findOneBy(['username' => $username])) {
                    $randomDigits = str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);
                    $username = $baseUsername . $randomDigits;
                }
            }
            
            if (!preg_match('/^[A-Za-z0-9]+$/', $username)) {
                $error = '❌ Логин может содержать только латинские буквы и цифры. Без пробелов и спецсимволов.';
            }
            elseif ($em->getRepository(User::class)->findOneBy(['username' => $username])) {
                $error = '❌ Этот логин уже занят. Придумайте другой.';
            }
            elseif (strlen($password) < 6) {
                $error = '❌ Пароль слишком короткий. Минимум 6 символов.';
            }
            elseif ($password !== $passwordRepeat) {
                $error = '❌ Пароли не совпадают. Проверьте и попробуйте снова.';
            }
            else {
                try {
                    // 👇 ЕСЛИ НЕТ АВАТАРА - ВЫБИРАЕМ РАНДОМНЫЙ ИЗ 63
                    if (empty($avatar)) {
                        $randomId = rand(1, 63);
                        $avatar = 'avatar_' . $randomId . '.png';
                    } else {
                        // ИЗВЛЕКАЕМ ID ИЗ ИМЕНИ ФАЙЛА
                        preg_match('/avatar_(\d+)\.png/', $avatar, $matches);
                        $randomId = $matches[1] ?? 1;
                    }
                    
                    $user = new User();
                    $user->setUsername($username);
                    $user->setPassword($passwordHasher->hashPassword($user, $password));
                    $user->setScore(0);
                    $user->setSkipIntro(false);
                    $user->setRoles(['ROLE_USER']);
                    
                    // 👇 СОХРАНЯЕМ АВАТАР
                    $user->setAvatar($avatar);
                    // 👇 РАЗБЛОКИРОВАН ТОЛЬКО ЭТОТ АВАТАР
                    $user->setUnlockedAvatars([(int)$randomId]);

                    $em->persist($user);
                    $em->flush();

                    $token = new UsernamePasswordToken($user, 'main', $user->getRoles());
                    $tokenStorage->setToken($token);
                    $request->getSession()->set('_security_main', serialize($token));
                    $place = $em->getRepository(User::class)->getUserPlace($user);
                    
                    if ($request->isXmlHttpRequest()) {
                        return $this->json([
                            'success' => true,
                            'username' => $user->getUsername(),
                            'score' => $user->getScore(),
                            'streak' => $user->getStreak(),
                            'place' => $place,
                            'avatar' => $avatar, // 👈 ВОЗВРАЩАЕМ АВАТАР
                            'message' => 'Регистрация успешна!'
                        ]);
                    }

                    return $this->redirectToRoute('training');
                    
                } catch (\Exception $e) {
                    $error = '❌ Что-то пошло не так при создании аккаунта. Попробуйте позже.';
                }
            }
        }

        if ($request->isXmlHttpRequest() && $error) {
            return $this->json([
                'success' => false,
                'error' => $error
            ]);
        }

        return $this->render('auth/register.html.twig', [
            'page_title' => 'Регистрация',
            'error' => $error,
            'generated_username' => 'user' . str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT),
        ]);
    }

    #[Route('/google/login', name: 'google_start')]
    public function googleStart(): Response
    {
        $client = new GoogleClient();
        $client->setClientId($_ENV['GOOGLE_CLIENT_ID']);
        $client->setClientSecret($_ENV['GOOGLE_CLIENT_SECRET']);
        $client->setRedirectUri($_ENV['GOOGLE_REDIRECT_URI']);
        $client->addScope('email');
        $client->addScope('profile');
        $client->setAccessType('offline');
        $client->setPrompt('select_account');

        $authUrl = $client->createAuthUrl();
        
        return $this->redirect($authUrl);
    }

    #[Route('/google/callback', name: 'google_callback')]
    public function googleCallback(
        Request $request, 
        EntityManagerInterface $em, 
        UserPasswordHasherInterface $passwordHasher,
        TokenStorageInterface $tokenStorage
    ): Response {
        $code = $request->query->get('code');
        
        if (!$code) {
            $this->addFlash('error', '❌ Ошибка авторизации через Google. Код не получен.');
            return $this->redirectToRoute('training');
        }

        try {
            $client = new GoogleClient();
            $client->setClientId($_ENV['GOOGLE_CLIENT_ID']);
            $client->setClientSecret($_ENV['GOOGLE_CLIENT_SECRET']);
            $client->setRedirectUri($_ENV['GOOGLE_REDIRECT_URI']);
            $token = $client->fetchAccessTokenWithAuthCode($code);
            
            if (isset($token['error'])) {
                throw new \Exception('Ошибка получения токена: ' . ($token['error_description'] ?? 'Unknown error'));
            }

            $client->setAccessToken($token);
            $oauth2 = new GoogleOauth2($client);
            $userInfo = $oauth2->userinfo->get();

            if (!$userInfo || !$userInfo->getEmail()) {
                throw new \Exception('Не удалось получить email пользователя');
            }

            $email = $userInfo->getEmail();
            $googleId = $userInfo->getId();
            $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

            if (!$user) {
                $username = $userInfo->getName() ?? 'user' . str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);
                $baseUsername = strtolower(str_replace(' ', '_', $username));
                $finalUsername = $baseUsername;
                $counter = 1;
                while ($em->getRepository(User::class)->findOneBy(['username' => $finalUsername])) {
                    $finalUsername = $baseUsername . $counter;
                    $counter++;
                }
                
                $randomPassword = bin2hex(random_bytes(8));
                
                // 👇 ВЫБИРАЕМ РАНДОМНЫЙ АВАТАР
                $randomId = rand(1, 63);
                $avatar = 'avatar_' . $randomId . '.png';
                
                $user = new User();
                $user->setUsername($finalUsername);
                $user->setEmail($email);
                $user->setPassword($passwordHasher->hashPassword($user, $randomPassword));
                $user->setScore(0);
                $user->setSkipIntro(false);
                $user->setRoles(['ROLE_USER']);
                
                // 👇 СОХРАНЯЕМ АВАТАР
                $user->setAvatar($avatar);
                // 👇 РАЗБЛОКИРОВАН ТОЛЬКО ЭТОТ АВАТАР
                $user->setUnlockedAvatars([(int)$randomId]);
                
                $em->persist($user);
                $em->flush();
                
                $this->addFlash('success', '✅ Аккаунт создан! Добро пожаловать, ' . $finalUsername . '!');
            } else {
                $this->addFlash('success', '✅ Добро пожаловать, ' . $user->getUsername() . '!');
            }
            
            $token = new UsernamePasswordToken(
                $user,
                'main',
                $user->getRoles()
            );
            $tokenStorage->setToken($token);
            $request->getSession()->set('_security_main', serialize($token));
            
            return $this->redirectToRoute('training');
            
        } catch (\Exception $e) {
            $this->addFlash('error', '❌ Ошибка при входе через Google: ' . $e->getMessage());
            return $this->redirectToRoute('training');
        }
    }

    #[Route('/google/complete', name: 'google_complete')]
    public function googleComplete(): Response
    {
        $this->addFlash('info', '🔧 Функция завершения регистрации через Google в разработке.');
        return $this->redirectToRoute('training');
    }
}