# AI Presentation Generator
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Plate JS](https://img.shields.io/badge/Plate.js-3B82F6?logoColor=white)](https://platejs.org)

⭐ **Помогите нам охватить больше разработчиков и расширить сообщество ALLWEONE. Поставьте звезду этому репозиторию!**

Альтернатива Gamma.app с открытым исходным кодом — генератор презентаций на основе ИИ, который создаёт красивые настраиваемые слайды за считанные минуты. Этот инструмент является частью более широкой платформы ALLWEONE AI.

## 🧰 Технологический стек

| Категория              | Технологии                                     |
| ---------------------- | ---------------------------------------------- |
| **Фреймворк**          | Next.js, React, TypeScript                     |
| **Стилизация**         | Tailwind CSS                                   |
| **База данных**        | PostgreSQL с Prisma ORM                        |
| **Интеграция ИИ**      | OpenAI API, Together AI, Ollama, LM Studio     |
| **Аутентификация**     | NextAuth.js                                    |
| **UI компоненты**      | Radix UI                                       |
| **Текстовый редактор** | Plate Editor                                   |
| **Загрузка файлов**    | UploadThing                                    |
| **Перетаскивание**     | DND Kit                                        |

## 🚀 Начало работы

### Требования

Перед началом убедитесь, что у вас установлено следующее:

- Node.js 18.x или выше
- npm, yarn или pnpm менеджер пакетов
- База данных PostgreSQL
- Google Client ID и Secret (для аутентификации)
- Ключи провайдеров в зависимости от функций, которые вы хотите использовать:
  - OpenAI API key (для облачной генерации текста)
  - Together AI API key (для генерации изображений)
  - FAL API key (для дополнительных потоков генерации изображений)
  - Tavily API key (для веб-поиска)
  - Unsplash access key (для стоковых изображений)

### Установка

1. **Установите зависимости**

```bash
pnpm install
```

3. **Настройте переменные окружения**

Создайте файл `.env` в корневой директории со следующими переменными:

```env
# База данных
DATABASE_URL="postgresql://username:password@localhost:5432/presentation_ai"

# Аутентификация
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Provider
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# AI провайдеры
OPENAI_API_KEY=""
TOGETHER_AI_API_KEY=""
FAL_API_KEY=""

# Сервис загрузки файлов
UPLOADTHING_TOKEN=""

# Дополнительные провайдеры поиска и медиа
UNSPLASH_ACCESS_KEY=""
TAVILY_API_KEY=""
```

> 💡 **Совет**: Скопируйте `.env.example` в `.env` и заполните вашими реальными значениями. Если вы планируете использовать локальные текстовые модели через Ollama или LM Studio, вы можете запускать генерацию текста без `OPENAI_API_KEY`.

### Настройка базы данных

1. **Инициализируйте базу данных**
```bash
pnpm db:push
```

2. **Запустите сервер разработки**
```bash
pnpm dev
```

3. **Откройте приложение**
Перейдите по адресу [http://localhost:3000](http://localhost:3000) в вашем браузере.

### Доступные скрипты
```bash
pnpm dev       # Запуск сервера разработки Next.js
pnpm build     # Сборка приложения
pnpm start     # Запуск продакшн сервера
pnpm db:push   # Отправка Prisma схемы в базу данных
pnpm db:studio # Открытие Prisma Studio
pnpm type      # Запуск проверки типов TypeScript
pnpm check     # Запуск проверок Biome
pnpm lint      # Запуск линтинга Biome
```

## 📁 Структура проекта

```text
presentation-ai/
├── prisma/                      # Prisma схема и данные для seed
├── src/
│   ├── ai/                     # ИИ агенты, инструменты и интеграции с сервером
│   ├── app/                    # Next.js app router страницы, API и серверные действия
│   ├── components/
│   │   ├── notebook/           # Панель управления, поток генерации, создание тем, UI записи
│   │   ├── presentation/       # Редактор презентаций, режим презентации, доступ, экспорт
│   │   ├── plate/              # Плагины и UI редактора Plate
│   │   ├── prose-mirror/       # Редактор структур
│   │   └── ui/                 # Общие UI примитивы
│   ├── hooks/                  # Пользовательские React хуки
│   ├── lib/                    # Модели, темы, помощники экспорта, утилиты
│   ├── provider/               # Провайдеры приложения
│   ├── server/                 # Аутентификация, БД и помощники авторизации доступа
│   ├── states/                 # Zustand хранилища состояний
│   ├── styles/                 # Глобальные стили
│   ├── env.js                  # Проверка переменных окружения
│   └── proxy.ts                # Next.js proxy
├── README.md
├── package.json
├── next.config.js
└── tsconfig.json
```