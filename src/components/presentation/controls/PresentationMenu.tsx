"use client";

import {
  createBlankPresentation,
  duplicatePresentation,
} from "@/app/_actions/notebook/presentation/presentationActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePresentationHistoryState } from "@/states/presentation-history-state";
import { usePresentationState } from "@/states/presentation-state";
import { useMutation } from "@tanstack/react-query";
import {
  Copy,
  FileEdit,
  FolderOpen,
  Menu,
  Palette,
  Plus,
  Redo,
  Settings,
  Undo,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export function PresentationMenu({
  readOnly = false,
}: {
  readOnly?: boolean;
}) {
  const currentPresentationId = usePresentationState(
    (state) => state.currentPresentationId,
  );
  const setCurrentPresentation = usePresentationState(
    (state) => state.setCurrentPresentation,
  );
  const setActiveRightPanel = usePresentationState(
    (state) => state.setActiveRightPanel,
  );
  const undo = usePresentationHistoryState((state) => state.undo);
  const redo = usePresentationHistoryState((state) => state.redo);
  const canUndo = usePresentationHistoryState((state) => state.canUndo);
  const canRedo = usePresentationHistoryState((state) => state.canRedo);
  const router = useRouter();

  const { mutateAsync: duplicatePresentationMutation, isPending: isDuplicating } =
    useMutation({
      mutationFn: async () => {
        if (!currentPresentationId) {
          toast.error("Текущая презентация недоступна");
          throw new Error("CURRENT_PRESENTATION_ID_MISSING");
        }

        return duplicatePresentation(currentPresentationId);
      },
      onSuccess: (data) => {
        if (data.success && data.presentation) {
          setCurrentPresentation(data.presentation.id, data.presentation.title);
          router.push(`/presentation/${data.presentation.id}`);
          return;
        }

        toast.error(data.message);
      },
      onError: () => {
        toast.error("Не удалось дублировать презентацию");
      },
    });

  const {
    mutateAsync: createBlankPresentationMutation,
    isPending: isCreatingBlank,
  } = useMutation({
    mutationFn: async () => {
      const theme = usePresentationState.getState().theme;
      const language = usePresentationState.getState().language;

      return createBlankPresentation(
        "Презентация без названия",
        theme ??
          (localStorage.getItem("theme") === "dark" ? "ebony" : "mystique"),
        language,
      );
    },
    onSuccess: (data) => {
      if (data.success && data.presentation) {
        setCurrentPresentation(data.presentation.id, data.presentation.title);
        router.push(`/presentation/${data.presentation.id}`);
        return;
      }

      toast.error(data.message);
    },
    onError: () => {
      toast.error("Не удалось создать презентацию");
    },
  });

  const focusTitleInput = useCallback(() => {
    window.setTimeout(() => {
      const presentationTitleInput = document.getElementById(
        "presentation-title-input",
      );
      presentationTitleInput?.focus();
    }, 250);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Открыть меню презентации"
          className="rounded-full"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2">
        <div className="px-2 py-1.5 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Файл
        </div>
        <DropdownMenuItem
          disabled={isCreatingBlank}
          onClick={() => void createBlankPresentationMutation()}
          className="rounded-md"
        >
          <Plus className="mr-2 h-4 w-4" />
          Новая презентация
        </DropdownMenuItem>
        {!readOnly ? (
          <DropdownMenuItem onClick={focusTitleInput} className="rounded-md">
            <FileEdit className="mr-2 h-4 w-4" />
            Переименовать
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          disabled={isDuplicating}
          onClick={() => void duplicatePresentationMutation()}
          className="rounded-md"
        >
          <Copy className="mr-2 h-4 w-4" />
          {readOnly ? "Клонировать в мой аккаунт" : "Дублировать"}
        </DropdownMenuItem>

        {!readOnly ? (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Правка
            </div>
            <DropdownMenuItem
              disabled={!canUndo}
              onClick={undo}
              className="rounded-md"
            >
              <Undo className="mr-2 h-4 w-4" />
              <span className="flex-1">Отменить</span>
              <span className="text-xs text-muted-foreground">Ctrl+Z</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!canRedo}
              onClick={redo}
              className="rounded-md"
            >
              <Redo className="mr-2 h-4 w-4" />
              <span className="flex-1">Повторить</span>
              <span className="text-xs text-muted-foreground">Ctrl+Y</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Рабочее пространство
            </div>
            <DropdownMenuItem
              onClick={() => setActiveRightPanel("globalSettings")}
              className="rounded-md"
            >
              <Settings className="mr-2 h-4 w-4" />
              Настройки страницы
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setActiveRightPanel("theme")}
              className="rounded-md"
            >
              <Palette className="mr-2 h-4 w-4" />
              Панель темы
            </DropdownMenuItem>
          </>
        ) : null}

        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Вид
        </div>
        {!readOnly ? (
          <DropdownMenuItem
            disabled={!currentPresentationId}
            onClick={() => {
              if (currentPresentationId) {
                router.push(`/presentation/generate/${currentPresentationId}`);
              }
            }}
            className="rounded-md"
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            Назад к запросу
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          onClick={() => router.push("/presentation")}
          className="rounded-md"
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          Все презентации
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
