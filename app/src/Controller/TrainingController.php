<?php

namespace App\Controller;

use App\Entity\TrainingResult;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Security\Csrf\CsrfToken;

class TrainingController extends AbstractController
{
    #[Route('/training', name: 'training')]
    public function index(): Response
    {
        return $this->render('training/index.html.twig', [
            'page_title' => 'Вокальный тренажёр',
        ]);
    }

    #[Route('/training/hearing', name: 'training_hearing')]
    public function hearing(): Response
    {
        return $this->render('training/hearing.html.twig', [
            'page_title' => 'Тренировка слуха',
        ]);
    }

    #[Route('/training/voice', name: 'training_voice')]
    public function voice(): Response
    {
        return $this->render('training/voice.html.twig', [
            'page_title' => 'Тренировка голоса',
        ]);
    }

    #[Route('/training/pitch', name: 'training_pitch')]
    public function pitch(): Response
    {
        return $this->render('training/pitch.html.twig', [
            'page_title' => 'Точность звука',
        ]);
    }

    #[Route('/training/warmup', name: 'training_warmup')]
    public function warmup(): Response
    {
        $skipIntro = false;
        if ($this->getUser()) {
            $skipIntro = $this->getUser()->getSkipIntro();
        }
        
        return $this->render('training/warmup.html.twig', [
            'skipIntro' => $skipIntro,
        ]);
    }

    #[Route('/api/skip-intro', name: 'skip_intro', methods: ['POST'])]
    public function skipIntro(Request $request, EntityManagerInterface $em): JsonResponse
    {
        if (!$this->getUser()) {
            return $this->json(['error' => 'Не авторизован'], 401);
        }

        $user = $this->getUser();
        $user->setSkipIntro(true);
        $em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/training/pitch/result', name: 'training_pitch_result', methods: ['POST'])]
    public function savePitchResult(
        Request $request, 
        EntityManagerInterface $em,
        CsrfTokenManagerInterface $csrfTokenManager
    ): JsonResponse {
        error_log('========== НОВЫЙ ЗАПРОС НА /training/pitch/result ==========');
        
        $user = $this->getUser();
        if (!$user) {
            error_log('ОШИБКА: Пользователь не авторизован');
            return new JsonResponse(['error' => 'Not authenticated'], 401);
        }
        error_log('Пользователь: ' . $user->getUsername() . ' (ID: ' . $user->getId() . ')');

        $content = $request->getContent();
        error_log('Сырые данные (JSON): ' . $content);
        
        $data = json_decode($content, true);
        if ($data === null) {
            error_log('ОШИБКА: Невалидный JSON');
            return new JsonResponse(['error' => 'Invalid JSON'], 400);
        }
        error_log('JSON распарсен успешно');

        $token = $data['_csrf_token'] ?? null;
        error_log('CSRF токен в запросе: ' . ($token ?: 'ОТСУТСТВУЕТ'));
        
        if (!$token) {
            error_log('ОШИБКА: CSRF токен отсутствует');
            return new JsonResponse(['error' => 'CSRF token missing'], 403);
        }
        
        $isTokenValid = $csrfTokenManager->isTokenValid(new CsrfToken('pitch_result', $token));
        error_log('CSRF токен валиден: ' . ($isTokenValid ? 'ДА' : 'НЕТ'));
        
        if (!$isTokenValid) {
            error_log('ОШИБКА: Невалидный CSRF токен');
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }

        $required = ['type', 'difficulty', 'totalTests', 'totalScore', 'percentage', 'results'];
        $missingFields = [];
        
        foreach ($required as $field) {
            if (!array_key_exists($field, $data)) {
                $missingFields[] = $field;
                error_log("ОТСУТСТВУЕТ ПОЛЕ: '$field'");
            } else {
                error_log("Поле '$field': " . json_encode($data[$field]));
            }
        }
        
        if (!empty($missingFields)) {
            error_log('ОШИБКА: Отсутствуют поля: ' . implode(', ', $missingFields));
            error_log('Доступные поля: ' . implode(', ', array_keys($data)));
            return new JsonResponse([
                'error' => 'Missing fields: ' . implode(', ', $missingFields),
                'missing' => $missingFields
            ], 400);
        }

        $type = $data['type'];
        $validTypes = ['voice', 'hearing', 'pitch'];
        if (!in_array($type, $validTypes)) {
            error_log("ОШИБКА: Невалидный тип '$type'. Допустимые: " . implode(', ', $validTypes));
            return new JsonResponse(['error' => 'Invalid type. Allowed: ' . implode(', ', $validTypes)], 400);
        }
        error_log("Тип валиден: $type");

        $difficulty = $data['difficulty'];
        $validDifficulties = ['easy', 'medium', 'hard'];
        if (!in_array($difficulty, $validDifficulties)) {
            error_log("ОШИБКА: Невалидная сложность '$difficulty'. Допустимые: " . implode(', ', $validDifficulties));
            return new JsonResponse(['error' => 'Invalid difficulty. Allowed: ' . implode(', ', $validDifficulties)], 400);
        }
        error_log("Сложность валидна: $difficulty");

        $totalTests = (int)$data['totalTests'];
        if ($totalTests < 1 || $totalTests > 20) {
            error_log("ОШИБКА: Невалидное количество тестов: $totalTests");
            return new JsonResponse(['error' => 'Invalid totalTests. Must be between 1 and 20'], 400);
        }
        error_log("totalTests: $totalTests");

        $totalScore = (int)$data['totalScore'];
        if ($totalScore < 0) {
            error_log("ОШИБКА: Отрицательный счёт: $totalScore");
            return new JsonResponse(['error' => 'Invalid totalScore. Must be >= 0'], 400);
        }
        error_log("totalScore: $totalScore");

        $percentage = (int)$data['percentage'];
        if ($percentage < 0 || $percentage > 100) {
            error_log("ОШИБКА: Невалидный процент: $percentage");
            return new JsonResponse(['error' => 'Invalid percentage. Must be between 0 and 100'], 400);
        }
        error_log("percentage: $percentage%");

        $results = $data['results'];
        if (!is_array($results)) {
            error_log('ОШИБКА: Results не является массивом');
            return new JsonResponse(['error' => 'Results must be an array'], 400);
        }
        error_log("Количество результатов: " . count($results));

        $maxAttempts = 20;
        if (count($results) > $maxAttempts) {
            error_log("ОШИБКА: Слишком много результатов: " . count($results) . " (макс: $maxAttempts)");
            return new JsonResponse(['error' => 'Too many attempts. Max: ' . $maxAttempts], 400);
        }

        foreach ($results as $index => $result) {
            error_log("Проверка результата #$index: " . json_encode($result));
            
            if (!is_array($result)) {
                error_log("ОШИБКА: Результат #$index не является массивом");
                return new JsonResponse(['error' => "Result #$index must be an array"], 400);
            }
            
            if (!isset($result['hitTime'])) {
                error_log("ОШИБКА: В результате #$index отсутствует 'hitTime'");
                return new JsonResponse(['error' => "Result #$index missing 'hitTime'"], 400);
            }
            
            if (!isset($result['success'])) {
                error_log("ОШИБКА: В результате #$index отсутствует 'success'");
                return new JsonResponse(['error' => "Result #$index missing 'success'"], 400);
            }
            
            if (!is_numeric($result['hitTime']) || $result['hitTime'] < 0) {
                error_log("ОШИБКА: Невалидный hitTime в результате #$index: " . $result['hitTime']);
                return new JsonResponse(['error' => "Invalid hitTime in result #$index"], 400);
            }
            
            if (!is_bool($result['success'])) {
                error_log("ОШИБКА: Невалидный success в результате #$index: " . json_encode($result['success']));
                return new JsonResponse(['error' => "Success must be boolean in result #$index"], 400);
            }
        }
        error_log('Все результаты валидны');

        $oldScore = $user->getScore();
        $user->setScore($oldScore + $totalScore);
        error_log("Счёт обновлён: $oldScore → " . $user->getScore() . " (+$totalScore)");

        if ($type === 'hearing') {
            error_log('Сохраняем историю для HEARING');
            if ($difficulty === 'hard') {
                $history = $user->getHearingHard() ?? [];
                array_unshift($history, $percentage);
                $history = array_slice($history, 0, 20);
                $user->setHearingHard($history);
                error_log('История hearing_hard обновлена');
            } else {
                $history = $user->getHearingLight() ?? [];
                array_unshift($history, $percentage);
                $history = array_slice($history, 0, 20);
                $user->setHearingLight($history);
                error_log('История hearing_light обновлена');
            }
        } else {
            error_log('Сохраняем историю для VOICE/PITCH');
            if ($difficulty === 'hard') {
                $history = $user->getVoiceHard() ?? [];
                array_unshift($history, $percentage);
                $history = array_slice($history, 0, 10);
                $user->setVoiceHard($history);
                error_log('История voice_hard обновлена');
            } else {
                $history = $user->getVoiceLight() ?? [];
                array_unshift($history, $percentage);
                $history = array_slice($history, 0, 10);
                $user->setVoiceLight($history);
                error_log('История voice_light обновлена');
            }
        }

        $userDate = $data['userDate'] ?? null;

        if ($userDate) {
            $today = \DateTime::createFromFormat('Y-m-d', $userDate);
            if (!$today) {
                $today = new \DateTime('today');
                error_log("НЕВЕРНЫЙ ФОРМАТ userDate: " . $userDate . ", используем серверную");
            } else {
                error_log("userDate распаршен: " . $today->format('Y-m-d'));
            }
        } else {
            $today = new \DateTime('today');
            error_log("userDate ОТСУТСТВУЕТ, используем серверную: " . $today->format('Y-m-d'));
        }

        $lastActivity = $user->getLastActivityDate();
        $currentStreak = $user->getStreak();

        error_log("СЕГОДНЯ: " . $today->format('Y-m-d'));
        error_log("ПОСЛЕДНЯЯ АКТИВНОСТЬ (ДО ОБНОВЛЕНИЯ): " . ($lastActivity ? $lastActivity->format('Y-m-d') : 'НЕТ'));
        error_log("ТЕКУЩИЙ СТРИК (ДО ОБНОВЛЕНИЯ): " . $currentStreak);

        if (!$lastActivity) {
            $user->setStreak(1);
            error_log("ПЕРВАЯ АКТИВНОСТЬ: СТРИК = 1");
        } else {
            $lastDate = $lastActivity->format('Y-m-d');
            $todayStr = $today->format('Y-m-d');
            $yesterdayStr = (clone $today)->modify('-1 day')->format('Y-m-d');
            
            if ($lastDate === $todayStr) {
                error_log("УЖЕ СЕГОДНЯ: СТРИК = " . $currentStreak);
            } elseif ($lastDate === $yesterdayStr) {
                $newStreak = $currentStreak + 1;
                $user->setStreak($newStreak);
                error_log("+1 (ВЧЕРА): СТРИК = " . $newStreak);
            } else {
                $user->setStreak(1);
                error_log("СБРОС (ПРОПУЩЕН ДЕНЬ): СТРИК = 0");
            }
        }

        $user->setLastActivityDate($today);
        error_log("ДАТА СОХРАНЕНА: " . $today->format('Y-m-d'));

        $em->flush();
        error_log('Данные сохранены в БД');

        $place = $em->getRepository(User::class)->getUserPlace($user);
        error_log("Место в рейтинге: $place");

        $response = [
            'success' => true,
            'newTotalScore' => $user->getScore(),
            'newPlace' => $place,
            'addedScore' => $totalScore,
            'percentage' => $percentage,
            'newStreak' => $user->getStreak(),
            'isActiveToday' => $user->getLastActivityDate()?->format('Y-m-d') === (new \DateTime())->format('Y-m-d'),
        ];
        
        error_log('Ответ: ' . json_encode($response));
        error_log('========== КОНЕЦ ЗАПРОСА ==========');

        return new JsonResponse($response);
    }

    private function calculateScore(float $hitSeconds, string $difficulty): int
    {
        $coefficient = 1;
        if ($difficulty === 'medium') $coefficient = 2;
        else if ($difficulty === 'hard') $coefficient = 3;
        
        if ($hitSeconds >= 4) return 5 * $coefficient;
        if ($hitSeconds >= 3) return 4 * $coefficient;
        if ($hitSeconds >= 2) return 3 * $coefficient;
        if ($hitSeconds >= 1) return 2 * $coefficient;
        if ($hitSeconds > 0) return 1 * $coefficient;
        return 0;
    }

    #[Route('/training/pitch/stats', name: 'training_pitch_stats')]
    public function getPitchStats(EntityManagerInterface $em): Response
    {
        if (!$this->getUser()) {
            return $this->json(['error' => 'Не авторизован'], 401);
        }

        $user = $this->getUser();
        $repo = $em->getRepository(TrainingResult::class);

        return $this->json([
            'totalScore' => $repo->getTotalScore($user),
            'averageScore' => $repo->getAverageScore($user),
            'totalTests' => count($repo->findByUser($user)),
        ]);
    }

    #[Route('/check-username', name: 'check_username', methods: ['GET'])]
    public function checkUsername(Request $request, EntityManagerInterface $em): Response
    {
        $username = $request->query->get('username');
        
        if (empty($username)) {
            return $this->json(['exists' => false]);
        }
        
        $user = $em->getRepository(User::class)->findOneBy(['username' => $username]);
        
        return $this->json(['exists' => $user !== null]);
    }

    #[Route('/api/user/stats', name: 'api_user_stats', methods: ['GET'])]
    public function getUserStats(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Не авторизован'], 401);
        }

        $lastActivity = $user->getLastActivityDate();
        $today = new \DateTime('today');
        $isActiveToday = $lastActivity && $lastActivity->format('Y-m-d') === $today->format('Y-m-d');

        return $this->json([
            'username' => $user->getUsername(),
            'score' => $user->getScore(),
            'streak' => $user->getStreak(),
            'place' => $em->getRepository(User::class)->getUserPlace($user),
            'isActiveToday' => $isActiveToday,
        ]);
    }

    #[Route('/training/hearing/note', name: 'training_hearing_note')]
    public function hearingNote(): Response
    {
        return $this->render('training/hearing/note.html.twig', [
            'page_title' => 'Определение нот | Тренировка слуха',
        ]);
    }

    #[Route('/training/hearing/intervals', name: 'training_hearing_intervals')]
    public function intervals(): Response
    {
        return $this->render('training/hearing/intervals.html.twig', [
            'page_title' => 'Интервалы и аккорды | Тренировка слуха',
        ]);
    }

    #[Route('/api/user/melody-progress', name: 'api_melody_progress', methods: ['GET'])]
    public function getMelodyProgress(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Не авторизован'], 401);
        }

        return $this->json([
            'light' => $user->getMelodyLight() ?? [],
            'hard' => $user->getMelodyHard() ?? [],
            'user' => $user->getMelodyUser() ?? [],
        ]);
    }

    #[Route('/api/melody/result', name: 'api_melody_result', methods: ['POST'])]
    public function saveMelodyResult(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Не авторизован'], 401);
        }

        $data = json_decode($request->getContent(), true);
        $type = $data['type'] ?? 'light';
        $melodyKey = $data['melodyKey'] ?? '';
        $percentage = (int)($data['percentage'] ?? 0);
        $score = (int)($data['score'] ?? 0);

        $user->setScore($user->getScore() + $score);

        $progress = [];
        if ($type === 'light') {
            $progress = $user->getMelodyLight() ?? [];
            if (!isset($progress[$melodyKey]) || $progress[$melodyKey] < $percentage) {
                $progress[$melodyKey] = $percentage;
            }
            $user->setMelodyLight($progress);
        } elseif ($type === 'hard') {
            $progress = $user->getMelodyHard() ?? [];
            if (!isset($progress[$melodyKey]) || $progress[$melodyKey] < $percentage) {
                $progress[$melodyKey] = $percentage;
            }
            $user->setMelodyHard($progress);
        } else {
            $progress = $user->getMelodyUser() ?? [];
            if (!isset($progress[$melodyKey]) || $progress[$melodyKey] < $percentage) {
                $progress[$melodyKey] = $percentage;
            }
            $user->setMelodyUser($progress);
        }

        $today = new \DateTime('today');
        $lastActivity = $user->getLastActivityDate();
        $currentStreak = $user->getStreak();

        if (!$lastActivity) {
            $user->setStreak(1);
        } else {
            $lastDate = $lastActivity->format('Y-m-d');
            $todayStr = $today->format('Y-m-d');
            $yesterdayStr = (new \DateTime('yesterday'))->format('Y-m-d');
            
            if ($lastDate === $todayStr) {
            } elseif ($lastDate === $yesterdayStr) {
                $user->setStreak($currentStreak + 1);
            } else {
                $user->setStreak(0);
            }
        }
        $user->setLastActivityDate($today);

        $em->flush();

        return $this->json([
            'success' => true,
            'percentage' => $percentage,
            'score' => $score,
            'newTotalScore' => $user->getScore(),
            'newStreak' => $user->getStreak(),
        ]);
    }
    #[Route('/training/melody', name: 'training_melody')]
    public function melody(EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        $melodyProgress = [];
        
        if ($user) {
            $melodyProgress = [
                'light' => $user->getMelodyLight() ?? [],
                'hard' => $user->getMelodyHard() ?? [],
                'user' => $user->getMelodyUser() ?? [],
            ];
        }
        
        return $this->render('training/melody.html.twig', [
            'page_title' => 'Мелодии | Тренировка голоса',
            'melodyProgress' => $melodyProgress,
        ]);
    }
}
