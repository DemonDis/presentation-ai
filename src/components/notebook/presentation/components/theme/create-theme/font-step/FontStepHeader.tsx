// font-step/components/FontStepHeader.tsx
import { Type } from "lucide-react";

export function FontStepHeader() {
  return (
    <div className="border-b border-border p-6">
      <div className="text-center">
        <h2 className="mb-2 flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
          <Type className="size-6" />
          Шрифты
        </h2>
        <p className="text-sm text-muted-foreground">
          Выберите из готовых пар шрифтов или создайте свою
        </p>
      </div>
    </div>
  );
}
