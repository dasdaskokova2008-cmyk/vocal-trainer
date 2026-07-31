``markdown
# 🎵 Vocal Trainer

**Интерактивный веб-тренажёр для развития голоса и музыкального слуха**

Vocal Trainer — это персональный вокальный тренажёр, который помогает развивать голос, тренировать слух и изучать музыкальную теорию прямо в браузере. Использует **Web Audio API** и алгоритм **автокорреляции** для анализа голоса в реальном времени — без внешних библиотек и отправки аудио на сервер.

---

## ✨ Возможности

### 🎤 Тренировка голоса
- **Разминка** — короткие видео для разогрева связок перед тренировкой
- **Попадание в ноту** — система оценивает точность пения через формулу центов
- **Мелодии** — пение целых мелодий с визуализацией нот (light/hard режимы)

### 👂 Тренировка слуха
- **Определение нот** — угадывание ноты на нотном стане по звуку
- **Интервалы** — определение 14 типов интервалов (ч1, м2, б2, м3, б3, ч4, ув4, ум5, ч5, м6, б6, м7, б7, ч8)

### 🎮 Геймификация
- **Очки** за каждое упражнение
- **Streak** — серия дней подряд с ежедневными тренировками
- **Рейтинг** — таблица лидеров с учётом разблокированных аватаров
- **63 аватара** — коллекция, разблокируемая за 1000 очков

### 👤 Профиль
- Смена логина, пароля, аватара
- Привязка email через Google OAuth
- Статистика по каждому режиму тренировок (light/hard)

### 🎨 Интерфейс
- Две темы: светлая и тёмная
- Адаптивная вёрстка
- Плавные анимации и переходы

---

## 🛠 Технологический стек

### Backend
| Компонент | Технология |
|---|---|
| Framework | **Symfony 6.4+** |
| Язык | **PHP 8.2+** |
| ORM | **Doctrine ORM** |
| БД | **MySQL** |
| Auth | **Symfony Security** + **Google OAuth** (league/oauth2-client) |
| Логирование | **Monolog** |
| Console | Symfony Console (cron-команды) |

### Frontend
| Компонент | Технология |
|---|---|
| JS | **Vanilla JS (ES6+)** — без фреймворков |
| Audio | **Web Audio API** |
| Pitch Detection | Кастомный алгоритм **автокорреляции** |
| Templating | **Twig 3.x** |
| CSS | CSS-переменные, CSS Grid, Flexbox |

### DevOps
| Компонент | Технология |
|---|---|
| Containerization | **Docker** + **docker-compose** |
| Web Server | **Nginx** |
| PHP Runtime | **PHP-FPM** |
| Cron | `app:reset-streak` (ежедневный сброс streak) |

---

## 📁 Структура проекта

```
vocal-trainer/
├── docker-compose.yml
├── Dockerfile
├── .env / .env.local
├── composer.json
│
├── config/
│   ├── packages/
│   │   ├── security.yaml
│   │   ├── doctrine.yaml
│   │   ├── twig.yaml
│   │   └── monolog.yaml
│   └── services.yaml
│
├── src/
│   ├── Kernel.php
│   │
│   ├── Command/
│   │   └── ResetStreakCommand.php        ← app:reset-streak
│   │
│   ├── Controller/
│   │   ├── AuthController.php            ← /login, /register, /logout, /google/*
│   │   ├── ProfileController.php         ← /profile/*
│   │   ├── TrainingController.php        ← /training/*, /api/melody/*
│   │   └── RatingController.php          ← /rating
│   │
│   ├── Entity/
│   │   ├── User.php                      ← username, score, streak, JSON-поля истории
│   │   └── TrainingResult.php            ← история тренировок
│   │
│   ├── Repository/
│   │   ├── UserRepository.php            ← getUserPlace()
│   │   └── TrainingResultRepository.php  ← findByUser, getAverageScore
│   │
│   ├── Service/
│   │   └── GoogleAuthenticator.php       ← OAuth Google
│   │
│   └── EventListener/
│       └── CacheControlListener.php
│
├── templates/
│   ├── base.html.twig
│   ├── auth/
│   ├── training/
│   │   ├── index.html.twig
│   │   ├── voice.html.twig
│   │   ├── pitch.html.twig
│   │   ├── melody.html.twig
│   │   ├── warmup.html.twig
│   │   └── hearing/
│   │       ├── note.html.twig
│   │       └── intervals.html.twig
│   ├── profile/
│   └── rating/
│
├── public/
│   ├── js/                               ← 18 JS-файлов
│   │   ├── audio-utils.js                ← pitch detection
│   │   ├── notes.js                      ← 38 нот с частотами
│   │   ├── training-voice.js             ← режим голоса
│   │   ├── training-hearing.js           ← определение нот
│   │   ├── training-intervals.js         ← интервалы
│   │   ├── melody.js                     ← мелодии
│   │   ├── warmup.js                     ← разминка
│   │   ├── scoring.js                    ← расчёт очков
│   │   ├── results.js                    ← сохранение результатов
│   │   ├── auth-forms.js                 ← модалка авторизации
│   │   ├── profile.js                    ← профиль
│   │   ├── header-updater.js             ← обновление шапки
│   │   ├── theme.js                      ← переключение темы
│   │   └── ...
│   │
│   ├── css/                              ← 17 CSS-файлов
│   │   ├── style.css                     ← импортирует все остальные
│   │   ├── base.css                      ← CSS-переменные, темы
│   │   ├── header.css, footer.css
│   │   ├── pitch.css, staff.css, melody.css
│   │   └── ...
│   │
│   ├── images/
│   │   └── avatars/                      ← avatar_1.png ... avatar_63.png
│   │
│   └── videos/
│       └── warmup1.mp4 ... warmup11.mp4
│
└── var/ (logs, cache)
```

---

## 🚀 Установка и запуск

### Требования
- Docker и Docker Compose
- Git

### Быстрый старт

```bash
# 1. Клонировать репозиторий
git clone https://github.com/your-username/vocal-trainer.git
cd vocal-trainer

# 2. Скопировать переменные окружения
cp .env.example .env.local

# 3. Запустить контейнеры
docker-compose up -d

# 4. Установить зависимости
docker-compose exec php composer install

# 5. Создать БД и применить миграции
docker-compose exec php bin/console doctrine:database:create
docker-compose exec php bin/console doctrine:migrations:migrate

# 6. (Опционально) Загрузить fixtures
docker-compose exec php bin/console doctrine:fixtures:load
```

### Настройка Google OAuth

Добавьте в `.env.local`:
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/google/callback
```

### Настройка cron для streak

```bash
# Добавить в crontab:
0 0 * * * docker-compose exec -T php bin/console app:reset-streak
```

### Доступ

- Приложение: `http://localhost:8080`
- PhpMyAdmin (если настроен): `http://localhost:8081`

---

## 🎯 Использование

### Основные маршруты

| Маршрут | Назначение |
|---|---|
| `/training` | Главная страница со списком тренировок |
| `/training/voice` | Тренировка голоса |
| `/training/pitch` | Точность попадания в ноту |
| `/training/melody` | Пение мелодий |
| `/training/warmup` | Разминка с видео |
| `/training/hearing` | Тренировка слуха |
| `/training/hearing/note` | Определение нот |
| `/training/hearing/intervals` | Интервалы |
| `/profile` | Профиль пользователя |
| `/rating` | Рейтинг |

### API Endpoints

| Метод | Маршрут | Назначение |
|---|---|---|
| POST | `/training/pitch/result` | Сохранить результат тренировки |
| POST | `/api/melody/result` | Сохранить результат мелодии |
| GET | `/api/user/stats` | Статистика пользователя (JSON) |
| GET | `/api/user/melody-progress` | Прогресс по мелодиям |
| POST | `/profile/update` | Обновить профиль |
| POST | `/profile/unlock-avatar` | Разблокировать аватар |

---

## 🧠 Архитектурные решения

### Почему Vanilla JS, а не React/Vue?
1. **Производительность** — нет лишнего JS-бандла, мгновенная загрузка
2. **Контроль над Web Audio API** — прямой доступ к буферу звука для pitch detection
3. **Простота деплоя** — нет сборки через Webpack/Vite

### Почему JSON-поля в User, а не отдельные таблицы?
История тренировок — это просто массив последних 10-20 результатов, который читается при каждом запросе профиля. Отдельные таблицы дали бы больше JOIN-ов. Если бы история росла или нужны были сложные запросы — перешли бы на отдельные таблицы.

### Как работает pitch detection?
Алгоритм **автокорреляции** (похож на YIN):
1. Микрофон через Web Audio API захватывает 4096 сэмплов
2. Считаем энергию — если < 0.005, это тишина
3. Для каждого лага (44-630 сэмплов) считаем корреляцию сигнала с самим собой
4. Лаг с максимальной корреляцией = период волны
5. Частота = `sampleRate / bestLag`

Всё работает **в браузере**, без отправки аудио на сервер.

### Как определяется попадание в ноту?
Через **центы** — музыкальную единицу отклонения:
```javascript
const cents = Math.abs(1200 * Math.log2(detectedFreq / targetFreq));
```
- **±30 центов** — "в ноте" (стрелка зелёная)
- **±100 центов** — "почти" (для мелодий)
- **Больше** — мимо

### Streak-система
- При каждом действии в `TrainingController` проверяется `lastActivityDate`
- Если вчера → `streak + 1`, если сегодня → не меняем, если раньше → сброс
- Cron-команда `app:reset-streak` ежедневно в 00:00 сбрасывает streak у неактивных пользователей

---

## 🔐 Безопасность

- Пароли хэшируются через **bcrypt** (`UserPasswordHasherInterface`)
- **CSRF-защита** на критичных POST-запросах
- **Google OAuth** с проверкой `state` (защита от CSRF при OAuth)
- Валидация входных данных (username, пароль, avatar)
- Сессионная авторизация через Symfony Security

---

## 📊 Модель данных

### User
```php
User {
  id
  username           // unique, [A-Za-z0-9]+
  email              // nullable
  password           // bcrypt hash
  roles              // JSON ['ROLE_USER']
  score              // int
  streak             // int (дней подряд)
  lastActivityDate   // date
  avatar             // 'avatar_X.png'
  unlockedAvatars    // JSON array [1, 5, 12, ...]
  voiceLight         // JSON array (последние 10 результатов %)
  voiceHard          // JSON array (последние 10 результатов %)
  hearingLight       // JSON array (последние 20 результатов %)
  hearingHard        // JSON array (последние 20 результатов %)
  melodyLight        // JSON object {'Баю-баюшки': 85, ...}
  melodyHard         // JSON object
  melodyUser         // JSON object
  skipIntro          // boolean
  emailVerified      // boolean
}
```

### TrainingResult
```php
TrainingResult {
  id
  user_id            // FK → User
  note               // string (название ноты)
  difficulty         // 'easy' | 'medium' | 'hard'
  score              // int
  timeTaken          // float (секунды)
  createdAt          // DateTimeImmutable
}
```

---

## 🎨 Особенности реализации

### Pitch Detection (audio-utils.js)
- Алгоритм автокорреляции в 60 строк кода
- Порог энергии: 0.005 (тишина)
- Диапазон частот: 70-1000 Hz
- Порог корреляции: 0.1

### Расчёт очков (scoring.js)
```javascript
if (hitSeconds >= 4) return 5 * coefficient;
if (hitSeconds >= 3) return 4 * coefficient;
if (hitSeconds >= 2) return 3 * coefficient;
if (hitSeconds >= 1) return 2 * coefficient;
if (hitSeconds > 0) return 1 * coefficient;
```
Коэффициент: easy = 1, medium = 2, hard = 3

### Рейтинг (RatingController)
```php
$calculatedScore = ($avatarsCount - 1) * 1000 + $user->getScore();
```
Каждый разблокированный аватар даёт +1000 к рейтингу

---

## 🐛 Известные ограничения

1. **Бизнес-логика в контроллерах** — расчёт streak и сохранение истории находятся в `TrainingController`. По-хорошему нужно вынести в сервисы (`StreakService`, `HistoryService`).

2. **`error_log` в продакшене** — в `TrainingController::savePitchResult` есть 30+ вызовов `error_log`. Нужно заменить на `LoggerInterface` (Monolog).

3. **Отсутствие rate limiting** — можно спамить `/training/pitch/result` для накрутки очков. Нужен `symfony/rate-limiter`.

4. **RatingController загружает всех пользователей** — нет пагинации, сортировка в PHP. Нужно оптимизировать через DQL.

5. **`normalizeToOctave` работает некорректно** — вместо `freq *= 2` написано `freq = 100`. Нужно исправить.

6. **Опечатки в `intervals-data.js`** — пробелы внутри строк (`'М и2♭'`, `'Д о'`) ломают матчинг.

---

## 🚧 TODO

- [ ] Вынести бизнес-логику в сервисы (`StreakService`, `HistoryService`, `AvatarService`)
- [ ] Добавить CSRF во все POST-эндпоинты
- [ ] Валидация `avatar` в `/profile/update` и `/register`
- [ ] Добавить rate limiting
- [ ] Оптимизировать `RatingController` (пагинация, DQL)
- [ ] Заменить `error_log` на Monolog
- [ ] Исправить `normalizeToOctave`
- [ ] Исправить опечатки в `intervals-data.js`
- [ ] Добавить unit-тесты (PHPUnit)
- [ ] Добавить интеграционные тесты для API
- [ ] Система друзей
- [ ] Новые тренировки: аккорды, диктанты
- [ ] Классы с учителями

---

## 📄 Лицензия

Этот проект создан в образовательных целях.

---

## 👩‍💻 Автор

**Дарья Скокова** — пианистка, вокалистка и разработчик.

Проект создан с любовью к музыке и желанием сделать обучение вокалу доступным для каждого.

---

## 🙏 Благодарности

- Видео для разминки взяты с канала **"Уроки Вокала от Саши"** на YouTube
- Алгоритм pitch detection вдохновлён **YIN-алгоритмом**
- Иконки аватаров — уникальные иллюстрации

---

**Спасибо за интерес к проекту! 🎵**
```

---

## 📝 Дополнительные файлы

### `.env.example`
```env
APP_ENV=dev
APP_SECRET=your-secret-key
DATABASE_URL=mysql://db_user:db_password@db:3306/vocal_trainer

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/google/callback

MAILER_DSN=smtp://user:pass@smtp.example.com:587
```

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./:/var/www/html
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - php

  php:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ./:/var/www/html
    depends_on:
      - db
    environment:
      - DATABASE_URL=mysql://vocal_user:vocal_pass@db:3306/vocal_trainer

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: vocal_trainer
      MYSQL_USER: vocal_user
      MYSQL_PASSWORD: vocal_pass
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:

