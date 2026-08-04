import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  createPlayerProfileOnboardingSchema,
  type PlayerProfileOnboardingInput,
  type PlayerProfileOnboardingValues,
} from "../player-profile-onboarding-prototype.schemas";
import type {
  UsePlayerProfileOnboardingPrototypeOptions,
  UsePlayerProfileOnboardingPrototypeResult,
} from "../player-profile-onboarding-prototype.types";
import { isLevelValidForSport } from "../player-profile-onboarding-prototype.utils";

const simulatedSaveDelayMs = 650;

function waitForSimulatedSave() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, simulatedSaveDelayMs);
  });
}

function usePlayerProfileOnboardingPrototype({
  initialState,
  levelScales,
  onSaved,
  scenarioId,
  sports,
}: UsePlayerProfileOnboardingPrototypeOptions): UsePlayerProfileOnboardingPrototypeResult {
  const t = useTranslations("PlayerProfileOnboardingPrototype.validation");
  const schema = useMemo(
    () =>
      createPlayerProfileOnboardingSchema({
        messages: {
          displayNameRequired: t("displayNameRequired"),
          displayNameMin: t("displayNameMin"),
          displayNameMax: t("displayNameMax"),
          sportRequired: t("sportRequired"),
          levelRequired: t("levelRequired"),
        },
        isLevelValidForSport: (sportId, levelId) =>
          isLevelValidForSport(sports, levelScales, sportId, levelId),
      }),
    [levelScales, sports, t],
  );
  const form = useForm<
    PlayerProfileOnboardingInput,
    unknown,
    PlayerProfileOnboardingValues
  >({
    defaultValues: { ...initialState.values },
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
    shouldFocusError: true,
  });

  useEffect(() => {
    form.reset({ ...initialState.values });

    if (initialState.forceValidation) {
      void form.trigger();
    }
  }, [form, initialState, scenarioId]);

  function focusFirstError(
    errors: UsePlayerProfileOnboardingPrototypeResult["errors"],
  ) {
    if (errors.displayName) {
      form.setFocus("displayName");
      return;
    }

    if (errors.mainSportId) {
      form.setFocus("mainSportId");
      return;
    }

    if (errors.mainSportLevelId) {
      form.setFocus("mainSportLevelId");
    }
  }

  function handleSportChange(sportId: string) {
    const currentSportId = form.getValues("mainSportId");

    form.setValue("mainSportId", sportId, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: Boolean(form.formState.errors.mainSportId),
    });

    if (currentSportId !== sportId) {
      form.setValue("mainSportLevelId", "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: Boolean(form.formState.errors.mainSportLevelId),
      });
    }
  }

  async function handleValidSubmit(values: PlayerProfileOnboardingValues) {
    form.clearErrors("root");
    await waitForSimulatedSave();
    onSaved(values);
  }

  return {
    form,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    handleSubmit: form.handleSubmit(handleValidSubmit, focusFirstError),
    handleSportChange,
    focusFirstError,
  };
}

export { usePlayerProfileOnboardingPrototype };
