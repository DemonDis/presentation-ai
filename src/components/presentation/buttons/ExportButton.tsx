// components/export-ppt-button.tsx
"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { raiseError } from "@/lib/raise-error";
import { usePresentationState } from "@/states/presentation-state";
import { scanAllSlides } from "../export/domSlideScanner";
import { exportPresentationToPptx } from "../export/domToPptxConverter";

const EXPORT_SUCCESS_TOAST_DURATION_MS = 10000;
const FALLBACK_DOWNLOAD_LINK_TTL_MS = 60000;

function startDownload(blob: Blob, fileName: string) {
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, FALLBACK_DOWNLOAD_LINK_TTL_MS);

  return downloadUrl;
}

export function ExportButton() {
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Get all slide IDs
      const { slides, currentPresentationTitle } =
        usePresentationState.getState();
      const slideIds = slides.map((slide) => slide.id);

      if (slideIds.length === 0) {
        raiseError(new Error("No slides to export"));
      }

      // Show single toast with loader
      const { update, dismiss } = toast({
        title: "Экспорт презентации",
        description: (
          <div className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            <span>{"Сканирование слайдов..."}</span>
          </div>
        ),
        duration: Infinity, // Keep open until we dismiss
      });

      // Scan all slides in the DOM (now parallel)
      const scanResults = await scanAllSlides(slides);

      if (scanResults.length === 0) {
        raiseError(
          new Error(
            "Не удалось отсканировать слайды. Убедитесь, что все слайды видны на странице.",
          ),
        );
      }

      update({
        description: (
          <div className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            <span>{"Генерация PowerPoint..."}</span>
          </div>
        ),
      });

      const result = await exportPresentationToPptx(
        scanResults,
        slides,
        currentPresentationTitle ?? "presentation",
      );
      const downloadUrl = startDownload(result.blob, result.fileName);

      dismiss();

      toast({
        title: "Экспорт завершён",
        description: (
          <p>
            {"Загрузка PowerPoint началась. Если она не началась,"}{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4"
              download={result.fileName}
              href={downloadUrl}
            >
              {"нажмите здесь"}
            </a>
            .
          </p>
        ),
        duration: EXPORT_SUCCESS_TOAST_DURATION_MS,
      });

      setIsExportDialogOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка экспорта",
        description:
          error instanceof Error
            ? error.message
            : "Произошла ошибка при экспорте презентации.",
        variant: "destructive",
      });
      console.error("Export error:", error);
      setIsExporting(false);
    }
    setIsExporting(false);
  };

  return (
    <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative size-9 px-0 sm:h-9 sm:w-auto sm:gap-1.5 sm:px-3"
        >
            <span className="sr-only">
              Экспортировать презентацию
            </span>
          <Download className="size-4 sm:mr-1" />
          <span className="hidden sm:inline">
            Экспорт
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Экспорт презентации
          </DialogTitle>
          <DialogDescription>
            Выберите формат для экспорта презентации.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label className="mb-2 block">
            Формат экспорта
          </Label>
          <RadioGroup
            value="pptx"
            className="grid gap-4"
          >
            <Label
              htmlFor="pptx"
              className={`flex cursor-pointer items-start space-x-4 rounded-xl border p-4 transition-all hover:bg-accent hover:text-accent-foreground ${
                "border-primary bg-accent/50 ring ring-primary"
              }`}
            >
              <RadioGroupItem value="pptx" id="pptx" className="mt-3" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Download className="size-5" />
                  </div>
                  <div>
                    <span className="block text-base font-semibold">
                      PowerPoint (.pptx)
                    </span>
                    <p className="text-sm leading-snug text-muted-foreground">
                      Стандартный файл PowerPoint
                    </p>
                  </div>
                </div>
              </div>
            </Label>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsExportDialogOpen(false)}
            disabled={isExporting}
          >
            Отмена
          </Button>
          <Button type="button" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Экспорт…
              </>
            ) : (
              "Экспорт в PowerPoint"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
