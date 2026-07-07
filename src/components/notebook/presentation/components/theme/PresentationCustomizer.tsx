"use client";

import { List } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePresentationState } from "@/states/presentation-state";

const CONTENT_OPTIONS = [
  { id: "minimal", label: "Минимальный", lines: 2 },
  { id: "concise", label: "Краткий", lines: 3 },
  { id: "detailed", label: "Подробный", lines: 3 },
  { id: "extensive", label: "Обширный", lines: 3 },
] as const;

const TONE_OPTIONS = [
  { id: "auto", label: "Авто" },
  { id: "general", label: "Общий" },
  { id: "persuasive", label: "Убедительный" },
  { id: "inspiring", label: "Вдохновляющий" },
  { id: "instructive", label: "Обучающий" },
  { id: "engaging", label: "Увлекательный" },
] as const;

const AUDIENCE_OPTIONS = [
  { id: "auto", label: "Авто" },
  { id: "general", label: "Общая" },
  { id: "business", label: "Бизнес" },
  { id: "investor", label: "Инвестор" },
  { id: "teacher", label: "Преподаватель" },
  { id: "student", label: "Студент" },
] as const;

const SCENARIO_OPTIONS = [
  { id: "auto", label: "Авто" },
  { id: "general", label: "Общий" },
  { id: "analysis-report", label: "Аналитический отчёт" },
  { id: "teaching-training", label: "Обучение" },
  { id: "promotional-materials", label: "Продвижение" },
  { id: "public-speeches", label: "Публичные выступления" },
] as const;

export function PresentationCustomizer() {
  const {
    textContent,
    setTextContent,
    tone,
    setTone,
    audience,
    setAudience,
    scenario,
    setScenario,
  } = usePresentationState();

  return (
    <div className="space-y-4 rounded-xl border bg-muted/40">
      {/* Text Content Section */}
      <div className="border-0 p-6 shadow">
        <div className="mb-4 flex items-center gap-2">
          <List className="size-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Содержание текста
          </h2>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          Объём текста на карточке
        </p>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CONTENT_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => setTextContent(option.id)}
              className={`flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                textContent === option.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background hover:border-accent"
              }`}
            >
              <div className="flex h-12 w-full flex-col items-center justify-center gap-1">
                {Array.from({ length: option.lines }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full ${textContent === option.id ? "bg-primary" : "bg-muted-foreground"}`}
                    style={{
                      width: i === option.lines - 1 ? "60%" : "80%",
                    }}
                  />
                ))}
              </div>
              <span
                className={`text-sm font-medium ${textContent === option.id ? "text-primary" : "text-foreground"}`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Tone Select */}
          <div>
            <label
              htmlFor="presentation-tone"
              className="mb-3 block text-sm font-medium text-foreground"
            >
              Тон
            </label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="presentation-tone">
                <SelectValue placeholder="Выберите тон" />
              </SelectTrigger>
              <SelectContent>
                {TONE_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Audience Select */}
          <div>
            <label
              htmlFor="presentation-audience"
              className="mb-3 block text-sm font-medium text-foreground"
            >
              Аудитория
            </label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger id="presentation-audience">
                <SelectValue placeholder="Выберите аудиторию" />
              </SelectTrigger>
              <SelectContent>
                {AUDIENCE_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scenario Select */}
          <div>
            <label
              htmlFor="presentation-scenario"
              className="mb-3 block text-sm font-medium text-foreground"
            >
              Сценарий
            </label>
            <Select value={scenario} onValueChange={setScenario}>
              <SelectTrigger id="presentation-scenario">
                <SelectValue placeholder="Выберите сценарий" />
              </SelectTrigger>
              <SelectContent>
                {SCENARIO_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
