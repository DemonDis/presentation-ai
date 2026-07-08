import {
  ArrowRight,
  BarChart3,
  CreditCard,
  Flower,
  GitCompare,
  Grid3x3,
  Hash,
  ImageIcon,
  List,
  ListOrdered,
  Quote,
  Shapes,
  Square,
  Triangle,
} from "lucide-react";
import { nanoid } from "nanoid";

import {
  AREA_CHART_ELEMENT,
  ARROW_LIST,
  ARROW_LIST_ITEM,
  BAR_CHART_ELEMENT,
  BEFORE_AFTER_GROUP,
  BEFORE_AFTER_SIDE,
  BOX_GROUP,
  BOX_ITEM,
  BOX_PLOT_CHART_ELEMENT,
  BUBBLE_CHART_ELEMENT,
  BULLET_GROUP,
  BULLET_ITEM,
  CANDLESTICK_CHART_ELEMENT,
  CHORD_CHART_ELEMENT,
  CIRCULAR_GRID_GROUP,
  CIRCULAR_GRID_ITEM,
  COLUMN_GROUP,
  COLUMN_ITEM,
  COMPARE_GROUP,
  COMPARE_SIDE,
  COMPOSED_CHART_ELEMENT,
  CONE_FUNNEL_CHART_ELEMENT,
  CONNECTED_CIRCLES_GROUP,
  CONNECTED_CIRCLES_ITEM,
  CONS_ITEM,
  CYCLE_GROUP,
  CYCLE_ITEM,
  FUNNEL_CHART_ELEMENT,
  getDefaultChartDataForType,
  HEATMAP_CHART_ELEMENT,
  HISTOGRAM_CHART_ELEMENT,
  ICON_LIST,
  ICON_LIST_ITEM,
  LINE_CHART_ELEMENT,
  LINEAR_GAUGE_ELEMENT,
  NIGHTINGALE_CHART_ELEMENT,
  OHLC_CHART_ELEMENT,
  PIE_CHART_ELEMENT,
  PRESENTATION_TITLE_ELEMENT,
  PROS_CONS_GROUP,
  PROS_ITEM,
  PYRAMID_CHART_ELEMENT,
  PYRAMID_GROUP,
  PYRAMID_ITEM,
  QUOTE_ELEMENT,
  RADAR_CHART_ELEMENT,
  RADIAL_BAR_CHART_ELEMENT,
  RADIAL_COLUMN_CHART_ELEMENT,
  RADIAL_GAUGE_ELEMENT,
  RANGE_AREA_CHART_ELEMENT,
  RANGE_BAR_CHART_ELEMENT,
  SANKEY_CHART_ELEMENT,
  SCATTER_CHART_ELEMENT,
  SEQUENCE_ARROW_GROUP,
  SEQUENCE_ARROW_ITEM,
  SLOPE_GROUP,
  SLOPE_ITEM,
  SNAKE_GROUP,
  SNAKE_ITEM,
  STAIR_ITEM,
  STAIRCASE_GROUP,
  STATS_GROUP,
  STATS_ITEM,
  STEPS_GROUP,
  STEPS_ITEM,
  SUNBURST_CHART_ELEMENT,
  TIMELINE_GROUP,
  TIMELINE_ITEM,
  TREEMAP_CHART_ELEMENT,
  WATERFALL_CHART_ELEMENT,
} from "../editor/lib";
import { type PlateSlide } from "./parser";
import * as Previews from "./template-previews";

export interface TemplateCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface TemplateDefinition {
  id: string;
  legacyIds?: string[];
  name: string;
  categoryId: string;
  preview: React.ReactNode;
  template: Omit<PlateSlide, "id">;
}

export function getTemplateSelectionIds(
  template: TemplateDefinition,
): string[] {
  return [template.id, ...(template.legacyIds ?? [])];
}

export function isTemplateSelected(
  selectedTemplateIds: readonly string[],
  template: TemplateDefinition,
): boolean {
  const templateIds = new Set(getTemplateSelectionIds(template));

  return selectedTemplateIds.some((templateId) => templateIds.has(templateId));
}

export function removeTemplateSelection(
  selectedTemplateIds: readonly string[],
  template: TemplateDefinition,
): string[] {
  const templateIds = new Set(getTemplateSelectionIds(template));

  return selectedTemplateIds.filter(
    (templateId) => !templateIds.has(templateId),
  );
}

const createBaseContent = (
  title: string = "Главная мысль",
  desc: string = "Одно краткое предложение, поясняющее суть.",
) => [
  { type: "h2", id: nanoid(), children: [{ text: title }] },
  {
    type: "p",
    id: nanoid(),
    children: [{ text: desc }],
  },
];

const createTitleDescriptionContent = (
  title: string = "Заголовок",
  desc: string = "Краткое описание, поясняющее основную мысль.",
) => [
  {
    type: PRESENTATION_TITLE_ELEMENT,
    id: nanoid(),
    variant: "title",
    children: [{ text: title }],
  },
  {
    type: "p",
    id: nanoid(),
    children: [{ text: desc }],
  },
];

const createTextImageColumnContent = ({
  imageFirst,
}: {
  imageFirst: boolean;
}) => {
  const textColumn = {
    type: COLUMN_ITEM,
    id: nanoid(),
      children: createTitleDescriptionContent(
        "Заголовок",
        "Текст описания находится здесь.",
      ),
  };
  const imageColumn = {
    type: COLUMN_ITEM,
    id: nanoid(),
    children: [
      {
        type: "img",
        query: "релевантная визуализация темы",
        id: nanoid(),
        children: [{ text: "" }],
      },
    ],
  };

  return [
    {
      type: COLUMN_GROUP,
      id: nanoid(),
      layout: [1, 1],
      children: imageFirst
        ? [imageColumn, textColumn]
        : [textColumn, imageColumn],
    },
  ];
};

const createListContent = ({
  type = "basic",
  items = 4,
}: {
  type?: "basic" | "numbered" | "arrow";
  items?: number;
}) => [
  { type: "h2", id: nanoid(), children: [{ text: "Заголовок списка" }] },
  {
    type: BULLET_GROUP,
    id: nanoid(),
    bulletType: type, // Default to basic
    children: Array.from({ length: items }).map((_, index) => ({
      type: BULLET_ITEM,
      id: nanoid(),
      children: createDiagramTextChildren(
        `Пункт ${index + 1}`,
        "Краткое доказательство или следствие.",
      ),
    })),
  },
];

const createBoxContent = (
  variant:
    | "solid"
    | "outline"
    | "icon"
    | "sideline"
    | "side-label"
    | "top-label"
    | "top-circle"
    | "joined"
    | "joined-icon"
    | "leaf"
    | "labeled"
    | "alternating",
  items: number = 4,
) => [
  { type: "h2", id: nanoid(), children: [{ text: "Блоки" }] },
  {
    type: BOX_GROUP,
    id: nanoid(),
    boxType: variant,
    columnSize: "md",
    children: Array.from({ length: items }).map((_, index) => ({
      type: BOX_ITEM,
      id: nanoid(),
      icon: variant.includes("icon") ? "idea" : undefined,
      children: createDiagramTextChildren(
        `Карточка ${index + 1}`,
        "Компактная дополнительная информация.",
      ),
    })),
  },
];
const createChartContent = (type: string, title: string, variant?: string) => {
  return [
    { type: "h2", id: nanoid(), children: [{ text: title }] },
    {
      type,
      id: nanoid(),
      data: getDefaultChartDataForType(type),
      variant,
      children: [{ text: "" }], // Void element
    },
  ];
};

const createCycleContent = (items: number = 4) => [
  { type: "h2", id: nanoid(), children: [{ text: "Циклический процесс" }] },
  {
    type: CYCLE_GROUP,
    id: nanoid(),
    children: Array.from({ length: items }).map(() => ({
      type: CYCLE_ITEM,
      id: nanoid(),
      children: [{ text: "Шаг" }],
    })),
  },
];

const createDiagramTextChildren = (title: string, desc: string) => [
  { type: "h3", id: nanoid(), children: [{ text: title }] },
  { type: "p", id: nanoid(), children: [{ text: desc }] },
];

const createSlopeContent = () => [
  { type: "h2", id: nanoid(), children: [{ text: "Путь роста" }] },
  {
    type: SLOPE_GROUP,
    id: nanoid(),
    children: ["Идея", "Прототип", "Валидация", "Масштаб"].map((title) => ({
      type: SLOPE_ITEM,
      id: nanoid(),
      icon: "idea",
      children: [{ type: "h4", id: nanoid(), children: [{ text: title }] }],
    })),
  },
];

const createConnectedCirclesContent = () => [
  { type: "h2", id: nanoid(), children: [{ text: "Связанные приоритеты" }] },
  {
    type: CONNECTED_CIRCLES_GROUP,
    id: nanoid(),
    children: (
      [
        ["План", "Определите цели и согласуйте заинтересованные стороны."],
        ["Сборка", "Разрабатывайте функции, итерируя."],
        ["Валидация", "Проверяйте гипотезы и уточняйте направление."],
        ["Масштаб", "Расширяйте охват, сохраняя качество."],
      ] satisfies ReadonlyArray<readonly [string, string]>
    ).map(([title, desc]) => ({
      type: CONNECTED_CIRCLES_ITEM,
      id: nanoid(),
      children: createDiagramTextChildren(title, desc),
    })),
  },
];

const createCircularGridContent = () => [
  { type: "h2", id: nanoid(), children: [{ text: "Умная диаграмма" }] },
  {
    type: CIRCULAR_GRID_GROUP,
    id: nanoid(),
    centerText: "Умная диаграмма",
    children: (
      [
        ["Цель", "Определите главную задачу."],
        ["Сигналы", "Собирайте важные входные данные."],
        ["Действия", "Превращайте инсайты в работу."],
        ["Метрики", "Отслеживайте изменения во времени."],
        ["Риски", "Выявляйте допущения на раннем этапе."],
        ["Обучение", "Используйте результаты в следующем цикле."],
      ] satisfies ReadonlyArray<readonly [string, string]>
    ).map(([title, desc]) => ({
      type: CIRCULAR_GRID_ITEM,
      id: nanoid(),
      children: createDiagramTextChildren(title, desc),
    })),
  },
];

const createSnakeContent = () => [
  { type: "h2", id: nanoid(), children: [{ text: "Поток доставки" }] },
  {
    type: SNAKE_GROUP,
    id: nanoid(),
    children: (
      [
        ["Оценка", "Оцените потребности и текущее состояние."],
        ["План", "Определите стратегию и дорожную карту."],
        ["Сборка", "Разрабатывайте решения и интеграции."],
        ["Валидация", "Тестируйте, итерируйте и улучшайте."],
        ["Масштаб", "Разверните масштабно и оптимизируйте."],
      ] satisfies ReadonlyArray<readonly [string, string]>
    ).map(([title, desc]) => ({
      type: SNAKE_ITEM,
      id: nanoid(),
      children: createDiagramTextChildren(title, desc),
    })),
  },
];

const createStaircaseContent = (items: number = 4) => [
  { type: "h2", id: nanoid(), children: [{ text: "Лестница" }] },
  {
    type: STAIRCASE_GROUP,
    id: nanoid(),
    variant: "inside",
    children: Array.from({ length: items }).map((_, index) => ({
      type: STAIR_ITEM,
      id: nanoid(),
      children: createDiagramTextChildren(
        `Уровень ${index + 1}`,
        "Маркер прогресса.",
      ),
    })),
  },
];

const createPyramidContent = (variant: "pyramid" | "funnel") => [
  {
    type: "h2",
    id: nanoid(),
    children: [{ text: variant === "pyramid" ? "Пирамида" : "Воронка" }],
  },
  {
    type: PYRAMID_GROUP,
    id: nanoid(),
    isFunnel: variant === "funnel",
    variant: "inside",
    children: Array.from({ length: 4 }).map((_, index) => ({
      type: PYRAMID_ITEM,
      id: nanoid(),
      children: createDiagramTextChildren(
        variant === "pyramid" ? `Слой ${index + 1}` : `Этап ${index + 1}`,
        "Краткая подпись.",
      ),
    })),
  },
];

const createTimelineContent = (
  variant: "timeline" | "arrow" | "pill" | "parallelogram" | "arrow-vertical",
  items: number = 4,
) => {
  let groupType = TIMELINE_GROUP;
  let itemType = TIMELINE_ITEM;
  let extraProps = {};

  if (variant === "arrow") {
    groupType = ARROW_LIST;
    itemType = ARROW_LIST_ITEM;
    extraProps = { svgType: "arrow" };
  } else if (variant === "pill") {
    groupType = ARROW_LIST;
    itemType = ARROW_LIST_ITEM;
    extraProps = { svgType: "pill" };
  } else if (variant === "parallelogram") {
    groupType = ARROW_LIST;
    itemType = ARROW_LIST_ITEM;
    extraProps = { svgType: "parallelogram" };
  } else if (variant === "arrow-vertical") {
    groupType = SEQUENCE_ARROW_GROUP;
    itemType = SEQUENCE_ARROW_ITEM;
  }

  return [
    { type: "h2", id: nanoid(), children: [{ text: "Таймлайн / Последовательность" }] },
    {
      type: groupType,
      id: nanoid(),
      ...extraProps,
      orientation: variant === "arrow-vertical" ? "vertical" : "horizontal",
      numbered: true,
      showLine: true,
      children: Array.from({ length: items }).map((_, index) => ({
        type: itemType,
        id: nanoid(),
        children: createDiagramTextChildren(
          `Шаг ${index + 1}`,
          "Результат этого этапа.",
        ),
      })),
    },
  ];
};

const createStatsContent = (
  variant:
    | "plain"
    | "circle"
    | "star"
    | "bar"
    | "dot-grid"
    | "dot-line"
    | "circle-bold",
  items: number = 3,
) => [
  { type: "h2", id: nanoid(), children: [{ text: "Статистика" }] },
  {
    type: STATS_GROUP,
    id: nanoid(),
    statsType: variant,
    columnSize: "md",
    children: Array.from({ length: items }).map((_, index) => ({
      type: STATS_ITEM,
      id: nanoid(),
      stat: `${72 + index * 8}%`,
      children: [
        {
          type: "p",
          id: nanoid(),
          children: [{ text: `Метрика ${index + 1}` }],
        },
      ],
    })),
  },
];

const createColumnContent = (
  cols: number = 2,
  options: { includeImages?: boolean } = {},
) => [
  { type: "h2", id: nanoid(), children: [{ text: "Колонки" }] },
  {
    type: COLUMN_GROUP,
    id: nanoid(),
    columnSize: "md",
    layout: Array(cols).fill(1),
    children: Array.from({ length: cols }).map((_, index) => ({
      type: COLUMN_ITEM,
      id: nanoid(),
      children: [
        ...(options.includeImages
          ? [
              {
                type: "img",
                query: `изображение темы ${index + 1}`,
                id: nanoid(),
                children: [{ text: "" }],
              },
            ]
          : []),
        {
          type: "h3",
          id: nanoid(),
          children: [{ text: `Колонка ${index + 1}` }],
        },
        {
          type: "p",
          id: nanoid(),
          children: [{ text: "Параллельная дополнительная информация." }],
        },
      ],
    })),
  },
];

const createQuoteContent = (
  variant: "large" | "sidequote-icon" | "sidequote",
) => [
  {
    type: QUOTE_ELEMENT,
    id: nanoid(),
    variant,
    author: "Имя автора",
    children: [
      {
        text: "Это вдохновляющая цитата, передающая суть вашего сообщения.",
      },
    ],
  },
];

const createCompareContent = (variant: "compare" | "before-after") => {
  const groupType = variant === "compare" ? COMPARE_GROUP : BEFORE_AFTER_GROUP;
  const sideType = variant === "compare" ? COMPARE_SIDE : BEFORE_AFTER_SIDE;
  const labels =
    variant === "compare"
      ? (["Вариант A", "Вариант B"] as const)
      : (["До", "После"] as const);

  return [
    { type: "h2", id: nanoid(), children: [{ text: "Сравнение" }] },
    {
      type: groupType,
      id: nanoid(),
      children: labels.map((label) => ({
        type: sideType,
        id: nanoid(),
        children: [
          { type: "h3", id: nanoid(), children: [{ text: label }] },
          { type: "p", id: nanoid(), children: [{ text: "Ключевое различие." }] },
          {
            type: "p",
            id: nanoid(),
            children: [{ text: "Важное следствие." }],
          },
        ],
      })),
    },
  ];
};

const createProsConsContent = () => [
  { type: "h2", id: nanoid(), children: [{ text: "Компромиссы" }] },
  {
    type: PROS_CONS_GROUP,
    id: nanoid(),
    children: [
      {
        type: PROS_ITEM,
        id: nanoid(),
        children: [
          { type: "h3", id: nanoid(), children: [{ text: "Плюсы" }] },
          {
            type: "p",
            id: nanoid(),
            indent: 1,
            listStyleType: "disc",
            children: [{ text: "Положительное влияние." }],
          },
          {
            type: "p",
            id: nanoid(),
            indent: 1,
            listStyleType: "disc",
            children: [{ text: "Почему это помогает." }],
          },
        ],
      },
      {
        type: CONS_ITEM,
        id: nanoid(),
        children: [
          { type: "h3", id: nanoid(), children: [{ text: "Минусы" }] },
          {
            type: "p",
            id: nanoid(),
            indent: 1,
            listStyleType: "disc",
            children: [{ text: "Потенциальное ограничение." }],
          },
          {
            type: "p",
            id: nanoid(),
            indent: 1,
            listStyleType: "disc",
            children: [{ text: "За чем следить." }],
          },
        ],
      },
    ],
  },
];

const createIconListContent = () => [
  { type: "h2", id: nanoid(), children: [{ text: "Ключевые сигналы" }] },
  {
    type: ICON_LIST,
    id: nanoid(),
    orientation: "side",
    variant: "icon",
    children: (
      [
        ["analytics", "Сигнал один", "Что говорит нам сигнал."],
        ["shield", "Сигнал два", "Почему это важно."],
        ["growth", "Сигнал три", "Ожидаемый эффект."],
      ] satisfies ReadonlyArray<readonly [string, string, string]>
    ).map(([icon, title, desc]) => ({
      type: ICON_LIST_ITEM,
      id: nanoid(),
      icon,
      children: createDiagramTextChildren(title, desc),
    })),
  },
];

const createStepsContent = () => [
  { type: "h2", id: nanoid(), children: [{ text: "План действий" }] },
  {
    type: STEPS_GROUP,
    id: nanoid(),
    variant: "arrow",
    columnSize: "md",
    children: ["Открытие", "Сборка", "Запуск"].map((title, index) => ({
      type: STEPS_ITEM,
      id: nanoid(),
      icon: ["search", "settings", "growth"][index],
      children: createDiagramTextChildren(title, "Краткая информация о действии."),
    })),
  },
];

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: "basic", name: "Базовые", icon: <Grid3x3 className="size-4" /> },
  { id: "boxes", name: "Блоки", icon: <Square className="size-4" /> },
  { id: "bullets", name: "Маркеры", icon: <List className="size-4" /> },
  {
    id: "card-layouts",
    name: "Карточки",
    icon: <CreditCard className="size-4" />,
  },
  {
    id: "charts",
    name: "Графики и данные",
    icon: <BarChart3 className="size-4" />,
  },
  {
    id: "comparison",
    name: "Сравнение",
    icon: <GitCompare className="size-4" />,
  },
  { id: "circles", name: "Диаграммы", icon: <Flower className="size-4" /> },
  { id: "icons", name: "Иконки", icon: <Shapes className="size-4" /> },
  { id: "images", name: "Изображения", icon: <ImageIcon className="size-4" /> },
  { id: "numbers", name: "Числа", icon: <Hash className="size-4" /> },
  { id: "pyramids", name: "Пирамиды", icon: <Triangle className="size-4" /> },
  { id: "sequence", name: "Последовательность", icon: <ArrowRight className="size-4" /> },
  { id: "steps", name: "Шаги", icon: <ListOrdered className="size-4" /> },
  { id: "quotes", name: "Цитаты", icon: <Quote className="size-4" /> },
];

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  // Basic
  {
    id: "text-and-heading",
    legacyIds: ["text-boxes"],
    name: "Текст и заголовок",
    categoryId: "basic",
    preview: <Previews.TextAndHeadingPreview />,
    template: {
      layoutType: "vertical",
      content: createTitleDescriptionContent(
        "Заголовок",
        "Краткое описание представляет слайд и задаёт основную мысль.",
      ),
    },
  },
  {
    id: "text-and-image",
    name: "Текст и изображение",
    categoryId: "basic",
    preview: <Previews.TextAndImagePreview />,
    template: {
      content: createTextImageColumnContent({ imageFirst: false }),
    },
  },
  {
    id: "image-and-text",
    name: "Изображение и текст",
    categoryId: "basic",
    preview: <Previews.ImageAndTextPreview />,
    template: {
      content: createTextImageColumnContent({ imageFirst: true }),
    },
  },
  {
    id: "two-columns",
    name: "Две колонки",
    categoryId: "comparison",
    preview: <Previews.TwoColumnsPreview />,
    template: {
      content: [
        {
          type: COLUMN_GROUP,
          id: nanoid(),
          layout: [1, 1],
          children: [
            {
              type: COLUMN_ITEM,
              id: nanoid(),
              children: [
                {
                  type: "h3",
                  id: nanoid(),
                  children: [{ text: "Первая колонка" }],
                },
                {
                  type: "p",
                  id: nanoid(),
                  children: [{ text: "Текст описания находится здесь." }],
                },
              ],
            },
            {
              type: COLUMN_ITEM,
              id: nanoid(),
              children: [
                {
                  type: "h3",
                  id: nanoid(),
                  children: [{ text: "Вторая колонка" }],
                },
                {
                  type: "p",
                  id: nanoid(),
                  children: [{ text: "Текст описания находится здесь." }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "two-columns-with-heading",
    name: "Две колонки с заголовком",
    categoryId: "comparison",
    preview: <Previews.TwoColumnsWithHeadingPreview />,
    template: {
      content: [
        {
          type: "h2",
          id: nanoid(),
          children: [{ text: "Две колонки с заголовком" }],
        },
        {
          type: COLUMN_GROUP,
          id: nanoid(),
          layout: [1, 1],
          children: [
            {
              type: COLUMN_ITEM,
              id: nanoid(),
              children: [
                {
                  type: "h3",
                  id: nanoid(),
                  children: [{ text: "Первая колонка" }],
                },
                {
                  type: "p",
                  id: nanoid(),
                  children: [{ text: "Текст описания находится здесь." }],
                },
              ],
            },
            {
              type: COLUMN_ITEM,
              id: nanoid(),
              children: [
                { type: "h3", id: nanoid(), children: [{ text: "Заголовок" }] },
                {
                  type: "p",
                  id: nanoid(),
                  children: [{ text: "Текст описания находится здесь." }],
                },
              ],
            },
          ],
        },
      ],
    },
  },

  // Boxes
  {
    id: "solid-boxes",
    name: "Заливные блоки",
    categoryId: "boxes",
    preview: <Previews.SolidBoxesPreview />,
    template: { content: createBoxContent("solid") },
  },
  {
    id: "outline-boxes",
    name: "Контурные блоки",
    categoryId: "boxes",
    preview: <Previews.OutlineBoxesPreview />,
    template: { content: createBoxContent("outline") },
  },
  {
    id: "side-line-boxes",
    name: "Блоки с боковой линией",
    categoryId: "boxes",
    preview: <Previews.SideLineBoxesPreview />,
    template: { content: createBoxContent("sideline") },
  },
  {
    id: "side-line-text",
    name: "Текст с боковой линией",
    categoryId: "boxes",
    preview: <Previews.SideLineTextPreview />,
    template: { content: createBoxContent("side-label", 3) },
  },
  {
    id: "top-line-text",
    name: "Текст с верхней линией",
    categoryId: "boxes",
    preview: <Previews.TopLineTextPreview />,
    template: { content: createBoxContent("top-label", 3) },
  },
  {
    id: "top-circle-boxes",
    name: "Блоки с кругом сверху",
    categoryId: "boxes",
    preview: <Previews.TopCircleBoxesPreview />,
    template: { content: createBoxContent("top-circle", 3) },
  },
  {
    id: "joined-boxes",
    name: "Соединённые блоки",
    categoryId: "boxes",
    preview: <Previews.JoinedBoxesPreview />,
    template: { content: createBoxContent("joined") },
  },
  {
    id: "boxes-with-icons",
    name: "Соединённые блоки с иконками",
    categoryId: "boxes",
    preview: <Previews.BoxesWithIconsPreview />,
    template: { content: createBoxContent("joined-icon", 3) },
  },
  {
    id: "leaf-boxes",
    name: "Блоки-листья",
    categoryId: "boxes",
    preview: <Previews.LeafBoxesPreview />,
    template: { content: createBoxContent("leaf") },
  },
  {
    id: "labeled-boxes",
    name: "Блоки с подписями",
    categoryId: "boxes",
    preview: <Previews.LabeledBoxesPreview />,
    template: { content: createBoxContent("labeled", 3) },
  },
  {
    id: "alternating-boxes",
    name: "Чередующиеся блоки",
    categoryId: "boxes",
    preview: <Previews.AlternatingBoxesPreview />,
    template: { content: createBoxContent("alternating", 3) },
  },

  // Bullets
  {
    id: "numbered-bullets",
    name: "Нумерованный список",
    categoryId: "bullets",
    preview: <Previews.LargeBulletsPreview />,
    template: { content: createListContent({ type: "numbered" }) },
  },
  {
    id: "small-bullets",
    name: "Маркированный список",
    categoryId: "bullets",
    preview: <Previews.SmallBulletsPreview />,
    template: { content: createListContent({ type: "basic" }) },
  },
  {
    id: "arrow-bullets",
    name: "Список со стрелками",
    categoryId: "bullets",
    preview: <Previews.ArrowBulletsPreview />,
    template: { content: createListContent({ type: "arrow" }) },
  },

  // Card Layouts
  {
    id: "accent-left-layout",
    name: "Акцент слева",
    categoryId: "card-layouts",
    preview: <Previews.AccentLeftPreview />,
    template: {
      layoutType: "left",
      content: createBaseContent(),
      rootImage: {
        query: "релевантная вертикальная акцентная визуализация",
        layoutType: "left",
      },
    },
  },
  {
    id: "accent-right-layout",
    name: "Акцент справа",
    categoryId: "card-layouts",
    preview: <Previews.AccentRightPreview />,
    template: {
      content: createBaseContent(),
      layoutType: "right",
      rootImage: {
        query: "релевантная вертикальная акцентная визуализация",
        layoutType: "right",
      },
    },
  },
  {
    id: "accent-top-layout",
    name: "Акцент сверху",
    categoryId: "card-layouts",
    preview: <Previews.AccentTopPreview />,
    template: {
      content: createBaseContent(),
      layoutType: "vertical",
      rootImage: {
        query: "релевантная широкая верхняя визуализация",
        layoutType: "vertical",
      },
    },
  },
  {
    id: "accent-right-fit",
    name: "Акцент справа (вписать)",
    categoryId: "card-layouts",
    preview: <Previews.AccentRightFitPreview />,
    template: {
      content: createBaseContent(),
      layoutType: "right",
      rootImage: {
        query: "релевантная вписанная визуализация",
        layoutType: "right",
        cropSettings: {
          objectFit: "contain",
          objectPosition: {
            x: 50,
            y: 50,
          },
        },
      },
    },
  },
  {
    id: "accent-left-fit",
    name: "Акцент слева (вписать)",
    categoryId: "card-layouts",
    preview: <Previews.AccentLeftFitPreview />,
    template: {
      content: createBaseContent(),
      layoutType: "left",
      rootImage: {
        query: "релевантная вписанная визуализация",
        layoutType: "left",
        cropSettings: {
          objectFit: "contain",
          objectPosition: {
            x: 50,
            y: 50,
          },
        },
      },
    },
  },
  {
    id: "accent-background",
    name: "Акцент на фоне",
    categoryId: "card-layouts",
    preview: <Previews.AccentBackgroundPreview />,
    template: {
      content: createBaseContent(),
      layoutType: "background",
      rootImage: {
        query: "релевантный фон на весь слайд",
        layoutType: "background",
      },
    },
  },

  {
    id: "bar-chart",
    name: "Столбчатая диаграмма",
    categoryId: "charts",
    preview: <Previews.BarChartPreview />,
    template: {
      content: createChartContent(BAR_CHART_ELEMENT, "Столбчатая диаграмма", "horizontal"),
    },
  },
  {
    id: "line-chart",
    name: "Линейный график",
    categoryId: "charts",
    preview: <Previews.LineChartPreview />,
    template: {
      content: createChartContent(LINE_CHART_ELEMENT, "Линейный график"),
    },
  },
  {
    id: "pie-chart",
    name: "Круговая диаграмма",
    categoryId: "charts",
    preview: <Previews.PieChartPreview />,
    template: { content: createChartContent(PIE_CHART_ELEMENT, "Круговая диаграмма") },
  },
  {
    id: "donut-chart",
    name: "Кольцевая диаграмма",
    categoryId: "charts",
    preview: <Previews.DonutChartPreview />,
    template: {
      content: createChartContent(PIE_CHART_ELEMENT, "Кольцевая диаграмма", "donut"),
    },
  },
  // New chart templates
  {
    id: "area-chart",
    name: "Диаграмма с областями",
    categoryId: "charts",
    preview: <Previews.AreaChartPreview />,
    template: { content: createChartContent(AREA_CHART_ELEMENT, "Диаграмма с областями") },
  },
  {
    id: "scatter-chart",
    name: "Точечная диаграмма",
    categoryId: "charts",
    preview: <Previews.ScatterChartPreview />,
    template: {
      content: createChartContent(SCATTER_CHART_ELEMENT, "Точечная диаграмма"),
    },
  },
  {
    id: "bubble-chart",
    name: "Пузырьковая диаграмма",
    categoryId: "charts",
    preview: <Previews.BubbleChartPreview />,
    template: {
      content: createChartContent(BUBBLE_CHART_ELEMENT, "Пузырьковая диаграмма"),
    },
  },
  {
    id: "histogram-chart",
    name: "Гистограмма",
    categoryId: "charts",
    preview: <Previews.HistogramChartPreview />,
    template: {
      content: createChartContent(HISTOGRAM_CHART_ELEMENT, "Гистограмма"),
    },
  },
  {
    id: "range-bar-chart",
    name: "Диапазонная столбчатая",
    categoryId: "charts",
    preview: <Previews.RangeBarChartPreview />,
    template: {
      content: createChartContent(RANGE_BAR_CHART_ELEMENT, "Диапазонная столбчатая"),
    },
  },
  {
    id: "range-area-chart",
    name: "Диапазонная с областями",
    categoryId: "charts",
    preview: <Previews.RangeAreaChartPreview />,
    template: {
      content: createChartContent(RANGE_AREA_CHART_ELEMENT, "Диапазонная с областями"),
    },
  },
  {
    id: "waterfall-chart",
    name: "Водопад",
    categoryId: "charts",
    preview: <Previews.WaterfallChartPreview />,
    template: {
      content: createChartContent(WATERFALL_CHART_ELEMENT, "Водопад"),
    },
  },
  {
    id: "box-plot-chart",
    name: "Ящик с усами",
    categoryId: "charts",
    preview: <Previews.BoxPlotChartPreview />,
    template: {
      content: createChartContent(BOX_PLOT_CHART_ELEMENT, "Ящик с усами"),
    },
  },
  {
    id: "candlestick-chart",
    name: "Японская свеча",
    categoryId: "charts",
    preview: <Previews.CandlestickChartPreview />,
    template: {
      content: createChartContent(
        CANDLESTICK_CHART_ELEMENT,
        "Японская свеча",
      ),
    },
  },
  {
    id: "ohlc-chart",
    name: "OHLC",
    categoryId: "charts",
    preview: <Previews.OHLCChartPreview />,
    template: {
      content: createChartContent(OHLC_CHART_ELEMENT, "OHLC"),
    },
  },
  {
    id: "radar-line-chart",
    name: "Радар линейный",
    categoryId: "charts",
    preview: <Previews.RadarLineChartPreview />,
    template: {
      content: createChartContent(RADAR_CHART_ELEMENT, "Радар"),
    },
  },
  {
    id: "radar-area-chart",
    name: "Радар с областями",
    categoryId: "charts",
    preview: <Previews.RadarAreaChartPreview />,
    template: {
      content: createChartContent(
        RADAR_CHART_ELEMENT,
        "Радар",
        "outline",
      ),
    },
  },
  {
    id: "nightingale-chart",
    name: "Соловей",
    categoryId: "charts",
    preview: <Previews.NightingaleChartPreview />,
    template: {
      content: createChartContent(
        NIGHTINGALE_CHART_ELEMENT,
        "Соловей",
      ),
    },
  },
  {
    id: "radial-column-chart",
    name: "Радиальная столбчатая",
    categoryId: "charts",
    preview: <Previews.RadialColumnChartPreview />,
    template: {
      content: createChartContent(
        RADIAL_COLUMN_CHART_ELEMENT,
        "Радиальная столбчатая",
      ),
    },
  },
  {
    id: "radial-bar-chart",
    name: "Радиальная линейчатая",
    categoryId: "charts",
    preview: <Previews.RadialBarChartPreview />,
    template: {
      content: createChartContent(RADIAL_BAR_CHART_ELEMENT, "Радиальная линейчатая"),
    },
  },
  {
    id: "sunburst-chart",
    name: "Солнечные лучи",
    categoryId: "charts",
    preview: <Previews.SunburstChartPreview />,
    template: {
      content: createChartContent(SUNBURST_CHART_ELEMENT, "Солнечные лучи"),
    },
  },
  {
    id: "treemap-chart",
    name: "Древовидная карта",
    categoryId: "charts",
    preview: <Previews.TreemapChartPreview />,
    template: {
      content: createChartContent(TREEMAP_CHART_ELEMENT, "Древовидная карта"),
    },
  },
  {
    id: "heatmap-chart",
    name: "Тепловая карта",
    categoryId: "charts",
    preview: <Previews.HeatmapChartPreview />,
    template: {
      content: createChartContent(HEATMAP_CHART_ELEMENT, "Тепловая карта"),
    },
  },
  {
    id: "sankey-chart",
    name: "Санкей",
    categoryId: "charts",
    preview: <Previews.SankeyChartPreview />,
    template: {
      content: createChartContent(SANKEY_CHART_ELEMENT, "Санкей"),
    },
  },
  {
    id: "chord-chart",
    name: "Хорда",
    categoryId: "charts",
    preview: <Previews.ChordChartPreview />,
    template: {
      content: createChartContent(CHORD_CHART_ELEMENT, "Хорда"),
    },
  },
  {
    id: "funnel-chart",
    name: "Воронка",
    categoryId: "charts",
    preview: <Previews.FunnelChartPreview />,
    template: {
      content: createChartContent(FUNNEL_CHART_ELEMENT, "Воронка"),
    },
  },
  {
    id: "cone-funnel-chart",
    name: "Коническая воронка",
    categoryId: "charts",
    preview: <Previews.ConeFunnelChartPreview />,
    template: {
      content: createChartContent(
        CONE_FUNNEL_CHART_ELEMENT,
        "Коническая воронка",
      ),
    },
  },
  {
    id: "pyramid-chart",
    name: "Пирамида",
    categoryId: "charts",
    preview: <Previews.PyramidChartPreview2 />,
    template: {
      content: createChartContent(PYRAMID_CHART_ELEMENT, "Диаграмма-пирамида"),
    },
  },
  {
    id: "radial-gauge-chart",
    name: "Радиальный датчик",
    categoryId: "charts",
    preview: <Previews.RadialGaugeChartPreview />,
    template: {
      content: createChartContent(RADIAL_GAUGE_ELEMENT, "Радиальный датчик"),
    },
  },
  {
    id: "linear-gauge-chart",
    name: "Линейный датчик",
    categoryId: "charts",
    preview: <Previews.LinearGaugeChartPreview />,
    template: {
      content: createChartContent(LINEAR_GAUGE_ELEMENT, "Линейный датчик"),
    },
  },
  {
    id: "combination-chart",
    name: "Комбинированная",
    categoryId: "charts",
    preview: <Previews.CombinationChartPreview />,
    template: {
      content: createChartContent(COMPOSED_CHART_ELEMENT, "Комбинированная"),
    },
  },

  {
    id: "comparison",
    name: "Сравнение",
    categoryId: "comparison",
    preview: <Previews.TwoColumnsPreview />,
    template: { content: createCompareContent("compare") },
  },
  {
    id: "before-after",
    name: "До и после",
    categoryId: "comparison",
    preview: <Previews.TwoColumnsWithHeadingPreview />,
    template: { content: createCompareContent("before-after") },
  },
  {
    id: "pros-cons",
    name: "Плюсы и минусы",
    categoryId: "comparison",
    preview: <Previews.SideLineBoxesPreview />,
    template: { content: createProsConsContent() },
  },

  {
    id: "cycle",
    name: "Цикл",
    categoryId: "circles",
    preview: <Previews.CyclePreview />,
    template: { content: createCycleContent(4) },
  },
  {
    id: "connected-circles",
    name: "Связанные круги",
    categoryId: "circles",
    preview: <Previews.ConnectedCirclesDiagramPreview />,
    template: { content: createConnectedCirclesContent() },
  },
  {
    id: "circular-grid",
    name: "Круговая сетка",
    categoryId: "circles",
    preview: <Previews.CircularGridDiagramPreview />,
    template: { content: createCircularGridContent() },
  },

  {
    id: "icon-list",
    name: "Список с иконками",
    categoryId: "icons",
    preview: <Previews.BoxesWithIconsPreview />,
    template: { content: createIconListContent() },
  },

  {
    id: "two-image-columns",
    name: "2 колонки с изображениями",
    categoryId: "images",
    preview: <Previews.TwoImageColumnsPreview />,
    template: { content: createColumnContent(2, { includeImages: true }) },
  },
  {
    id: "three-image-columns",
    name: "3 колонки с изображениями",
    categoryId: "images",
    preview: <Previews.ThreeImageColumnsCardPreview />,
    template: { content: createColumnContent(3, { includeImages: true }) },
  },
  {
    id: "four-image-columns",
    name: "4 колонки с изображениями",
    categoryId: "images",
    preview: <Previews.FourImageColumnsPreview />,
    template: { content: createColumnContent(4, { includeImages: true }) },
  },
  {
    id: "images-with-text",
    name: "Изображения с текстом",
    categoryId: "images",
    preview: <Previews.ImagesWithTextPreview />,
    template: { content: createColumnContent(3, { includeImages: true }) },
  },
  {
    id: "image-gallery",
    name: "Галерея изображений",
    categoryId: "images",
    preview: <Previews.ImageGalleryPreview />,
    template: { content: createColumnContent(3, { includeImages: true }) },
  },
  {
    id: "team-photos",
    name: "Фото команды",
    categoryId: "images",
    preview: <Previews.TeamPhotosPreview />,
    template: { content: createColumnContent(4, { includeImages: true }) },
  },

  {
    id: "stats",
    name: "Статистика",
    categoryId: "numbers",
    preview: <Previews.StatsPreview />,
    template: { content: createStatsContent("plain") },
  },
  {
    id: "circle-stats",
    name: "Статистика в кругах",
    categoryId: "numbers",
    preview: <Previews.CircleStatsPreview />,
    template: { content: createStatsContent("circle") },
  },
  {
    id: "bar-stats",
    name: "Статистика в столбцах",
    categoryId: "numbers",
    preview: <Previews.BarStatsPreview />,
    template: { content: createStatsContent("bar") },
  },
  {
    id: "star-rating",
    name: "Звёздный рейтинг",
    categoryId: "numbers",
    preview: <Previews.StarRatingPreview />,
    template: { content: createStatsContent("star") },
  },
  {
    id: "dot-grid-stats",
    name: "Статистика точками (сетка)",
    categoryId: "numbers",
    preview: <Previews.DotGridStatsPreview />,
    template: { content: createStatsContent("dot-grid") },
  },
  {
    id: "dot-line-stats",
    name: "Статистика точками (линия)",
    categoryId: "numbers",
    preview: <Previews.DotLineStatsPreview />,
    template: { content: createStatsContent("dot-line") },
  },
  {
    id: "circle-stats-bold",
    name: "Статистика в кругах (жирный)",
    categoryId: "numbers",
    preview: <Previews.CircleStatsMiddleBoldPreview />,
    template: { content: createStatsContent("circle-bold") },
  },

  // Pyramids

  {
    id: "pyramid",
    name: "Пирамида",
    categoryId: "pyramids",
    preview: <Previews.PyramidPreview />,
    template: { content: createPyramidContent("pyramid") },
  },
  {
    id: "vertical-funnel",
    name: "Вертикальная воронка",
    categoryId: "pyramids",
    preview: <Previews.VerticalFunnelPreview />,
    template: { content: createPyramidContent("funnel") },
  },

  // Sequence
  {
    id: "timeline-sequence",
    name: "Таймлайн",
    categoryId: "sequence",
    preview: <Previews.TimelineSequencePreview />,
    template: { content: createTimelineContent("timeline") },
  },
  {
    id: "minimal-timeline",
    name: "Минимальный таймлайн",
    categoryId: "sequence",
    preview: <Previews.MinimalTimelinePreview />,
    template: { content: createTimelineContent("timeline") },
  },
  {
    id: "minimal-timeline-boxes",
    name: "Минимальный таймлайн с блоками",
    categoryId: "sequence",
    preview: <Previews.MinimalTimelineWithBoxesPreview />,
    template: { content: createTimelineContent("timeline") },
  },
  {
    id: "arrows-sequence",
    name: "Стрелки",
    categoryId: "sequence",
    preview: <Previews.ArrowListPreview />,
    template: { content: createTimelineContent("arrow") },
  },
  {
    id: "pills-sequence",
    name: "Таблетки",
    categoryId: "sequence",
    preview: <Previews.PillsSequencePreview />,
    template: { content: createTimelineContent("pill") },
  },
  {
    id: "slanted-labels",
    name: "Наклонные подписи",
    categoryId: "sequence",
    preview: <Previews.SlantedLabelsPreview />,
    template: { content: createTimelineContent("parallelogram") },
  },
  {
    id: "snake-flow",
    name: "Змейка",
    categoryId: "sequence",
    preview: <Previews.SnakeDiagramPreview />,
    template: { content: createSnakeContent() },
  },

  // Steps
  {
    id: "staircase",
    name: "Лестница",
    categoryId: "steps",
    preview: <Previews.StaircasePreview />,
    template: { content: createStaircaseContent() },
  },
  {
    id: "steps",
    name: "Шаги",
    categoryId: "steps",
    preview: <Previews.LargeBulletsPreview />,
    template: { content: createStepsContent() },
  },
  {
    id: "sequence-arrow",
    name: "Последовательная стрелка",
    categoryId: "steps",
    preview: <Previews.SequenceArrowPreview />,
    template: { content: createTimelineContent("arrow-vertical") },
  },
  {
    id: "slope",
    name: "Наклон",
    categoryId: "steps",
    preview: <Previews.SlopeDiagramPreview />,
    template: { content: createSlopeContent() },
  },

  // Quotes
  {
    id: "large-quote",
    name: "Крупная цитата",
    categoryId: "quotes",
    preview: <Previews.LargeQuotePreview />,
    template: { content: createQuoteContent("large") },
  },
  {
    id: "side-quote-icon",
    name: "Боковая цитата с иконкой",
    categoryId: "quotes",
    preview: <Previews.SideQuoteWithIconPreview />,
    template: { content: createQuoteContent("sidequote-icon") },
  },
  {
    id: "simple-side-quote",
    name: "Простая боковая цитата",
    categoryId: "quotes",
    preview: <Previews.SimpleSideQuotePreview />,
    template: { content: createQuoteContent("sidequote") },
  },
];
