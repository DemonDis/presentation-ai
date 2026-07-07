# PostgreSQL Docker

Инструкция по запуску PostgreSQL в Docker для проекта Презентация AI.

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

После запуска будут доступны:
- **PostgreSQL** на `localhost:5432`
- **pgAdmin** на `http://localhost:5050` (логин: `admin@admin.com`, пароль: `admin`)

### 2. Ручной запуск (альтернатива)

```bash
cd data
docker build -t presentation-postgres .
docker run -d \
  --name presentation-ai-postgres \
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

### Запуск контейнеров (из корня проекта)

```bash
cd data
docker-compose up -d
cd ..
```

### Остановка контейнеров

```bash
cd data
docker-compose down
```

### Проверка статуса

```bash
docker ps -a | grep presentation-ai
```

### Просмотр логов

```bash
docker logs presentation-ai-postgres
# или
docker-compose logs -f
```

### Удаление контейнеров и данных

```bash
cd data
docker-compose down -v
```

### Перезапуск контейнеров

```bash
docker-compose restart
```

## 🗄️ Подключение к базе данных

### Через psql

```bash
docker exec -i presentation-ai-postgres psql -U postgres -d presentation_ai < data/init.sql
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

## 🖥️ pgAdmin

В Docker Compose добавлен сервис pgAdmin для управления базой данных через веб-интерфейс.

| Параметр | Значение |
|----------|----------|
| **URL** | `http://localhost:5050` |
| **Email** | `admin@admin.com` |
| **Пароль** | `admin` |

### Подключение к PostgreSQL в pgAdmin

1. Открой `http://localhost:5050`, войди под `admin@admin.com` / `admin`
2. Нажми **Add New Server**
3. На вкладке **General** укажи имя (например, `Presentation AI`)
4. На вкладке **Connection**:
   - **Host**: `postgres` (имя сервиса в Docker-сети)
   - **Port**: `5432`
   - **Maintenance database**: `presentation_ai`
   - **Username**: `postgres`
   - **Password**: `postgres`
5. Нажми **Save**

> Если подключение из другого контейнера, используй хост `postgres`. Для подключения с хоста — `localhost`.

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
- **Astra Linux**: на некоторых версиях Astra Linux `docker-proxy` может некорректно работать с протоколом PostgreSQL. В этом случае используется bridge-сеть `app_network` — контейнеры общаются напрямую, минуя docker-proxy. Если подключение с хоста не работает, проверь настройки сетевого экрана.