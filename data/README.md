# PostgreSQL Docker

Инструкция по запуску PostgreSQL в Docker для проекта Presentation AI.

## 📁 Структура

```
data/
├── Dockerfile              # Dockerfile для PostgreSQL
├── docker-compose.yml      # Docker Compose для запуска
├── init.sql                # Скрипт инициализации БД и пользователей
├── generate-password-hash.js  # Утилита для генерации bcrypt хэшей
└── README.md               # Этот файл с инструкцией
```

## 🚀 Быстрый запуск

### 1. Запуск через Docker Compose (рекомендуется)

```bash
cd data
docker-compose up -d
```

### 2. Ручной запуск (альтернатива)

```bash
cd data
docker build -t presentation-postgres .
docker run -d \
  --name presentation-db \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -v ./init.sql:/docker-entrypoint-initdb.d/init.sql \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=presentation_ai \
  presentation-postgres
```

## 🔧 Параметры подключения

| Параметр | Значение |
|----------|----------|
| **Хост** | `localhost` |
| **Порт** | `5432` |
| **Пользователь** | `postgres` |
| **Пароль** | `postgres` |
| **База данных** | `presentation_ai` |

### Connection String

```
postgresql://postgres:postgres@localhost:5432/presentation_ai
```

### Для .env файла

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/presentation_ai"
```

## 👥 Пользователи по умолчанию

После первого запуска в базе данных создаются следующие пользователи:

| Email | Пароль | Роль | Доступ |
|-------|--------|------|--------|
| `admin@presentation-ai.local` | `admin123` | ADMIN | ✅ |
| `user@presentation-ai.local` | `user123` | USER | ✅ |

> ⚠️ **Важно:** Скрипт `init.sql` выполняется только при **первом** запуске контейнера (когда том с данными пуст). Для повторного создания пользователей удалите том `postgres_data`.

## 📋 Полезные команды

### Запуск контейнера (из корня проекта)

```bash
cd data
docker-compose up -d
cd ..
```

### Остановка контейнера

```bash
cd data
docker-compose down
```

### Проверка статуса контейнера

```bash
docker ps -a | grep presentation-db
```

### Просмотр логов

```bash
docker logs presentation-db
# или
docker-compose logs -f
```

### Удаление контейнера и данных

```bash
cd data
docker-compose down -v
```

### Перезапуск контейнера

```bash
docker-compose restart
```

## 🗄️ Подключение к базе данных

### Через psql

```bash
docker exec -it presentation-db psql -U postgres -d presentation_ai
```

### Через Prisma Studio

```bash
pnpm db:studio
```

### Прямое подключение из приложения

Используйте строку подключения:
```
postgresql://postgres:postgres@localhost:5432/presentation_ai
```

## 🔐 Аутентификация

В проекте используется **только** аутентификация по email/паролю через Prisma Adapter.

**Google OAuth Provider был удален.** Для входа используйте учетные записи, созданные в `init.sql`, или зарегистрируйте новых пользователей через интерфейс приложения.

## 🔑 Генерация хэшей паролей

Для создания новых пользователей с правильными bcrypt хэшами используйте утилиту:

```bash
# Из корня проекта
node data/generate-password-hash.js ваш_пароль
```

Утилита выведет bcrypt хэш, который можно использовать в SQL-запросе для добавления пользователя.

### Пример добавления пользователя

```sql
INSERT INTO "User" ("id", "name", "email", "password", "role", "hasAccess")
VALUES (
    'user_001',
    'Имя Фамилия',
    'email@example.com',
    '$2b$10$...', -- вставьте хэш из утилиты
    'USER',
    true
);
```

### Добавление пользователей из init.sql

```bash
# Из корня проекта
cat data/init.sql | docker exec -i presentation-ai-postgres psql -U postgres -d presentation_ai
```

## 📝 Примечания

- Данные сохраняются в Docker volume `postgres_data`, поэтому они не будут потеряны при удалении контейнера
- Для полного сброса данных выполните `docker-compose down -v`
- Порт 5432 должен быть свободен на вашем компьютере
- Скрипт `init.sql` создает таблицы и начальных пользователей только при первом запуске