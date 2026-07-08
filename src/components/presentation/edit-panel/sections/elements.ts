"use client";

import { ColumnItemPlugin, ColumnPlugin } from "@platejs/layout/react";
import { KEYS, type TElement, type TText } from "platejs";

import {
  ANTV_INFOGRAPHIC,
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
  BUTTON_ELEMENT,
  CANDLESTICK_CHART_ELEMENT,
  CHORD_CHART_ELEMENT,
  CIRCULAR_GRID_GROUP,
  CIRCULAR_GRID_ITEM,
  COMPARE_GROUP,
  COMPARE_SIDE,
  COMPOSED_CHART_ELEMENT,
  CONE_FUNNEL_CHART_ELEMENT,
  CONNECTED_CIRCLES_GROUP,
  CONNECTED_CIRCLES_ITEM,
  CONS_ITEM,
  CONTRIBUTOR_ELEMENT,
  CYCLE_GROUP,
  CYCLE_ITEM,
  DEFAULT_CHART_DATA,
  DONUT_CHART_ELEMENT,
  FUNNEL_CHART_ELEMENT,
  HEATMAP_CHART_ELEMENT,
  HISTOGRAM_CHART_ELEMENT,
  ICON_LIST,
  ICON_LIST_ITEM,
  LABEL_ELEMENT,
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
} from "@/components/notebook/presentation/editor/lib";
import { CALLOUT_VARIANTS } from "@/components/plate/ui/callout-variants";

export type PaletteItem = {
  category?: string;
  description?: string;
  key: string;
  label: string;
  node: TElement;
};

const text = (value: string): TText => ({ text: value }) as const;

const paragraph = (children: Array<TElement | TText> = [text("")]): TElement =>
  ({ type: KEYS.p, children }) as unknown as TElement;

const h3 = (content: string): TElement =>
  ({ type: "h3", children: [text(content)] }) as unknown as TElement;

const h4 = (content: string): TElement =>
  ({ type: "h4", children: [text(content)] }) as unknown as TElement;

const heading = (
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
  content: string,
): TElement => ({ type, children: [text(content)] }) as unknown as TElement;

const codeBlock = (code: string, language = "tsx"): TElement => {
  const lines = code
    .split("\n")
    .map((l) => ({ type: KEYS.codeLine, children: [text(l)] }));
  return {
    type: KEYS.codeBlock,
    lang: language,
    children: lines as unknown as TElement["children"],
  } as unknown as TElement;
};

const callout = (
  icon: string,
  bg: string,
  content: string,
  variant: string,
): TElement =>
  ({
    type: KEYS.callout,
    alignment: "left",
    icon,
    backgroundColor: bg,
    variant,
    children: [paragraph([text(content)])],
  }) as unknown as TElement;

const _table = (headers: string[], rows: string[][]): TElement =>
  ({
    type: KEYS.table,
    children: [
      {
        type: KEYS.tr,
        children: headers.map((h) => ({
          type: KEYS.td,
          header: true,
          children: [paragraph([text(h)])],
        })),
      },
      ...rows.map((r) => ({
        type: KEYS.tr,
        children: r.map((c) => ({
          type: KEYS.td,
          children: [paragraph([text(c)])],
        })),
      })),
    ],
  }) as unknown as TElement;

const blankTable = (rows: number, cols: number): TElement =>
  ({
    type: KEYS.table,
    children: Array.from({ length: rows }, () => ({
      type: KEYS.tr,
      children: Array.from({ length: cols }, () => ({
        type: KEYS.td,
        children: [paragraph()],
      })),
    })),
  }) as unknown as TElement;

const columns = (cols: Array<{ title: string; body: string[] }>): TElement =>
  ({
    type: ColumnPlugin.key,
    children: cols.map((c) => ({
      type: ColumnItemPlugin.key,
      width: "M",
      children: [h3(c.title), ...c.body.map((b) => paragraph([text(b)]))],
    })),
  }) as unknown as TElement;

const simple = {
  hr: (): TElement =>
    ({ type: KEYS.hr, children: [{ text: "" }] }) as unknown as TElement,
  toc: (): TElement =>
    ({ type: KEYS.toc, children: [{ text: "" }] }) as unknown as TElement,
  blockquote: (content: string): TElement =>
    ({
      type: KEYS.blockquote,
      children: [paragraph([text(content)])],
    }) as unknown as TElement,
};

const listBlock = (
  listStyleType: typeof KEYS.ul | typeof KEYS.ol | typeof KEYS.listTodo,
  content: string,
): TElement =>
  ({
    type: KEYS.p,
    indent: 1,
    listStyleType,
    children: [text(content)],
  }) as unknown as TElement;

// ============================================================================
// HELPER FUNCTIONS - List & Group Builders
// ============================================================================

const createList = (
  type: string,
  itemType: string,
  items: Array<{ heading?: string; content: string }>,
): TElement =>
  ({
    type,
    ...(type === BULLET_GROUP && { columnSize: "md" }), // Add default columnSize for bullet groups
    children: items.map((item) => ({
      type: itemType,
      children: item.heading
        ? [h4(item.heading), paragraph([text(item.content)])]
        : [paragraph([text(item.content)])],
    })),
  }) as unknown as TElement;

const createIconListItem = (iconName: string, content: string) => ({
  type: ICON_LIST_ITEM,
  icon: iconName,
  children: [paragraph([text(content)])],
});

const createBoxItem = (title: string, content: string) => ({
  type: BOX_ITEM,
  children: [h3(title), paragraph([text(content)])],
});

const createCompareSide = (
  title: string,
  items: string[],
  type: typeof COMPARE_SIDE | typeof BEFORE_AFTER_SIDE = COMPARE_SIDE,
) => ({
  type,
  children: [h3(title), ...items.map((item) => paragraph([text(item)]))],
});

const createDiagramItem = (type: string, title: string, content: string) => ({
  type,
  children: [h3(title), paragraph([text(content)])],
});

const createDiagramTitleItem = (type: string, title: string) => ({
  type,
  children: [h3(title)],
});

const createStatsItem = (stat: string, label: string) => ({
  type: STATS_ITEM,
  stat,
  children: [paragraph([text(label)])],
});

// ============================================================================
// CHART BUILDERS
// ============================================================================

// Helper to create a chart node with disableAnimation
const createChartNode = (
  type: string,
  data: unknown,
  options?: Record<string, unknown>,
): TElement =>
  ({
    type,
    data,
    disableAnimation: false,
    ...options,
    children: [{ text: "" }],
  }) as unknown as TElement;

export const chartItems: PaletteItem[] = [
  {
    key: "chart-pie",
    label: "Круговая",
    node: createChartNode(PIE_CHART_ELEMENT, [
      { label: "Крупный бизнес", value: 42 },
      { label: "Малый бизнес", value: 28 },
      { label: "Средний рынок", value: 18 },
      { label: "Потребители", value: 8 },
      { label: "Государство", value: 4 },
    ]),
  },
  // Donut Chart - dedicated donut type
  {
    key: "chart-donut",
    label: "Кольцевая",
    node: createChartNode(DONUT_CHART_ELEMENT, [
      { label: "Завершено", value: 65 },
      { label: "В процессе", value: 20 },
      { label: "Ожидание", value: 10 },
      { label: "Отменено", value: 5 },
    ]),
  },
  // Bar Chart - with more data points
  {
    key: "chart-bar",
    label: "Столбчатая",
    node: createChartNode(BAR_CHART_ELEMENT, [
      { label: "Q1 2023", value: 320 },
      { label: "Q2 2023", value: 410 },
      { label: "Q3 2023", value: 570 },
      { label: "Q4 2023", value: 680 },
      { label: "Q1 2024", value: 720 },
      { label: "Q2 2024", value: 850 },
      { label: "Q3 2024", value: 920 },
      { label: "Q4 2024", value: 1050 },
    ]),
  },
  // Line Chart - with more data points
  {
    key: "chart-line",
    label: "Линейный график",
    node: createChartNode(LINE_CHART_ELEMENT, [
      { name: "Янв", value: 120 },
      { name: "Фев", value: 190 },
      { name: "Мар", value: 170 },
      { name: "Апр", value: 230 },
      { name: "Май", value: 290 },
      { name: "Июн", value: 310 },
      { name: "Июл", value: 280 },
      { name: "Авг", value: 350 },
      { name: "Сен", value: 420 },
      { name: "Окт", value: 390 },
      { name: "Ноя", value: 450 },
      { name: "Дек", value: 520 },
    ]),
  },
  // Area Chart - with gradient fill
  {
    key: "chart-area",
    label: "С областями",
    node: createChartNode(AREA_CHART_ELEMENT, [
      { name: "Week 1", value: 1200 },
      { name: "Week 2", value: 1900 },
      { name: "Week 3", value: 1700 },
      { name: "Week 4", value: 2300 },
      { name: "Week 5", value: 2900 },
      { name: "Week 6", value: 3100 },
      { name: "Week 7", value: 2800 },
      { name: "Week 8", value: 3500 },
    ]),
  },
  // Scatter Chart - with X/Y coordinates
  {
    key: "chart-scatter",
    label: "Точечная",
    node: createChartNode(SCATTER_CHART_ELEMENT, [
      { x: 10, y: 30 },
      { x: 25, y: 45 },
      { x: 35, y: 20 },
      { x: 45, y: 55 },
      { x: 55, y: 40 },
      { x: 65, y: 70 },
      { x: 75, y: 50 },
      { x: 85, y: 85 },
      { x: 95, y: 60 },
      { x: 40, y: 35 },
      { x: 60, y: 48 },
      { x: 80, y: 72 },
    ]),
  },
  // Bubble Chart - 3D scatter with z-axis for size
  {
    key: "chart-bubble",
    label: "Пузырьковая",
    node: createChartNode(BUBBLE_CHART_ELEMENT, [
      { x: 10, y: 30, z: 200 },
      { x: 25, y: 45, z: 350 },
      { x: 35, y: 20, z: 150 },
      { x: 45, y: 55, z: 400 },
      { x: 55, y: 40, z: 280 },
      { x: 65, y: 70, z: 520 },
      { x: 75, y: 50, z: 180 },
      { x: 85, y: 85, z: 600 },
    ]),
  },
  // Radar Chart - skills/attributes comparison
  {
    key: "chart-radar",
    label: "Лепестковая",
    node: createChartNode(RADAR_CHART_ELEMENT, [
      { name: "Скорость", value: 85 },
      { name: "Надёжность", value: 90 },
      { name: "Удобство", value: 78 },
      { name: "Производительность", value: 92 },
      { name: "Безопасность", value: 88 },
      { name: "Масштабируемость", value: 75 },
    ]),
  },
  // Radial Bar Chart - progress indicators
  {
    key: "chart-radial-bar",
    label: "Радиальная столбчатая",
    node: createChartNode(RADIAL_BAR_CHART_ELEMENT, [
      { label: "Маркетинг", value: 85 },
      { label: "Продажи", value: 72 },
      { label: "Разработка", value: 94 },
      { label: "Дизайн", value: 68 },
      { label: "Поддержка", value: 81 },
    ]),
  },
  // Radial Column - circular columns
  {
    key: "chart-radial-column",
    label: "Радиальная гистограмма",
    node: createChartNode(RADIAL_COLUMN_CHART_ELEMENT, [
      { label: "Янв", value: 45 },
      { label: "Фев", value: 52 },
      { label: "Мар", value: 48 },
      { label: "Апр", value: 61 },
      { label: "Май", value: 55 },
      { label: "Июн", value: 67 },
    ]),
  },
  // Composed Chart - multi-series with bar, line, area
  {
    key: "chart-composed",
    label: "Комбинированная",
    node: createChartNode(COMPOSED_CHART_ELEMENT, [
      { label: "Янв", revenue: 4500, expenses: 3200, profit: 1300 },
      { label: "Фев", revenue: 5200, expenses: 3400, profit: 1800 },
      { label: "Мар", revenue: 4800, expenses: 3100, profit: 1700 },
      { label: "Апр", revenue: 6100, expenses: 3800, profit: 2300 },
      { label: "Май", revenue: 5900, expenses: 3500, profit: 2400 },
      { label: "Июн", revenue: 6800, expenses: 4000, profit: 2800 },
    ]),
  },
  // Treemap Chart - hierarchical data
  {
    key: "chart-treemap",
    label: "Древовидная",
    node: createChartNode(TREEMAP_CHART_ELEMENT, [
      { label: "Северная Америка", value: 45000 },
      { label: "Европа", value: 32000 },
      { label: "Азиатско-Тихоокеанский регион", value: 28000 },
      { label: "Латинская Америка", value: 12000 },
      { label: "Ближний Восток", value: 8000 },
      { label: "Африка", value: 5000 },
    ]),
  },
  // Histogram - frequency distribution
  {
    key: "chart-histogram",
    label: "Гистограмма",
    node: createChartNode(HISTOGRAM_CHART_ELEMENT, [
      { label: "15-25", value: 3 },
      { label: "25-35", value: 7 },
      { label: "35-45", value: 15 },
      { label: "45-55", value: 25 },
      { label: "55-65", value: 20 },
      { label: "65-75", value: 12 },
      { label: "75-85", value: 5 },
    ]),
  },
  // Heatmap - matrix data
  {
    key: "chart-heatmap",
    label: "Тепловая карта",
    node: createChartNode(HEATMAP_CHART_ELEMENT, [
      { x: "Пн", y: "Утро", value: 75 },
      { x: "Пн", y: "День", value: 85 },
      { x: "Пн", y: "Вечер", value: 45 },
      { x: "Вт", y: "Утро", value: 65 },
      { x: "Вт", y: "День", value: 92 },
      { x: "Вт", y: "Вечер", value: 55 },
      { x: "Ср", y: "Утро", value: 80 },
      { x: "Ср", y: "День", value: 78 },
      { x: "Ср", y: "Вечер", value: 40 },
    ]),
  },
  // Range Bar - value ranges
  {
    key: "chart-range-bar",
    label: "Диапазонная столбчатая",
    node: createChartNode(RANGE_BAR_CHART_ELEMENT, [
      { category: "Проект A", low: 10, high: 45 },
      { category: "Проект B", low: 20, high: 65 },
      { category: "Проект C", low: 15, high: 55 },
      { category: "Проект D", low: 30, high: 80 },
      { category: "Проект E", low: 5, high: 35 },
    ]),
  },
  // Range Area - area with ranges
  {
    key: "chart-range-area",
    label: "Диапазонная с областями",
    node: createChartNode(RANGE_AREA_CHART_ELEMENT, [
      { date: "Янв", low: 20, high: 45 },
      { date: "Фев", low: 25, high: 52 },
      { date: "Мар", low: 22, high: 48 },
      { date: "Апр", low: 28, high: 58 },
      { date: "Май", low: 32, high: 65 },
      { date: "Июн", low: 35, high: 70 },
    ]),
  },
  // Waterfall - cumulative effects
  {
    key: "chart-waterfall",
    label: "Каскадная",
    node: createChartNode(WATERFALL_CHART_ELEMENT, [
      { category: "Старт", amount: 100 },
      { category: "Доход", amount: 50 },
      { category: "Расходы", amount: -30 },
      { category: "Маркетинг", amount: -15 },
      { category: "Налоги", amount: -10 },
      { category: "Итого", amount: 95 },
    ]),
  },
  // Box Plot - statistical distribution
  {
    key: "chart-box-plot",
    label: "Ящик с усами",
    node: createChartNode(BOX_PLOT_CHART_ELEMENT, [
      { category: "Q1", min: 10, q1: 25, median: 35, q3: 48, max: 65 },
      { category: "Q2", min: 15, q1: 30, median: 42, q3: 55, max: 72 },
      { category: "Q3", min: 12, q1: 28, median: 38, q3: 52, max: 68 },
      { category: "Q4", min: 18, q1: 35, median: 48, q3: 62, max: 78 },
    ]),
  },
  // Candlestick - financial OHLC
  {
    key: "chart-candlestick",
    label: "Японские свечи",
    node: createChartNode(CANDLESTICK_CHART_ELEMENT, [
      { date: "Пн", open: 100, high: 115, low: 95, close: 110 },
      { date: "Вт", open: 110, high: 125, low: 105, close: 120 },
      { date: "Ср", open: 120, high: 130, low: 112, close: 115 },
      { date: "Чт", open: 115, high: 128, low: 108, close: 125 },
      { date: "Пт", open: 125, high: 140, low: 118, close: 135 },
    ]),
  },
  // OHLC - Open-High-Low-Close
  {
    key: "chart-ohlc",
    label: "OHLC",
    node: createChartNode(OHLC_CHART_ELEMENT, [
      { date: "Week 1", open: 50, high: 58, low: 48, close: 55 },
      { date: "Week 2", open: 55, high: 62, low: 52, close: 60 },
      { date: "Week 3", open: 60, high: 68, low: 55, close: 58 },
      { date: "Week 4", open: 58, high: 72, low: 56, close: 70 },
    ]),
  },
  // Nightingale - rose/wind chart
  {
    key: "chart-nightingale",
    label: "Роза",
    node: createChartNode(NIGHTINGALE_CHART_ELEMENT, [
      { label: "Север", value: 85 },
      { label: "Северо-Восток", value: 65 },
      { label: "Восток", value: 45 },
      { label: "Юго-Восток", value: 35 },
      { label: "Юг", value: 55 },
      { label: "Юго-Запад", value: 75 },
      { label: "Запад", value: 90 },
      { label: "Северо-Запад", value: 70 },
    ]),
  },
  // Sunburst - hierarchical radial
  {
    key: "chart-sunburst",
    label: "Солнечные лучи",
    node: createChartNode(SUNBURST_CHART_ELEMENT, DEFAULT_CHART_DATA.hierarchy),
  },
  // Sankey - flow visualization
  {
    key: "chart-sankey",
    label: "Диаграмма Санкей",
    node: createChartNode(SANKEY_CHART_ELEMENT, [
      { from: "Сайт", to: "Регистрация", size: 100 },
      { from: "Рефералы", to: "Регистрация", size: 40 },
      { from: "Регистрация", to: "Пробный", size: 80 },
      { from: "Пробный", to: "Платный", size: 50 },
      { from: "Пробный", to: "Отток", size: 30 },
    ]),
  },
  // Chord - relationship visualization
  {
    key: "chart-chord",
    label: "Хордовая",
    node: createChartNode(CHORD_CHART_ELEMENT, [
      { from: "Продажи", to: "Маркетинг", size: 30 },
      { from: "Маркетинг", to: "Разработка", size: 20 },
      { from: "Разработка", to: "Продажи", size: 25 },
      { from: "Продажи", to: "Поддержка", size: 15 },
      { from: "Поддержка", to: "Разработка", size: 10 },
    ]),
  },
  // Funnel - pipeline visualization
  {
    key: "chart-funnel",
    label: "Воронка",
    node: createChartNode(FUNNEL_CHART_ELEMENT, [
      { label: "Посетители", value: 10000 },
      { label: "Перспективные", value: 5000 },
      { label: "Лиды", value: 2500 },
      { label: "Возможности", value: 1000 },
      { label: "Клиенты", value: 500 },
    ]),
  },
  // Cone Funnel - funnel variant
  {
    key: "chart-cone-funnel",
    label: "Коническая воронка",
    node: createChartNode(CONE_FUNNEL_CHART_ELEMENT, [
      { label: "Осведомлённость", value: 8000 },
      { label: "Интерес", value: 4500 },
      { label: "Рассмотрение", value: 2200 },
      { label: "Намерение", value: 1100 },
      { label: "Покупка", value: 600 },
    ]),
  },
  // Pyramid Chart - triangular visualization
  {
    key: "chart-pyramid",
    label: "Пирамида",
    node: createChartNode(PYRAMID_CHART_ELEMENT, [
      { label: "Руководство", value: 5 },
      { label: "Менеджмент", value: 20 },
      { label: "Специалисты", value: 50 },
      { label: "Персонал", value: 100 },
    ]),
  },
  // Radial Gauge - circular gauge
  {
    key: "chart-radial-gauge",
    label: "Радиальный датчик",
    node: createChartNode(RADIAL_GAUGE_ELEMENT, 75),
  },
  // Linear Gauge - linear gauge
  {
    key: "chart-linear-gauge",
    label: "Линейный датчик",
    node: createChartNode(LINEAR_GAUGE_ELEMENT, 65),
  },
];

export const basicBlockItems: PaletteItem[] = [
  {
    category: "Текст",
    key: "title",
    label: "Заголовок",
    description: "! Title",
    node: {
      type: PRESENTATION_TITLE_ELEMENT,
      alignment: "left",
      variant: "title",
      children: [text("Заголовок")],
    } as unknown as TElement,
  },
  {
    category: "Текст",
    key: "heading-1",
    label: "Заголовок 1",
    description: "# Heading 1",
    node: heading("h1", "Заголовок 1"),
  },
  {
    category: "Текст",
    key: "heading-2",
    label: "Заголовок 2",
    description: "## Heading 2",
    node: heading("h2", "Заголовок 2"),
  },
  {
    category: "Текст",
    key: "heading-3",
    label: "Заголовок 3",
    description: "### Heading 3",
    node: heading("h3", "Заголовок 3"),
  },
  {
    category: "Текст",
    key: "heading-4",
    label: "Заголовок 4",
    description: "#### Heading 4",
    node: heading("h4", "Заголовок 4"),
  },
  {
    category: "Текст",
    key: "paragraph",
    label: "Текст",
    description: "Абзац",
    node: paragraph([text("Добавьте абзац здесь.")]),
  },
  {
    category: "Текст",
    key: "blockquote",
    label: "Цитата",
    description: "> Quote",
    node: simple.blockquote("Добавьте цитату здесь."),
  },
  {
    category: "Текст",
    key: "label",
    label: "Метка",
    description: "Label",
    node: {
      type: LABEL_ELEMENT,
      alignment: "left",
      children: [text("Метка")],
    } as unknown as TElement,
  },
  {
    category: "Таблицы",
    key: "table-2x2",
    label: "Таблица 2x2",
    description: "/table",
    node: blankTable(2, 2),
  },
  {
    category: "Таблицы",
    key: "table-3x3",
    label: "Таблица 3x3",
    node: blankTable(3, 3),
  },
  {
    category: "Таблицы",
    key: "table-4x4",
    label: "Таблица 4x4",
    node: blankTable(4, 4),
  },
  {
    category: "Списки",
    key: "bulleted-list",
    label: "Маркированный список",
    description: "- Item",
    node: listBlock(KEYS.ul, "Item"),
  },
  {
    category: "Списки",
    key: "numbered-list",
    label: "Нумерованный список",
    description: "1. Item",
    node: listBlock(KEYS.ol, "Item"),
  },
  {
    category: "Списки",
    key: "todo-list",
    label: "Список задач",
    description: "[] Item",
    node: listBlock(KEYS.listTodo, "Item"),
  },
  {
    category: "Блоки",
    key: "callout-note",
    label: "Заметка",
    description: "/note",
    node: callout(
      "FiFileText",
      CALLOUT_VARIANTS.note.backgroundColor,
      "Добавьте заметку.",
      "note",
    ),
  },
  {
    category: "Блоки",
    key: "callout-info",
    label: "Информация",
    description: "/info",
    node: callout(
      "FiInfo",
      CALLOUT_VARIANTS.info.backgroundColor,
      "Добавьте полезную информацию.",
      "info",
    ),
  },
  {
    category: "Блоки",
    key: "callout-warning",
    label: "Предупреждение",
    description: "/warning",
    node: callout(
      "FiAlertTriangle",
      "#FFF7ED",
      "Добавьте предупреждение.",
      "warning",
    ),
  },
  {
    category: "Блоки",
    key: "callout-caution",
    label: "Осторожно",
    description: "/caution",
    node: callout("FiXCircle", "#FEF2F2",       "Добавьте предостережение.", "caution"),
  },
  {
    category: "Блоки",
    key: "callout-success",
    label: "Успех",
    description: "/success",
    node: callout(
      "FiCheckCircle",
      "#F0FDF4",
      "Добавьте сообщение об успехе.",
      "success",
    ),
  },
  {
    category: "Блоки",
    key: "callout-question",
    label: "Вопрос",
    description: "/question",
    node: callout(
      "FiHelpCircle",
      CALLOUT_VARIANTS.question.backgroundColor,
      "Добавьте вопрос.",
      "question",
    ),
  },
  {
    category: "Интерактив",
    key: "button",
    label: "Кнопка",
    node: {
      type: BUTTON_ELEMENT,
      alignment: "left",
      variant: "filled",
      size: "md",
      children: [paragraph([text("Начать")])],
    } as unknown as TElement,
  },
  {
    category: "Интерактив",
    key: "toggle",
    label: "Спойлер",
    node: {
      type: KEYS.toggle,
      children: [text("Содержимое спойлера")],
    } as unknown as TElement,
  },
  {
    category: "Прочее",
    key: "code",
    label: "Блок кода",
    description: "```",
    node: codeBlock(`// Your code here\nconst hello = "world";`, "typescript"),
  },
  {
    category: "Прочее",
    key: "math",
    label: "Формула",
    node: {
      type: KEYS.equation,
      texExpression: "f(x)=x^2",
      children: [{ text: "" }],
    } as unknown as TElement,
  },
  {
    category: "Прочее",
    key: "contributors",
    label: "Авторы",
    node: {
      type: CONTRIBUTOR_ELEMENT,
      alignment: "left",
      children: [text("")],
    } as unknown as TElement,
  },
  {
    category: "Прочее",
    key: "toc",
    label: "Содержание",
    node: simple.toc(),
  },
];

export const statsItems: PaletteItem[] = [
  {
    key: "stats-plain",
    label: "Статистика",
    node: {
      type: STATS_GROUP,
      statsType: "plain",
      columnSize: "md",
      children: [
        createStatsItem("64", "Выполнение"),
        createStatsItem("28", "Активные команды"),
        createStatsItem("91", "Удовлетворённость"),
      ],
    } as unknown as TElement,
  },
  {
    key: "stats-circle",
    label: "Круговая статистика",
    node: {
      type: STATS_GROUP,
      statsType: "circle",
      columnSize: "md",
      children: [
        createStatsItem("72", "Прогресс"),
        createStatsItem("48", "Внедрение"),
        createStatsItem("88", "Качество"),
      ],
    } as unknown as TElement,
  },
  {
    key: "stats-star",
    label: "Рейтинг",
    node: {
      type: STATS_GROUP,
      statsType: "star",
      columnSize: "md",
      children: [
        createStatsItem("4", "Рейтинг"),
        createStatsItem("5", "Соответствие"),
        createStatsItem("4", "Уверенность"),
      ],
    } as unknown as TElement,
  },
  {
    key: "stats-bar",
    label: "Шкала",
    node: {
      type: STATS_GROUP,
      statsType: "bar",
      columnSize: "md",
      children: [
        createStatsItem("74", "Воронка"),
        createStatsItem("52", "Использование"),
        createStatsItem("89", "Удержание"),
      ],
    } as unknown as TElement,
  },
  {
    key: "stats-dot-grid",
    label: "Сетка точек",
    node: {
      type: STATS_GROUP,
      statsType: "dot-grid",
      columnSize: "md",
      children: [
        createStatsItem("68", "Покрытие"),
        createStatsItem("41", "Охват"),
        createStatsItem("96", "Надёжность"),
      ],
    } as unknown as TElement,
  },
  {
    key: "stats-dot-line",
    label: "Линия точек",
    node: {
      type: STATS_GROUP,
      statsType: "dot-line",
      columnSize: "md",
      children: [
        createStatsItem("60", "Базовый"),
        createStatsItem("75", "Цель"),
        createStatsItem("90", "Максимум"),
      ],
    } as unknown as TElement,
  },
];

export const quoteItems: PaletteItem[] = [
  {
    key: "quote-large",
    label: "Большая цитата",
    node: {
      type: QUOTE_ELEMENT,
      variant: "large",
      author: "Имя автора",
      children: [text("Добавьте запоминающуюся цитату здесь.")],
    } as unknown as TElement,
  },
  {
    key: "quote-side-icon",
    label: "Цитата с иконкой",
    node: {
      type: QUOTE_ELEMENT,
      variant: "sidequote-icon",
      author: "Имя автора",
      children: [text("Добавьте короткую цитату здесь.")],
    } as unknown as TElement,
  },
  {
    key: "quote-side",
    label: "Боковая цитата",
    node: {
      type: QUOTE_ELEMENT,
      variant: "sidequote",
      author: "Имя автора",
      children: [text("Добавьте краткую цитату здесь.")],
    } as unknown as TElement,
  },
];

export const embedItems: PaletteItem[] = [
  {
    key: "media-embed",
    label: "Медиа",
    node: {
      type: KEYS.mediaEmbed,
      provider: "youtube",
      url: "",
      alignment: "center",
      width: "100%",
      children: [{ text: "" }],
    } as unknown as TElement,
  },
  {
    key: "infographic",
    label: "ИИ инфографика",
    node: {
      type: ANTV_INFOGRAPHIC,
      syntax: "",
      isLoading: false,
      align: "center",
      children: [{ text: "" }],
    } as unknown as TElement,
  },
];

export const paletteItems: PaletteItem[] = [
  {
    key: "bullets",
    label: "Маркеры",
    node: createList(BULLET_GROUP, BULLET_ITEM, [
      { heading: "Пункт первый", content: "Добавьте первый ключевой пункт." },
      { heading: "Пункт второй", content: "Добавьте второй ключевой пункт." },
      { heading: "Пункт третий", content: "Добавьте третий ключевой пункт." },
    ]),
  },

  {
    key: "timeline",
    label: "Таймлайн",
    node: createList(TIMELINE_GROUP, TIMELINE_ITEM, [
      { heading: "Шаг первый", content: "Опишите, что произошло на этом этапе." },
      { heading: "Шаг второй", content: "Опишите, что произошло на этом этапе." },
      {
        heading: "Шаг третий",
        content: "Опишите, что произошло на этом этапе.",
      },
    ]),
  },
  {
    key: "steps",
    label: "Шаги",
    node: {
      type: STEPS_GROUP,
      variant: "arrow",
      columnSize: "md",
      children: [
        {
          type: STEPS_ITEM,
          children: [
            h4("Step one"),
            paragraph([text("Опишите первый шаг.")]),
          ],
        },
        {
          type: STEPS_ITEM,
          children: [
            h4("Step two"),
            paragraph([text("Опишите второй шаг.")]),
          ],
        },
        {
          type: STEPS_ITEM,
          children: [
            h4("Step three"),
            paragraph([text("Опишите третий шаг.")]),
          ],
        },
      ],
    } as unknown as TElement,
  },
  {
    key: "arrows",
    label: "Процесс (стрелки)",
    node: createList(ARROW_LIST, ARROW_LIST_ITEM, [
      { heading: "Step one", content: "Опишите этот шаг." },
      { heading: "Step two", content: "Опишите этот шаг." },
      { heading: "Step three", content: "Опишите этот шаг." },
    ]),
  },
  {
    key: "arrow-vertical",
    label: "Вертикальные шаги",
    node: createList(SEQUENCE_ARROW_GROUP, SEQUENCE_ARROW_ITEM, [
      { heading: "Step one", content: "Опишите этот шаг." },
      { heading: "Step two", content: "Опишите этот шаг." },
      { heading: "Step three", content: "Опишите этот шаг." },
    ]),
  },
  {
    key: "slope",
    label: "Наклонная",
    node: {
      type: SLOPE_GROUP,
      children: [
        {
          ...createDiagramTitleItem(SLOPE_ITEM, "Идея"),
          icon: "FaLightbulb",
        },
        {
          ...createDiagramTitleItem(SLOPE_ITEM, "Прототип"),
          icon: "FaFlask",
        },
        {
          ...createDiagramTitleItem(SLOPE_ITEM, "Валидация"),
          icon: "FaCheck",
        },
        {
          ...createDiagramTitleItem(SLOPE_ITEM, "Масштаб"),
          icon: "FaChartLine",
        },
      ],
    } as unknown as TElement,
  },
  {
    key: "snake",
    label: "Змейка",
    node: {
      type: SNAKE_GROUP,
      children: [
        createDiagramItem(SNAKE_ITEM, "Оценка", "Evaluate the current state."),
        createDiagramItem(SNAKE_ITEM, "План", "Define the roadmap."),
        createDiagramItem(SNAKE_ITEM, "Сборка", "Develop the solution."),
        createDiagramItem(SNAKE_ITEM, "Тестирование", "Test and refine."),
        createDiagramItem(SNAKE_ITEM, "Запуск", "Deploy and optimize."),
      ],
    } as unknown as TElement,
  },

  // HIERARCHIES
  {
    key: "pyramid",
    label: "Пирамида",
    node: createList(PYRAMID_GROUP, PYRAMID_ITEM, [
      { content: "Верхний уровень." },
      { content: "Средний уровень." },
      { content: "Базовый уровень." },
    ]),
  },
  {
    key: "staircase",
    label: "Лестница",
    node: createList(STAIRCASE_GROUP, STAIR_ITEM, [
      { content: "Уровень 1." },
      { content: "Уровень 2." },
      { content: "Уровень 3." },
    ]),
  },
  {
    key: "cycle",
    label: "Цикл",
    node: createList(CYCLE_GROUP, CYCLE_ITEM, [
      { heading: "Открытие", content: "Identify the opportunity." },
      { heading: "План", content: "Define the next move." },
      { heading: "Создание", content: "Create the first version." },
      { heading: "Улучшение", content: "Refine from feedback." },
    ]),
  },
  {
    key: "connected-circles",
    label: "Связанные круги",
    node: {
      type: CONNECTED_CIRCLES_GROUP,
      children: [
        createDiagramItem(
          CONNECTED_CIRCLES_ITEM,
          "Общие моменты",
          "Center the message on emotional occasions.",
        ),
        createDiagramItem(
          CONNECTED_CIRCLES_ITEM,
          "Единый голос",
          "Keep the message stable and recognizable.",
        ),
        createDiagramItem(
          CONNECTED_CIRCLES_ITEM,
          "Эмоции прежде всего",
          "Connect the brand to feelings.",
        ),
        createDiagramItem(
          CONNECTED_CIRCLES_ITEM,
          "Долгая память",
          "Make the brand easy to recognize later.",
        ),
      ],
    } as unknown as TElement,
  },
  {
    key: "circular-grid",
    label: "Круговая сетка",
    node: {
      type: CIRCULAR_GRID_GROUP,
      centerText: "Умная диаграмма",
      children: [
        createDiagramItem(CIRCULAR_GRID_ITEM, "Цель", "Define the goal."),
        createDiagramItem(CIRCULAR_GRID_ITEM, "Сигналы", "Capture inputs."),
        createDiagramItem(CIRCULAR_GRID_ITEM, "Действия", "Move into work."),
        createDiagramItem(CIRCULAR_GRID_ITEM, "Метрики", "Track progress."),
        createDiagramItem(CIRCULAR_GRID_ITEM, "Риски", "Surface assumptions."),
        createDiagramItem(CIRCULAR_GRID_ITEM, "Обучение", "Feed results back."),
      ],
    } as unknown as TElement,
  },
  // COMPARISON & EVALUATION
  {
    key: "boxes",
    label: "Карточки",
    node: {
      type: BOX_GROUP,
      children: [
        createBoxItem("Функция 1", "Опишите эту функцию."),
        createBoxItem("Функция 2", "Опишите эту функцию."),
        createBoxItem("Функция 3", "Опишите эту функцию."),
      ],
    } as unknown as TElement,
  },
  {
    key: "compare",
    label: "Сравнение",
    node: {
      type: COMPARE_GROUP,
      children: [
        createCompareSide("Вариант A", [
          "Пункт 1",
          "Пункт 2",
          "Пункт 3",
        ]),
        createCompareSide("Вариант B", [
          "Пункт 1",
          "Пункт 2",
          "Пункт 3",
        ]),
      ],
    } as unknown as TElement,
  },
  {
    key: "before-after",
    label: "До / После",
    node: {
      type: BEFORE_AFTER_GROUP,
      children: [
        createCompareSide(
          "До",
          ["Пункт 1", "Пункт 2", "Пункт 3"],
          BEFORE_AFTER_SIDE,
        ),
        createCompareSide(
          "После",
          ["Пункт 1", "Пункт 2", "Пункт 3"],
          BEFORE_AFTER_SIDE,
        ),
      ],
    } as unknown as TElement,
  },
  {
    key: "pros-cons",
    label: "Плюсы и минусы",
    node: {
      type: PROS_CONS_GROUP,
      children: [
        {
          type: PROS_ITEM,
          children: [paragraph([text("Сильная сторона.")])],
        },
        {
          type: PROS_ITEM,
          children: [paragraph([text("Сильная сторона.")])],
        },
        {
          type: CONS_ITEM,
          children: [paragraph([text("Слабая сторона.")])],
        },
        {
          type: CONS_ITEM,
          children: [paragraph([text("Слабая сторона.")])],
        },
      ],
    } as unknown as TElement,
  },

  // ICONS
  {
    key: "icon-list",
    label: "Список с иконками",
    node: {
      type: ICON_LIST,
      orientation: "side",
      variant: "icon",
      children: [
        createIconListItem("activity", "Опишите этот пункт."),
        createIconListItem("shield", "Опишите этот пункт."),
        createIconListItem("bolt", "Опишите этот пункт."),
      ],
    } as unknown as TElement,
  },

  // INTERACTIVE & MEDIA
  {
    key: "image",
    label: "Изображение",
    node: {
      type: "img",
      url: "",
      query: "",
      children: [],
    } as unknown as TElement,
  },
  {
    key: "columns",
    label: "Колонки",
    node: columns([
      {
        title: "Колонка 1",
        body: ["Добавьте содержание.", "Добавьте пункты."],
      },
      {
        title: "Колонка 2",
        body: ["Добавьте содержание.", "Добавьте пункты."],
      },
      {
        title: "Колонка 3",
        body: ["Добавьте содержание.", "Добавьте пункты."],
      },
    ]),
  },

  ...statsItems,
  ...quoteItems,
  ...embedItems,
];

const HIDDEN_PALETTE_ITEM_KEYS = new Set<string>();

export const visiblePaletteItems = paletteItems.filter(
  (item) => !HIDDEN_PALETTE_ITEM_KEYS.has(item.key),
);
