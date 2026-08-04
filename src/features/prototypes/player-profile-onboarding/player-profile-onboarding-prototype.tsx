"use client";

import {
  ArrowRightIcon,
  CheckCircleIcon,
  InfoIcon,
  SignInIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { BrandLockup } from "@/components/shared/brand";
import { LoadingRegion } from "@/components/shared/loading-region/loading-region";
import { PageState } from "@/components/shared/page-state/page-state";
import { PendingButton } from "@/components/shared/pending-button/pending-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ExitConfirmationDialog } from "./components/exit-confirmation-dialog";
import { PrototypeScenarioController } from "./components/prototype-scenario-controller";
import { SelectionCardRadioGroup } from "./components/selection-card-radio-group";
import { SportCatalogSearch } from "./components/sport-catalog-search";
import {
  CONFLICT_SERVER_VALUES,
  DEFAULT_LEVEL_SCALES,
  getSportsForScenario,
  scenarioActionFeedback,
  scenarioFormStates,
  scenarioRouteOutcomes,
} from "./player-profile-onboarding-prototype.constants";
import { prototypeStyles } from "./player-profile-onboarding-prototype.styles";
import type {
  ActionFeedback,
  PrototypeScenarioId,
  RouteOutcome,
} from "./player-profile-onboarding-prototype.types";
import {
  findSport,
  getLevelsForSport,
} from "./player-profile-onboarding-prototype.utils";
import { usePlayerProfileOnboardingPrototype } from "./hooks/use-player-profile-onboarding-prototype";

function OnboardingLoadingState() {
  const t = useTranslations("PlayerProfileOnboardingPrototype.states");

  return (
    <LoadingRegion
      label={t("loadingProfile")}
      className={prototypeStyles.loading}
    >
      <div className={prototypeStyles.skeletonBlock}>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className={prototypeStyles.skeletonBlock}>
        <Skeleton className="h-5 w-48" />
        <div className={prototypeStyles.skeletonGrid}>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      </div>
      <div className={prototypeStyles.skeletonBlock}>
        <Skeleton className="h-5 w-56" />
        <div className={prototypeStyles.skeletonLevelGrid}>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
      </div>
    </LoadingRegion>
  );
}

type FeedbackAlertProps = Readonly<{
  feedback: ActionFeedback;
  interactive: boolean;
  alertRef: React.RefObject<HTMLDivElement | null>;
  onClear: () => void;
  onReload: () => void;
  onVerify: () => void;
}>;

function FeedbackAlert({
  alertRef,
  feedback,
  interactive,
  onClear,
  onReload,
  onVerify,
}: FeedbackAlertProps) {
  const t = useTranslations("PlayerProfileOnboardingPrototype");
  const isSuccess = feedback.kind === "success";
  const isInfo = feedback.kind === "info";
  const variant =
    isSuccess || isInfo
      ? isSuccess
        ? "success"
        : "info"
      : feedback.kind === "knownFailure"
        ? "destructive"
        : "warning";
  const Icon = isSuccess
    ? CheckCircleIcon
    : isInfo
      ? InfoIcon
      : WarningCircleIcon;

  return (
    <Alert
      ref={alertRef}
      tabIndex={interactive && !isSuccess ? -1 : undefined}
      role={interactive ? (isSuccess ? "status" : "alert") : undefined}
      variant={variant}
      className={prototypeStyles.alert}
    >
      <Icon aria-hidden="true" />
      <AlertTitle>{t(`feedback.${feedback.kind}.title`)}</AlertTitle>
      <AlertDescription>
        <p>{t(`feedback.${feedback.kind}.description`)}</p>
        {feedback.kind === "knownFailure" || feedback.kind === "rateLimit" ? (
          <div className={prototypeStyles.alertActions}>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="min-h-11"
              onClick={onClear}
            >
              {t("actions.retry")}
            </Button>
          </div>
        ) : null}
        {feedback.kind === "unknownOutcome" ? (
          <div className={prototypeStyles.alertActions}>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="min-h-11"
              onClick={onVerify}
            >
              {t("actions.verifyProfile")}
            </Button>
          </div>
        ) : null}
        {feedback.kind === "conflict" ? (
          <div className={prototypeStyles.alertActions}>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="min-h-11"
              onClick={onReload}
            >
              {t("actions.reloadProfile")}
            </Button>
          </div>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}

type RouteOutcomePanelProps = Readonly<{
  outcome: RouteOutcome;
  standalone?: boolean;
  onReturnToForm?: () => void;
}>;

function RouteOutcomePanel({
  onReturnToForm,
  outcome,
  standalone,
}: RouteOutcomePanelProps) {
  const t = useTranslations("PlayerProfileOnboardingPrototype");
  const Icon = outcome.kind === "signIn" ? SignInIcon : ArrowRightIcon;

  if (standalone) {
    return (
      <Card className={prototypeStyles.outcome}>
        <CardContent>
          <PageState
            headingLevel={2}
            tone={outcome.kind === "rejectedContinuation" ? "info" : "success"}
            Icon={Icon}
            eyebrow={t("routing.eyebrow")}
            title={t(`routing.${outcome.kind}.title`)}
            description={t(`routing.${outcome.kind}.description`)}
            primaryAction={
              onReturnToForm ? (
                <Button type="button" size="lg" onClick={onReturnToForm}>
                  {outcome.kind === "signIn"
                    ? t("actions.signInAgain")
                    : t("actions.returnToForm")}
                </Button>
              ) : undefined
            }
          />
          <div className="mx-auto mb-6 max-w-xl px-5">
            <div className={prototypeStyles.routeCard}>
              <span>{t("routing.destinationLabel")}</span>
              <code className={prototypeStyles.routeCode}>
                {outcome.destination}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={prototypeStyles.routeCard}>
      <span>{t(`routing.${outcome.kind}.compact`)}</span>
      <code className={prototypeStyles.routeCode}>{outcome.destination}</code>
    </div>
  );
}

function PlayerProfileOnboardingPrototype() {
  const t = useTranslations("PlayerProfileOnboardingPrototype");
  const scenarioT = useTranslations(
    "PlayerProfileOnboardingPrototype.scenarios",
  );
  const [scenarioId, setScenarioId] =
    useState<PrototypeScenarioId>("defaultEmpty");
  const [interactiveFeedback, setInteractiveFeedback] =
    useState<ActionFeedback>();
  const [interactiveOutcome, setInteractiveOutcome] = useState<RouteOutcome>();
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [scenarioAnnouncement, setScenarioAnnouncement] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const exitButtonRef = useRef<HTMLButtonElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const sports = useMemo(() => getSportsForScenario(scenarioId), [scenarioId]);
  const initialState = scenarioFormStates[scenarioId];
  const staticFeedback = scenarioActionFeedback[scenarioId];
  const staticOutcome = scenarioRouteOutcomes[scenarioId];
  const feedback = interactiveFeedback ?? staticFeedback;
  const routeOutcome =
    interactiveOutcome ??
    staticOutcome ??
    (scenarioId === "success"
      ? {
          kind: "authorizedContinuation" as const,
          destination: "/app/reservations",
        }
      : undefined);

  const { errors, form, handleSportChange, handleSubmit, isSubmitting } =
    usePlayerProfileOnboardingPrototype({
      scenarioId,
      sports,
      levelScales: DEFAULT_LEVEL_SCALES,
      initialState,
      onSaved: () => {
        setInteractiveFeedback({ kind: "success" });
        setInteractiveOutcome({
          kind: "authorizedContinuation",
          destination: "/app/reservations",
        });
      },
    });

  const selectedSportId = form.watch("mainSportId");
  const selectedSport = findSport(sports, selectedSportId);
  const levels = getLevelsForSport(
    sports,
    DEFAULT_LEVEL_SCALES,
    selectedSportId,
  );
  const isDirty = form.formState.isDirty;
  const isSaving = isSubmitting || scenarioId === "saving";
  const sportsUnavailable =
    scenarioId === "sportsReadFailure" || scenarioId === "emptySportCatalog";
  const isStandaloneOutcome = Boolean(
    staticOutcome || scenarioId === "expiredSession",
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      headingRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (
      interactiveFeedback &&
      interactiveFeedback.kind !== "success" &&
      interactiveFeedback.kind !== "info"
    ) {
      alertRef.current?.focus();
    }
  }, [interactiveFeedback]);

  function changeScenario(nextScenarioId: PrototypeScenarioId) {
    setInteractiveFeedback(undefined);
    setInteractiveOutcome(undefined);
    setExitDialogOpen(
      Boolean(scenarioFormStates[nextScenarioId].openExitDialog),
    );
    setScenarioAnnouncement(
      t("prototype.scenarioChanged", {
        scenario: scenarioT(`${nextScenarioId}.label`),
      }),
    );
    setScenarioId(nextScenarioId);
  }

  function handleExit() {
    if (isDirty || scenarioId === "exitConfirmation") {
      setExitDialogOpen(true);
      return;
    }

    setInteractiveOutcome({ kind: "publicFallback", destination: "/" });
  }

  function confirmExit() {
    form.reset();
    setExitDialogOpen(false);
    setInteractiveOutcome({ kind: "publicFallback", destination: "/" });
  }

  function clearFeedback() {
    setInteractiveFeedback({ kind: "info" });
  }

  function verifyProfile() {
    setInteractiveFeedback({ kind: "success" });
    setInteractiveOutcome({
      kind: "authorizedContinuation",
      destination: "/app/reservations",
    });
  }

  function reloadProfile() {
    form.reset({ ...CONFLICT_SERVER_VALUES });
    setInteractiveFeedback({ kind: "info" });
  }

  const displayNameDescriptionId = "onboarding-display-name-description";
  const displayNameErrorId = "onboarding-display-name-error";
  const sportDescriptionId = "onboarding-sport-description";
  const sportErrorId = "onboarding-sport-error";
  const levelDescriptionId = "onboarding-level-description";
  const levelErrorId = "onboarding-level-error";

  return (
    <div className={prototypeStyles.page}>
      <a href="#onboarding-content" className={prototypeStyles.skipLink}>
        {t("common.skipToContent")}
      </a>

      <header className={prototypeStyles.header}>
        <div className={prototypeStyles.headerInner}>
          <BrandLockup className={prototypeStyles.brand} markSize={36} />
          <Button
            ref={exitButtonRef}
            type="button"
            variant="ghost"
            size="lg"
            onClick={handleExit}
          >
            {t("actions.exit")}
          </Button>
        </div>
      </header>

      <PrototypeScenarioController
        scenarioId={scenarioId}
        onScenarioChange={changeScenario}
      />

      <p className="sr-only" role="status" aria-live="polite">
        {scenarioAnnouncement}
      </p>

      <main id="onboarding-content" className={prototypeStyles.main}>
        <div>
          <p className={prototypeStyles.eyebrow}>{t("page.eyebrow")}</p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className={`${prototypeStyles.title} ${prototypeStyles.pageHeading}`}
          >
            {t("page.title")}
          </h1>
          <p className={prototypeStyles.description}>{t("page.description")}</p>
          <p className={prototypeStyles.requiredNote}>
            {t("page.requiredNote")}
          </p>
        </div>

        {scenarioId === "initialLoading" ? <OnboardingLoadingState /> : null}

        {scenarioId === "profileReadFailure" ? (
          <Card className={prototypeStyles.outcome}>
            <CardContent>
              <PageState
                headingLevel={2}
                tone="destructive"
                Icon={WarningCircleIcon}
                title={t("states.profileReadFailureTitle")}
                description={t("states.profileReadFailure")}
                primaryAction={
                  <Button
                    type="button"
                    onClick={() => changeScenario("defaultEmpty")}
                  >
                    {t("actions.retry")}
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : null}

        {scenarioId === "expiredSession" ? (
          <RouteOutcomePanel
            standalone
            outcome={{ kind: "signIn", destination: "/sign-in" }}
            onReturnToForm={() => changeScenario("defaultEmpty")}
          />
        ) : null}

        {staticOutcome ? (
          <RouteOutcomePanel
            standalone
            outcome={staticOutcome}
            onReturnToForm={() => changeScenario("defaultEmpty")}
          />
        ) : null}

        {!isStandaloneOutcome &&
        scenarioId !== "initialLoading" &&
        scenarioId !== "profileReadFailure" ? (
          <Card className={prototypeStyles.panel}>
            <CardHeader className="sr-only">{t("form.title")}</CardHeader>
            <CardContent className={prototypeStyles.panelContent}>
              <form
                noValidate
                aria-busy={isSaving || undefined}
                onSubmit={handleSubmit}
              >
                <div className="space-y-8">
                  <section
                    className={prototypeStyles.section}
                    aria-labelledby="about-you-heading"
                  >
                    <h2
                      id="about-you-heading"
                      className={prototypeStyles.sectionHeading}
                    >
                      {t("identification.title")}
                    </h2>
                    <Field data-invalid={Boolean(errors.displayName)}>
                      <FieldLabel htmlFor="onboarding-display-name">
                        {t("identification.displayNameLabel")}
                      </FieldLabel>
                      <Input
                        {...form.register("displayName")}
                        id="onboarding-display-name"
                        className="h-11"
                        required
                        disabled={isSaving}
                        aria-invalid={Boolean(errors.displayName)}
                        aria-describedby={
                          errors.displayName
                            ? `${displayNameDescriptionId} ${displayNameErrorId}`
                            : displayNameDescriptionId
                        }
                        autoComplete="name"
                        placeholder={t("identification.displayNamePlaceholder")}
                      />
                      <FieldDescription id={displayNameDescriptionId}>
                        {t("identification.displayNameHelp")}
                      </FieldDescription>
                      {errors.displayName?.message ? (
                        <p
                          id={displayNameErrorId}
                          className={prototypeStyles.fieldError}
                        >
                          {errors.displayName.message}
                        </p>
                      ) : null}
                    </Field>
                  </section>

                  <section
                    className={prototypeStyles.section}
                    aria-labelledby="sport-profile-heading"
                  >
                    <div>
                      <p className={prototypeStyles.eyebrow}>
                        {t("selectors.eyebrow")}
                      </p>
                      <h2
                        id="sport-profile-heading"
                        className={`${prototypeStyles.sectionHeading} mt-1`}
                      >
                        {t("selectors.title")}
                      </h2>
                      <p className={prototypeStyles.sectionDescription}>
                        {t("selectors.description")}
                      </p>
                    </div>

                    <Controller
                      name="mainSportId"
                      control={form.control}
                      render={({ field }) => (
                        <FieldSet
                          disabled={isSaving}
                          aria-describedby={
                            errors.mainSportId
                              ? `${sportDescriptionId} ${sportErrorId}`
                              : sportDescriptionId
                          }
                        >
                          <FieldLegend>
                            {t("selectors.sportLegend")}
                          </FieldLegend>
                          <FieldDescription id={sportDescriptionId}>
                            {t("selectors.sportHelp")}
                          </FieldDescription>

                          {scenarioId === "sportsReadFailure" ? (
                            <Alert variant="destructive">
                              <WarningCircleIcon aria-hidden="true" />
                              <AlertTitle>
                                {t("states.sportsReadFailureTitle")}
                              </AlertTitle>
                              <AlertDescription>
                                <p>{t("states.sportsReadFailure")}</p>
                                <div className={prototypeStyles.alertActions}>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="min-h-11"
                                    onClick={() =>
                                      changeScenario("defaultEmpty")
                                    }
                                  >
                                    {t("actions.retry")}
                                  </Button>
                                </div>
                              </AlertDescription>
                            </Alert>
                          ) : sports.length === 0 ? (
                            <div className={prototypeStyles.inlineState}>
                              {t("states.emptySportCatalog")}
                            </div>
                          ) : sports.length >= 7 ? (
                            <SportCatalogSearch
                              key={scenarioId}
                              {...field}
                              triggerRef={field.ref}
                              scenarioId={scenarioId}
                              sports={sports}
                              value={field.value}
                              ariaDescribedBy={
                                errors.mainSportId
                                  ? `${sportDescriptionId} ${sportErrorId}`
                                  : sportDescriptionId
                              }
                              ariaLabel={t("selectors.sportLegend")}
                              ariaInvalid={Boolean(errors.mainSportId)}
                              onValueChange={handleSportChange}
                            />
                          ) : (
                            <SelectionCardRadioGroup
                              value={field.value}
                              options={sports.map((sport) => ({
                                id: sport.id,
                                title: sport.name,
                              }))}
                              gridClassName={prototypeStyles.radioGrid}
                              ariaDescribedBy={
                                errors.mainSportId
                                  ? `${sportDescriptionId} ${sportErrorId}`
                                  : sportDescriptionId
                              }
                              ariaLabel={t("selectors.sportLegend")}
                              ariaInvalid={Boolean(errors.mainSportId)}
                              disabled={isSaving}
                              firstItemRef={field.ref}
                              onBlur={field.onBlur}
                              onValueChange={handleSportChange}
                            />
                          )}
                          {errors.mainSportId?.message ? (
                            <p
                              id={sportErrorId}
                              className={prototypeStyles.fieldError}
                            >
                              {errors.mainSportId.message}
                            </p>
                          ) : null}
                        </FieldSet>
                      )}
                    />

                    <Controller
                      name="mainSportLevelId"
                      control={form.control}
                      render={({ field }) => (
                        <FieldSet
                          disabled={!selectedSport || isSaving}
                          aria-describedby={
                            errors.mainSportLevelId
                              ? `${levelDescriptionId} ${levelErrorId}`
                              : levelDescriptionId
                          }
                        >
                          <FieldLegend>
                            {selectedSport
                              ? t("selectors.levelLegend", {
                                  sport: selectedSport.name,
                                })
                              : t("selectors.levelLegendFallback")}
                          </FieldLegend>
                          <FieldDescription id={levelDescriptionId}>
                            {selectedSport
                              ? t("selectors.levelHelp")
                              : t("selectors.levelDisabledHelp")}
                          </FieldDescription>

                          {!selectedSport ? (
                            <div className={prototypeStyles.disabledGroup}>
                              {t("selectors.levelDisabledHelp")}
                            </div>
                          ) : levels.length === 0 ? (
                            <div className={prototypeStyles.inlineState}>
                              {t("states.emptyLevelScale")}
                            </div>
                          ) : (
                            <SelectionCardRadioGroup
                              value={field.value}
                              options={levels.map((level) => ({
                                id: level.id,
                                title: level.name,
                                friendlyName: level.friendlyName,
                                description: level.description,
                                accessibleLabel: `${level.name}. ${level.friendlyName}. ${level.description}`,
                              }))}
                              gridClassName={prototypeStyles.levelGrid}
                              ariaDescribedBy={
                                errors.mainSportLevelId
                                  ? `${levelDescriptionId} ${levelErrorId}`
                                  : levelDescriptionId
                              }
                              ariaLabel={t("selectors.levelLegend", {
                                sport: selectedSport.name,
                              })}
                              ariaInvalid={Boolean(errors.mainSportLevelId)}
                              disabled={isSaving}
                              firstItemRef={field.ref}
                              onBlur={field.onBlur}
                              onValueChange={field.onChange}
                            />
                          )}
                          {errors.mainSportLevelId?.message ? (
                            <p
                              id={levelErrorId}
                              className={prototypeStyles.fieldError}
                            >
                              {errors.mainSportLevelId.message}
                            </p>
                          ) : null}
                        </FieldSet>
                      )}
                    />
                  </section>

                  <div className={prototypeStyles.actionArea}>
                    {feedback ? (
                      <FeedbackAlert
                        alertRef={alertRef}
                        feedback={feedback}
                        interactive={Boolean(interactiveFeedback)}
                        onClear={clearFeedback}
                        onReload={reloadProfile}
                        onVerify={verifyProfile}
                      />
                    ) : null}

                    {routeOutcome && !staticOutcome ? (
                      <RouteOutcomePanel outcome={routeOutcome} />
                    ) : null}

                    <p
                      className={prototypeStyles.groupErrorSummary}
                      role="alert"
                      aria-live="assertive"
                    >
                      {Object.keys(errors).length
                        ? t("validation.summary")
                        : ""}
                    </p>

                    <div className={prototypeStyles.actions}>
                      <PendingButton
                        type="submit"
                        size="lg"
                        className={prototypeStyles.primaryAction}
                        pending={isSaving}
                        pendingLabel={t("actions.saving")}
                        disabled={
                          sportsUnavailable ||
                          (selectedSport ? levels.length === 0 : false)
                        }
                      >
                        {t("actions.continue")}
                      </PendingButton>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}
      </main>

      <ExitConfirmationDialog
        open={exitDialogOpen}
        returnFocusRef={exitButtonRef}
        onOpenChange={setExitDialogOpen}
        onConfirm={confirmExit}
      />
    </div>
  );
}

export { PlayerProfileOnboardingPrototype };
