# PostgreSQL Docker

Инструкция по запуску PostgreSQL в Docker для проекта Презентация AI.

## 🚀 Быстрый запуск

Запустите PostgreSQL через Docker Compose из корня проекта (файл `compose.yaml`):

```bash
docker compose up -d
```

> Если `compose.yaml` нет в корне, используйте команду ниже для ручного запуска.

### Ручной запуск контейнера

```bash
docker run -d \
  --name presentation-ai-postgres \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=presentation_ai \
  postgres:15
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

После применения схемы и запуска seed (см. ниже) создаются пользователи:

| Email | Пароль | Роль | Доступ |
|-------|--------|------|--------|
| `filin@filin.filin` | `123` | USER | ✅ |
| `sav@sav.sav` | `123` | USER | ✅ |
| `alx@alx.alx` | `123` | USER | ✅ |
| `dap@dap.dap` | `123` | USER | ✅ |
| `daa@daa.daa` | `123` | USER | ✅ |
| `yvi@yvi.yvi` | `123` | USER | ✅ |
| `kgv@kgv.kgv` | `123` | USER | ✅ |
| `sdd@sdd.sdd` | `123` | USER | ✅ |
| `vev@vev.vev` | `123` | USER | ✅ |
| `mee@mee.mee` | `123` | USER | ✅ |
| `iea@iea.iea` | `123` | USER | ✅ |
| `ass@ass.ass` | `123` | USER | ✅ |
| `bma@bma.bma` | `123` | USER | ✅ |
| `knv@knv.knv` | `123` | USER | ✅ |
| `olegv@olegv.olegv` | `123` | USER | ✅ |
| `sre@sre.sre` | `123` | USER | ✅ |
| `gsa@gsa.gsa` | `123` | USER | ✅ |
| `lsa@lsa.lsa` | `123` | USER | ✅ |
| `sls@sls.sls` | `123` | USER | ✅ |
| `ptl@ptl.ptl` | `123` | USER | ✅ |

## 📦 Создание пользователей (seed)

Пользователи создаются через Prisma seed. После настройки БД выполните:

```bash
# Применить схему и заполнить данными
pnpm db:push

# Или только seed (если схема уже применена)
pnpm db:seed
```

Seed-скрипт: `prisma/seed.cjs` — добавляет пользователей, если их ещё нет в базе.

## 🗄️ Полезные команды

### Prisma Studio (графический интерфейс)

```bash
pnpm db:studio
```

### Подключение через psql

```bash
docker exec -it presentation-ai-postgres psql -U postgres -d presentation_ai
```

### Просмотр логов

```bash
docker logs presentation-ai-postgres
```

### Остановка и удаление контейнера

```bash
docker stop presentation-ai-postgres
docker rm presentation-ai-postgres
```

### Полный сброс данных (удаление томов)

```bash
docker stop presentation-ai-postgres
docker rm presentation-ai-postgres
docker volume rm presentation-ai_postgres_data
```
