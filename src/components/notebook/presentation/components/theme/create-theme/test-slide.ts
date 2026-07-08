import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";

export const testSlides: PlateSlide[] = [
  {
    id: "theme-preview-card",
    width: "M",
    fontSize: "M",
    alignment: "center",
    content: [
      {
        type: "boxes",
        children: [
          {
            type: "box-item",
            children: [
              {
                type: "p",
                children: [{ text: "Привет 👋", bold: true }],
              },
              {
                type: "h1",
                children: [{ text: "Добро пожаловать" }],
              },
              {
                type: "p",
                children: [
                  {
                    text: "Создавайте красивые AI-презентации за минуты. Настройте тему с помощью шрифтов, цветов и макетов.",
                  },
                ],
              },
              {
                type: "p",
                children: [
                  {
                    text: "Ваш акцентный цвет будет использоваться для ссылок.",
                    color: "var(--presentation-accent)",
                    underline: true,
                  },
                  {
                    text: " Он также будет использоваться для макетов и кнопок.",
                  },
                ],
              },
              {
                type: "p",
                children: [
                  {
                    text: "Вот ваши кнопки:",
                    bold: true,
                  },
                ],
              },
              {
                type: "flex_box",
                justify: "start",
                children: [
                  {
                    type: "p",
                    children: [
                      {
                        type: "button",
                        variant: "filled",
                        children: [{ text: "Основная кнопка" }],
                      },
                    ],
                  },
                  {
                    type: "p",
                    children: [
                      {
                        type: "button",
                        variant: "outline",
                        children: [{ text: "Вторичная кнопка" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "theme-preview-fonts",
    width: "M",
    fontSize: "M",
    alignment: "start",
    content: [
      {
        type: "h1",
        children: [{ text: "Шрифты" }],
      },
      {
        type: "p",
        children: [
          {
            text: "Проект поставляется с предопределёнными размерами типографики, которые обеспечивают наилучшую читаемость. Вы можете выбрать гарнитуры для заголовков и основного текста.",
          },
        ],
      },
      {
        type: "p",
        children: [
          {
            text: "Вы можете выбрать однотонный цвет для текста. Для заголовков также можно выбрать градиентный цвет.",
          },
        ],
      },
      {
        type: "h1",
        children: [{ text: "Заголовочный шрифт" }],
      },
      {
        type: "h1",
        children: [{ text: "Заголовок 1" }],
      },
      {
        type: "h2",
        children: [{ text: "Заголовок 2" }],
      },
      {
        type: "h3",
        children: [{ text: "Заголовок 3" }],
      },
      {
        type: "h4",
        children: [{ text: "Заголовок 4" }],
      },
    ],
  },
  {
    id: "theme-preview-layouts",
    width: "M",
    fontSize: "M",
    alignment: "start",
    content: [
      {
        type: "h1",
        children: [{ text: "Умные макеты" }],
      },
      {
        type: "h3",
        children: [{ text: "Таймлайн" }],
      },
      {
        type: "timeline",
        orientation: "horizontal",
        alignment: "center",
        children: [
          {
            type: "timeline-item",
            children: [
              { type: "h3", children: [{ text: "Создание с помощью ИИ" }] },
              {
                type: "p",
                children: [
                  { text: "Создавайте презентации с помощью ИИ" },
                ],
              },
            ],
          },
          {
            type: "timeline-item",
            children: [
              { type: "h3", children: [{ text: "Пользовательские темы" }] },
              {
                type: "p",
                children: [
                  {
                    text: "Персонализируйте презентации своими шрифтами и цветами",
                  },
                ],
              },
            ],
          },
          {
            type: "timeline-item",
            children: [
              { type: "h3", children: [{ text: "Умные макеты" }] },
              {
                type: "p",
                children: [
                  {
                    text: "Используйте интеллектуальные макеты, адаптирующиеся под ваш контент",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "h3",
        children: [{ text: "Пирамида" }],
      },
      {
        type: "pyramid",
        children: [
          {
            type: "pyramid-item",
            children: [
              { type: "h3", children: [{ text: "Простота использования" }] },
              {
                type: "p",
                children: [{ text: "Интуитивный интерфейс для всех" }],
              },
            ],
          },
          {
            type: "pyramid-item",
            children: [
              { type: "h3", children: [{ text: "Полная настройка" }] },
              {
                type: "p",
                children: [
                  { text: "Настраивайте макеты и стили под свой бренд" },
                ],
              },
            ],
          },
          {
            type: "pyramid-item",
            children: [
              { type: "h3", children: [{ text: "Профессиональный результат" }] },
              {
                type: "p",
                children: [
                  {
                    text: "Создавайте впечатляющие презентации, которые поражают аудиторию",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
