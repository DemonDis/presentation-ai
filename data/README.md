# PostgreSQL Docker

Инструкция по запуску PostgreSQL в Docker для проекта Presentation AI.

## 📁 Структура

```
data/
├── Dockerfile          # Dockerfile для PostgreSQL
└── README.md           # Этот файл с инструкцией
```

## 🚀 Быстрый запуск

### 1. Сборка образа

```bash
cd data
docker build -t presentation-postgres .
```

### 2. Запуск контейнера

```bash
docker run -d \
  --name presentation-db \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
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

## 📋 Полезные команды

### Проверка статуса контейнера

```bash
docker ps -a | grep presentation-db
```

### Просмотр логов

```bash
docker logs presentation-db
```

### Остановка контейнера

```bash
docker stop presentation-db
```

### Запуск остановленного контейнера

```bash
docker start presentation-db
```

### Удаление контейнера

```bash
docker rm -f presentation-db
```

### Удаление тома с данными

```bash
docker volume rm postgres_data
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

## 📝 Примечания

- Данные сохраняются в Docker volume `postgres_data`, поэтому они не будут потеряны при удалении контейнера
- Для полного сброса данных удалите том `postgres_data`
- Порт 5432 должен быть свободен на вашем компьютере