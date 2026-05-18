"use client";

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
import { usePresentationState } from "@/states/presentation-state";
import { Download, FileDown, FileImage, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { exportPresentationToPdf } from "../export/domToPdfConverter";
import { downloadBlob, exportPresentationToPptx, scanAllSlides } from "../export";
import { SaveStatus } from "./SaveStatus";

type ExportFormat = "pptx" | "pdf";

export function ExportButton() {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("pptx");
  const { toast } = useToast();
  const exportResultRef = useRef<{ blob: Blob; fileName: string } | null>(null);

  const handleDownload = () => {
    if (!exportResultRef.current) return;
    downloadBlob(
      exportResultRef.current.blob,
      exportResultRef.current.fileName,
    );
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      exportResultRef.current = null;

      const { slides, currentPresentationTitle } =
        usePresentationState.getState();

      if (slides.length === 0) {
        throw new Error("No slides to export");
      }

      const toastId = toast({
        title: "Exporting Presentation",
        description: (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>
              {format === "pptx" ? "Scanning slides..." : "Rendering slides..."}
            </span>
          </div>
        ),
        duration: Infinity,
      });

      const baseName = currentPresentationTitle ?? "presentation";

      if (format === "pptx") {
        const scanResults = await scanAllSlides(slides);
        if (scanResults.length === 0) {
          throw new Error(
            "Failed to scan slides. Please ensure all slides are visible on the page.",
          );
        }
        toastId.update({
          description: (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating PowerPoint...</span>
            </div>
          ),
        });
        exportResultRef.current = await exportPresentationToPptx(
          scanResults,
          slides,
          baseName,
        );
      } else {
        const blob = await exportPresentationToPdf(slides, baseName);
        exportResultRef.current = { blob, fileName: `${baseName}.pdf` };
      }

      toastId.update({
        title: "Export Complete",
        description: (
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => {
              handleDownload();
              toastId.dismiss();
            }}
          >
            <Download className="mr-1 h-4 w-4" />
            Download {format === "pptx" ? "PowerPoint" : "PDF"}
          </Button>
        ),
        duration: 15000,
      });

      setIsExportDialogOpen(false);
    } catch (error) {
      toast({
        title: "Export Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error exporting your presentation.",
        variant: "destructive",
      });
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 px-0 text-muted-foreground hover:text-foreground sm:h-9 sm:w-auto sm:gap-1.5 sm:px-3"
          aria-label="Export presentation"
        >
          <SaveStatus className="absolute top-1 right-1 sm:static" />
          <Download className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Presentation</DialogTitle>
          <DialogDescription>
            Choose a format to export your presentation.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label className="mb-3 block text-sm font-medium">
            Export Format
          </Label>
          <RadioGroup
            value={format}
            onValueChange={(v) => setFormat(v as ExportFormat)}
            className="grid gap-3"
          >
            <div
              className={`flex cursor-pointer items-start space-x-4 rounded-xl border p-4 transition-colors ${
                format === "pptx"
                  ? "border-primary bg-accent/50 ring-1 ring-primary"
                  : "border-border hover:bg-muted/50"
              }`}
              onClick={() => setFormat("pptx")}
            >
              <RadioGroupItem value="pptx" id="pptx" className="mt-3" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileImage className="h-5 w-5" />
                  </div>
                  <div>
                    <Label
                      htmlFor="pptx"
                      className="block cursor-pointer text-base font-semibold"
                    >
                      PowerPoint (.pptx)
                    </Label>
                    <p className="text-sm leading-snug text-muted-foreground">
                      Editable PowerPoint file with text, images and layouts
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`flex cursor-pointer items-start space-x-4 rounded-xl border p-4 transition-colors ${
                format === "pdf"
                  ? "border-primary bg-accent/50 ring-1 ring-primary"
                  : "border-border hover:bg-muted/50"
              }`}
              onClick={() => setFormat("pdf")}
            >
              <RadioGroupItem value="pdf" id="pdf" className="mt-3" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileDown className="h-5 w-5" />
                  </div>
                  <div>
                    <Label
                      htmlFor="pdf"
                      className="block cursor-pointer text-base font-semibold"
                    >
                      PDF (.pdf)
                    </Label>
                    <p className="text-sm leading-snug text-muted-foreground">
                      Fixed-layout PDF document, best for sharing and printing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsExportDialogOpen(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              `Export to ${format === "pptx" ? "PowerPoint" : "PDF"}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
