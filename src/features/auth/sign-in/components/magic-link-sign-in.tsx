"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { PendingButton } from "@/components/shared/pending-button/pending-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRequestMagicLinkControllerRequest } from "@/lib/api/generated/sandicts-api/auth/auth";
import { isSandictsApiError } from "@/lib/api/runtime/sandicts-api-error";
import {
  createMagicLinkRequestSchema,
  type MagicLinkRequestInput,
  type MagicLinkRequestValues,
} from "../magic-link-request.schemas";
import { signInScreenStyles } from "../sign-in-screen.styles";

type RequestState =
  "delivery-unavailable" | "idle" | "rate-limited" | "request-failed" | "sent";

const resendCooldownSeconds = 60;

function MagicLinkSignIn() {
  const t = useTranslations("SignIn.methods.magicLink");
  const fieldId = useId();
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [cooldown, setCooldown] = useState(0);
  const schema = useMemo(
    () => createMagicLinkRequestSchema(t("emailInvalid")),
    [t],
  );
  const form = useForm<MagicLinkRequestInput, unknown, MagicLinkRequestValues>({
    defaultValues: { email: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
    shouldFocusError: true,
  });
  const requestMagicLink = useRequestMagicLinkControllerRequest();

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((remaining) => Math.max(0, remaining - 1));
    }, 1_000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  async function requestLink(values: MagicLinkRequestValues) {
    form.clearErrors();

    try {
      await requestMagicLink.mutateAsync({ data: values });
      setRequestState("sent");
      setCooldown(resendCooldownSeconds);
    } catch (error) {
      if (isSandictsApiError(error) && error.statusCode === 400) {
        form.setError("email", { message: t("emailInvalid"), type: "server" });
        setRequestState("idle");
        return;
      }

      if (isSandictsApiError(error) && error.statusCode === 429) {
        setRequestState("rate-limited");
        return;
      }

      if (
        isSandictsApiError(error) &&
        error.statusCode === 503 &&
        error.code === "email_delivery_unavailable"
      ) {
        setRequestState("delivery-unavailable");
        return;
      }

      setRequestState("request-failed");
    }
  }

  const submitRequest = form.handleSubmit(requestLink);

  if (requestState === "sent") {
    return (
      <div className={signInScreenStyles.magicLinkForm} aria-live="polite">
        <Alert variant="success">
          <AlertTitle>{t("sent.title")}</AlertTitle>
          <AlertDescription>
            <p>{t("sent.description")}</p>
            {cooldown === 0 && <p>{t("sent.resendDescription")}</p>}
          </AlertDescription>
        </Alert>
        {cooldown > 0 ? (
          <p className={signInScreenStyles.magicLinkStatus}>
            {t("cooldown", { seconds: cooldown })}
          </p>
        ) : (
          <PendingButton
            className={signInScreenStyles.magicLinkAction}
            pending={requestMagicLink.isPending}
            pendingLabel={t("resending")}
            type="button"
            variant="outline"
            onClick={() => void submitRequest()}
          >
            {t("resend")}
          </PendingButton>
        )}
      </div>
    );
  }

  return (
    <form
      noValidate
      aria-busy={requestMagicLink.isPending}
      className={signInScreenStyles.magicLinkForm}
      onSubmit={submitRequest}
    >
      <Field data-invalid={Boolean(form.formState.errors.email)}>
        <FieldLabel htmlFor={fieldId}>{t("emailLabel")}</FieldLabel>
        <Input
          {...form.register("email")}
          required
          aria-describedby={
            form.formState.errors.email
              ? `${descriptionId} ${errorId}`
              : descriptionId
          }
          aria-invalid={Boolean(form.formState.errors.email)}
          autoCapitalize="none"
          autoComplete="email"
          id={fieldId}
          inputMode="email"
          type="email"
        />
        <FieldDescription id={descriptionId}>
          {t("emailDescription")}
        </FieldDescription>
        <FieldError errors={[form.formState.errors.email]} id={errorId} />
      </Field>

      {requestState === "rate-limited" && (
        <Alert role="alert" variant="warning">
          <AlertTitle>{t("rateLimited.title")}</AlertTitle>
          <AlertDescription>{t("rateLimited.description")}</AlertDescription>
        </Alert>
      )}
      {requestState === "delivery-unavailable" && (
        <Alert role="alert" variant="warning">
          <AlertTitle>{t("deliveryUnavailable.title")}</AlertTitle>
          <AlertDescription>
            {t("deliveryUnavailable.description")}
          </AlertDescription>
        </Alert>
      )}
      {requestState === "request-failed" && (
        <Alert role="alert" variant="destructive">
          <AlertTitle>{t("requestFailed.title")}</AlertTitle>
          <AlertDescription>{t("requestFailed.description")}</AlertDescription>
        </Alert>
      )}

      <PendingButton
        className={signInScreenStyles.magicLinkAction}
        disabled={requestState === "rate-limited"}
        pending={requestMagicLink.isPending}
        pendingLabel={t("sending")}
        type="submit"
      >
        {requestState === "delivery-unavailable" ||
        requestState === "request-failed"
          ? t("tryAgain")
          : t("send")}
      </PendingButton>
    </form>
  );
}

export { MagicLinkSignIn, resendCooldownSeconds };
