"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updatePresentation } from "@/app/_actions/notebook/presentation/presentationActions";
import {
  createCustomTheme,
  updateAdminPresentationTheme,
  updateCustomTheme,
} from "@/app/_actions/presentation/theme-actions";
import { useThemePanelState } from "@/components/presentation/edit-panel/sections/theme/theme-panel-state";
import {
  Credenza,
  CredenzaContent,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { buildPresentationCustomization } from "@/lib/presentation/customization";
import { isBuiltInPresentationTheme } from "@/lib/presentation/theme-resolution";
import { themes, type ThemeColorsKeys } from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { type ThemeFormValues } from "../types";
import { colorThemes, type PreviewTab } from "./create-theme-types";
import { CreateThemeFooter } from "./CreateThemeFooter";
import { CreateThemeHeader } from "./CreateThemeHeader";
import { PreviewSection } from "./PreviewSection";
import { StepContent } from "./StepContent";
import { usePreviewData } from "./usePreviewData";
import { useStepNavigation } from "./useStepNavigation";
import { useThemeCreationLogic } from "./useThemeCreationLogic";

const DEFAULT_THEME_VALUES: ThemeFormValues = {
  isPublic: false,
  themeBase: "blank",
  ...themes.mystique,
  background: undefined,
  description: "",
  name: "",
};

interface CreateThemeModalProps {
  previewMode?: "all" | "test-only";
}

export function CreateThemeModal({
  previewMode = "all",
}: CreateThemeModalProps) {
  const {
    setOpenCreateThemeModal,
    openCreateThemeModal,
    editingTheme,
    setEditingTheme,
    isCustomizing,
    setIsCustomizing,
    importedThemeData,
    setImportedThemeData,
  } = useThemePanelState();

  const [previewTab, setPreviewTab] = useState<PreviewTab>("current");
  const previewTabs = useMemo<PreviewTab[]>(
    () => (previewMode === "test-only" ? ["test"] : ["test", "current"]),
    [previewMode],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentPresentationId = usePresentationState(
    (s) => s.currentPresentationId,
  );
  const baseThemeData = editingTheme?.baseThemeData ?? editingTheme?.themeData;

  // Prepare default values based on imported theme, editing theme, or default
  const defaultValues = useMemo(() => {
    // Imported theme data from PPTX file
    if (importedThemeData) {
      return {
        isPublic: false,
        themeBase: "blank" as const,
        ...importedThemeData,
        description: importedThemeData.description || "",
      };
    }

    if (editingTheme) {
      // Get the base name, falling back to themeData name or "Пользовательская тема"
      const baseName =
        editingTheme.name || editingTheme.themeData?.name || "Пользовательская тема";

      if (isCustomizing) {
        // When customizing, use the theme data and prefill name with "Copy of {theme name}"
        // Only prepend "Copy of" if it's not already there
        const name = baseName.startsWith("Копия ")
          ? baseName
          : `Copy of ${baseName}`;

        return {
          isPublic: false,
          themeBase: "blank" as const,
          ...editingTheme.themeData,
          description: "",
          name,
        };
      }
      // Normal editing
      return {
        isPublic: editingTheme.isPublic,
        themeBase: "blank" as const,
        ...editingTheme.themeData,
        description: editingTheme.description || "",
        name: baseName,
      };
    }
    return DEFAULT_THEME_VALUES;
  }, [editingTheme, isCustomizing, importedThemeData]);

  // Form
  const form = useForm<ThemeFormValues>({
    defaultValues,
    values: defaultValues, // Ensure form updates when editingTheme changes
  });
  const { control, handleSubmit, setValue, reset } = form;
  const {
    selectedColorTheme,
    applyThemePreset,
    linkedColorChange,
    setSelectedColorTheme,
    setShowAdvancedColors,
  } = useThemeCreationLogic({
    setValue,
    initialTheme: baseThemeData,
  });

  const handleClose = () => {
    setOpenCreateThemeModal(false);
    setEditingTheme(null);
    setIsCustomizing(false);
    setImportedThemeData(null);
  };

  const queryClient = useQueryClient();

  // Submit handler for creating new themes (used when navigating to save step and submitting)
  const onSubmit = async (data: ThemeFormValues) => {
    try {
      setIsSubmitting(true);
      const {
        name,
        description,
        isPublic: _isPublic,
        themeBase: _themeBase,
        ...themeStyleData
      } = data;

      // Validate custom font URLs
      const fonts = themeStyleData.fonts as ThemeFormValues["fonts"];

      if (fonts.headingUrl && !fonts.headingUrl.match(/^https?:\/\/.+/)) {
        toast.error("Некорректный URL шрифта заголовков", {
          description: "Проверьте URL шрифта или удалите его.",
        });
        setIsSubmitting(false);
        return;
      }

      if (fonts.bodyUrl && !fonts.bodyUrl.match(/^https?:\/\/.+/)) {
        toast.error("Некорректный URL основного шрифта", {
          description: "Проверьте URL шрифта или удалите его.",
        });
        setIsSubmitting(false);
        return;
      }

      let result;
      // When editing (and NOT customizing), update the existing theme
      if (editingTheme && !isCustomizing) {
        const updateTheme = editingTheme.isAdmin
          ? updateAdminPresentationTheme
          : updateCustomTheme;

        result = await updateTheme(editingTheme.id, {
          name,
          description,
          isPublic: false,
          themeData: themeStyleData,
        });
      } else {
        if (isCustomizing) {
          if (!currentPresentationId) {
            toast.error("Не выбрана презентация");
            setIsSubmitting(false);
            return;
          }

          // Get original theme name (from built-in themes)
          const currentThemeId = usePresentationState.getState().theme;
          const builtInTheme = themes[currentThemeId as keyof typeof themes];
          const originalThemeName =
            builtInTheme?.name ||
            editingTheme?.themeData?.name ||
            String(currentThemeId) ||
            "Пользовательская тема";

          // Use the user's input if provided, otherwise use "Copy of {original}"
          const themeName = name || `Copy of ${originalThemeName}`;

          // Creating new theme from customization
          const createResult = await createCustomTheme({
            name: themeName,
            description: description || "",
            isPublic: false,
            themeData: themeStyleData,
          });

          if (createResult.success && createResult.themeId) {
            const createdThemeData = {
              ...themeStyleData,
              name: themeName,
              description: description || "",
            };

            // Apply the new theme to the presentation
            usePresentationState
              .getState()
              .setTheme(createResult.themeId, createdThemeData);

            // Update the presentation to use the new theme
            result = await updatePresentation({
              id: currentPresentationId,
              theme: createResult.themeId,
            });
          } else {
            result = createResult;
          }
        } else {
          // Creating new theme (from scratch)
          result = await createCustomTheme({
            name,
            description,
            isPublic: false,
            themeData: themeStyleData,
          });
        }
      }

      if (result.success) {
        if (editingTheme && !isCustomizing) {
          const currentThemeId = usePresentationState.getState().theme;
          if (currentThemeId === editingTheme.id) {
            usePresentationState.getState().setTheme(editingTheme.id, {
              ...themeStyleData,
              name,
              description: description ?? "",
            });
          }
        }

        toast.success(
          editingTheme && !isCustomizing
            ? editingTheme.isAdmin
              ? "Системная тема обновлена!"
              : "Тема обновлена!"
            : isCustomizing
              ? "Кастомизация сохранена!"
              : "Тема создана!",
        );

        // Invalidate queries to refresh the list
        queryClient.invalidateQueries({
          queryKey: ["presentation", "themes", "user"],
        });
        queryClient.invalidateQueries({
          queryKey: ["presentation", "themes", "public"],
        });
        queryClient.invalidateQueries({
          queryKey: ["presentation", "themes", "favorites"],
        });
        queryClient.invalidateQueries({
          queryKey: ["presentation", "themes", "system"],
        });

        handleClose();
      } else {
        toast.error(result.message || "Не удалось сохранить тему");
      }
    } catch {
      toast.error("Произошла неожиданная ошибка при сохранении темы");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { currentStep, handleContinue, handleBack, setCurrentStep } =
    useStepNavigation({
      onClose: handleClose,
      handleSubmit,
      onSubmit,
    });

  // Handler for "Save" - save customization directly to the current presentation
  const handleSaveCustomization = useCallback(async () => {
    if (!currentPresentationId) {
      toast.error("Не выбрана презентация для кастомизации");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = form.getValues();
      // Strip form-only fields that aren't part of ThemeProperties
      const {
        description,
        isPublic: _isPublic,
        themeBase: _themeBase,
        name: _name,
        ...themeStyleData
      } = data;

      // Validate custom font URLs
      const fonts = themeStyleData.fonts as ThemeFormValues["fonts"];

      if (fonts.headingUrl && !fonts.headingUrl.match(/^https?:\/\/.+/)) {
        toast.error("Некорректный URL шрифта заголовков", {
          description: "Проверьте URL шрифта или удалите его.",
        });
        setIsSubmitting(false);
        return;
      }

      if (fonts.bodyUrl && !fonts.bodyUrl.match(/^https?:\/\/.+/)) {
        toast.error("Некорректный URL основного шрифта", {
          description: "Проверьте URL шрифта или удалите его.",
        });
        setIsSubmitting(false);
        return;
      }

      // Get original theme name (from built-in themes, not the "Copy of..." form value)
      const currentThemeId = usePresentationState.getState().theme;
      const builtInTheme = themes[currentThemeId as keyof typeof themes];
      const originalThemeName =
        builtInTheme?.name || editingTheme?.themeData?.name || "Пользовательская тема";

      const customThemeData = {
        ...themeStyleData,
        name: originalThemeName,
        description: description || originalThemeName,
      };

      const currentTheme = usePresentationState.getState().theme as string;

      const currentThemeDataByTheme =
        usePresentationState.getState().themeDataByTheme;
      const nextThemeDataByTheme = {
        ...currentThemeDataByTheme,
        [currentTheme]: customThemeData,
      };
      usePresentationState.getState().setThemeDataByTheme(nextThemeDataByTheme);

      // Update the presentation state with new theme data
      usePresentationState.getState().setTheme(currentTheme, customThemeData);

      // Build customization object
      const state = usePresentationState.getState();
      const customization = buildPresentationCustomization({
        customThemeData,
        themeDataByTheme: nextThemeDataByTheme,
        generatedThemeData: state.generatedThemeData,
        theme: state.theme,
        pageStyle: state.pageStyle,
        presentationStyle: state.presentationStyle,
        generationAspectRatio: state.generationAspectRatio,
        textContent: state.textContent,
        tone: state.tone,
        audience: state.audience,
        scenario: state.scenario,
        pageBackground: state.pageBackground,
        selectedSlideTemplates: state.selectedSlideTemplates,
        outlineItemIds: state.outlineItemIds,
        outlineTemplateOverrides: state.outlineTemplateOverrides,
      });

      // Save to the presentation
      const result = await updatePresentation({
        id: currentPresentationId,
        theme: state.theme as string,
        customization,
      });

      if (result.success) {
        toast.success("Кастомизация сохранена!");
        handleClose();
      } else {
        toast.error(result.message || "Не удалось сохранить кастомизацию");
      }
    } catch {
      toast.error("Произошла неожиданная ошибка при сохранении");
    } finally {
      setIsSubmitting(false);
    }
  }, [currentPresentationId, form, handleClose]);

  const handleSaveCurrentStep = useCallback(() => {
    if (editingTheme && !isCustomizing) {
      void handleSubmit(onSubmit)();
      return;
    }

    void handleSaveCustomization();
  }, [
    editingTheme,
    handleSaveCustomization,
    handleSubmit,
    isCustomizing,
    onSubmit,
  ]);

  const handleResetCustomization = useCallback(async () => {
    if (!currentPresentationId) {
      toast.error("Не выбрана презентация для сброса");
      return;
    }

    const state = usePresentationState.getState();
    const currentTheme = state.theme as string;
    const resetThemeData = baseThemeData ?? null;
    const nextThemeDataByTheme = { ...state.themeDataByTheme };
    delete nextThemeDataByTheme[currentTheme];

    try {
      setIsSubmitting(true);
      usePresentationState.getState().setThemeDataByTheme(nextThemeDataByTheme);
      usePresentationState
        .getState()
        .setTheme(
          currentTheme,
          isBuiltInPresentationTheme(currentTheme) ? null : resetThemeData,
        );
      if (resetThemeData) {
        reset({
          isPublic: false,
          themeBase: "blank",
          ...resetThemeData,
          description: resetThemeData.description || "",
          name: resetThemeData.name || editingTheme?.name || "Пользовательская тема",
        });
      }

      const customization = buildPresentationCustomization({
        customThemeData: isBuiltInPresentationTheme(currentTheme)
          ? null
          : resetThemeData,
        themeDataByTheme: nextThemeDataByTheme,
        generatedThemeData: state.generatedThemeData,
        theme: currentTheme,
        pageStyle: state.pageStyle,
        presentationStyle: state.presentationStyle,
        generationAspectRatio: state.generationAspectRatio,
        textContent: state.textContent,
        tone: state.tone,
        audience: state.audience,
        scenario: state.scenario,
        pageBackground: state.pageBackground,
        selectedSlideTemplates: state.selectedSlideTemplates,
        outlineItemIds: state.outlineItemIds,
        outlineTemplateOverrides: state.outlineTemplateOverrides,
      });

      const result = await updatePresentation({
        id: currentPresentationId,
        theme: currentTheme,
        customization,
      });

      if (result.success) {
        toast.success("Кастомизация сброшена!");
        handleClose();
      } else {
        toast.error(result.message || "Не удалось сбросить кастомизацию");
      }
    } catch {
      toast.error("Произошла неожиданная ошибка при сбросе");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    baseThemeData,
    currentPresentationId,
    editingTheme?.name,
    handleClose,
    reset,
  ]);

  // Handler for "Save & Create New" - create a new theme copy and apply it
  const handleSaveAndCreateNew = useCallback(async () => {
    if (!currentPresentationId) {
      toast.error("Не выбрана презентация");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = form.getValues();
      const {
        description,
        isPublic: _isPublic,
        themeBase: _themeBase,
        name,
        ...themeStyleData
      } = data;

      // Validate custom font URLs
      const fonts = themeStyleData.fonts as ThemeFormValues["fonts"];

      if (fonts.headingUrl && !fonts.headingUrl.match(/^https?:\/\/.+/)) {
        toast.error("Некорректный URL шрифта заголовков", {
          description: "Проверьте URL шрифта или удалите его.",
        });
        setIsSubmitting(false);
        return;
      }

      if (fonts.bodyUrl && !fonts.bodyUrl.match(/^https?:\/\/.+/)) {
        toast.error("Некорректный URL основного шрифта", {
          description: "Проверьте URL шрифта или удалите его.",
        });
        setIsSubmitting(false);
        return;
      }

      // Get original theme name (from built-in themes)
      const currentThemeId = usePresentationState.getState().theme;
      const builtInTheme = themes[currentThemeId as keyof typeof themes];
      const originalThemeName =
        builtInTheme?.name ||
        editingTheme?.themeData?.name ||
        String(currentThemeId) ||
        "Пользовательская тема";

      // Use the user's input if provided, otherwise use "Copy of {original}"
      const themeName = name || `Copy of ${originalThemeName}`;

      // Create the new theme
      const createResult = await createCustomTheme({
        name: themeName,
        description: description || "",
        isPublic: false, // Always private for customization copies
        themeData: themeStyleData,
      });

      if (createResult.success && createResult.themeId) {
        const createdThemeData = {
          ...themeStyleData,
          name: themeName,
          description: description || "",
        };

        // Apply the new theme to the presentation
        usePresentationState
          .getState()
          .setTheme(createResult.themeId, createdThemeData);

        // Update the presentation to use the new theme
        const result = await updatePresentation({
          id: currentPresentationId,
          theme: createResult.themeId,
        });

        if (result.success) {
          toast.success("Новая тема создана и применена!");

          // Invalidate queries to refresh the theme list
          queryClient.invalidateQueries({
            queryKey: ["presentation", "themes", "user"],
          });
          queryClient.invalidateQueries({
            queryKey: ["presentation", "themes", "public"],
          });
          queryClient.invalidateQueries({
            queryKey: ["presentation", "themes", "favorites"],
          });

          handleClose();
        } else {
          toast.error(result.message || "Не удалось применить новую тему");
        }
      } else {
        toast.error(createResult.message || "Не удалось создать новую тему");
      }
    } catch {
      toast.error("Произошла неожиданная ошибка");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentPresentationId,
    editingTheme?.name,
    form,
    handleClose,
    queryClient,
  ]);

  // Reset form when modal opens/closes or editingTheme/isCustomizing/importedThemeData changes
  useEffect(() => {
    if (openCreateThemeModal) {
      reset(defaultValues);
      setPreviewTab(previewMode === "test-only" ? "test" : "current");
      setCurrentStep("colors");
      setSelectedColorTheme(
        editingTheme || importedThemeData
          ? "custom-theme"
          : (colorThemes[0]?.id ?? "custom-theme"),
      );
      setShowAdvancedColors(false);
    }
  }, [
    openCreateThemeModal,
    editingTheme,
    isCustomizing,
    importedThemeData,
    previewMode,
    reset,
    defaultValues,
    setCurrentStep,
    setSelectedColorTheme,
    setShowAdvancedColors,
  ]);

  const currentSlides = usePresentationState((s) => s.slides);
  const { previewThemeData, slidesToDisplay } = usePreviewData({
    control,
    previewTab,
    currentSlides,
  });

  // Handlers for StepContent
  const handleColorChange = (key: ThemeColorsKeys, value: string) => {
    linkedColorChange(key, value);
  };

  const handleThemeSelect = (themeId: string) => {
    applyThemePreset(themeId);
  };

  return (
    <Credenza
      open={openCreateThemeModal}
      onOpenChange={setOpenCreateThemeModal}
    >
      <CredenzaContent
        shouldHaveClose={false}
        overlayClassName="z-40"
        className="z-50 h-dvh max-h-none w-dvw max-w-none border-none p-0"
      >
        <VisuallyHidden>
          <CredenzaTitle>Создание темы</CredenzaTitle>
        </VisuallyHidden>
        <div className="flex h-full flex-col lg:flex-row">
          {/* Left Panel - Editor */}
          <div className="flex w-full flex-col border-b border-border lg:w-1/2 lg:border-r lg:border-b-0">
            <CreateThemeHeader
              currentStep={currentStep}
              onBack={handleBack}
              onClose={handleClose}
            />
            <div className="h-[calc(100vh-2*70px)] overflow-y-auto">
              <StepContent
                step={currentStep}
                control={control}
                selectedColorTheme={selectedColorTheme}
                onColorChange={handleColorChange}
                onSelectColorTheme={handleThemeSelect}
                setValue={setValue}
                isCustomizing={isCustomizing}
                defaultColors={baseThemeData?.colors}
              />
            </div>
            <CreateThemeFooter
              currentStep={currentStep}
              isSubmitting={isSubmitting}
              onStepClick={setCurrentStep}
              onContinue={handleContinue}
              onSave={handleSaveCurrentStep}
              onSaveAndCreateNew={handleSaveAndCreateNew}
              onResetCustomization={
                isCustomizing ? handleResetCustomization : undefined
              }
              isEditing={!!editingTheme}
              isCustomizing={isCustomizing}
            />
          </div>

          {/* Right Panel - Preview */}
          <PreviewSection
            containerRef={containerRef}
            previewTab={previewTab}
            previewTabs={previewTabs}
            previewThemeData={previewThemeData}
            slidesToDisplay={slidesToDisplay}
            onTabChange={setPreviewTab}
          />
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
