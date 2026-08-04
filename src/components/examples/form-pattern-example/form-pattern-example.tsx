"use client";

import { useId } from "react";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { PendingButton } from "@/components/shared/pending-button/pending-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FormPatternExampleProps } from "./form-pattern-example.types";
import { useFormPatternExample } from "./use-form-pattern-example";

function FormPatternExample({ onSubmit }: FormPatternExampleProps) {
  const t = useTranslations("FormExample");
  const id = useId();
  const { errors, handleSubmit, isSubmitting, register } =
    useFormPatternExample({ onSubmit });

  const displayNameId = `${id}-display-name`;
  const displayNameDescriptionId = `${displayNameId}-description`;
  const displayNameErrorId = `${displayNameId}-error`;
  const emailId = `${id}-email`;
  const emailDescriptionId = `${emailId}-description`;
  const emailErrorId = `${emailId}-error`;

  return (
    <form noValidate aria-busy={isSubmitting} onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.displayName)}>
          <FieldLabel htmlFor={displayNameId}>
            {t("displayNameLabel")}
          </FieldLabel>
          <Input
            {...register("displayName")}
            required
            aria-describedby={
              errors.displayName
                ? `${displayNameDescriptionId} ${displayNameErrorId}`
                : displayNameDescriptionId
            }
            aria-invalid={Boolean(errors.displayName)}
            autoComplete="name"
            id={displayNameId}
          />
          <FieldDescription id={displayNameDescriptionId}>
            {t("displayNameDescription")}
          </FieldDescription>
          <FieldError errors={[errors.displayName]} id={displayNameErrorId} />
        </Field>

        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor={emailId}>{t("emailLabel")}</FieldLabel>
          <Input
            {...register("email")}
            required
            aria-describedby={
              errors.email
                ? `${emailDescriptionId} ${emailErrorId}`
                : emailDescriptionId
            }
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            id={emailId}
            inputMode="email"
            type="email"
          />
          <FieldDescription id={emailDescriptionId}>
            {t("emailDescription")}
          </FieldDescription>
          <FieldError errors={[errors.email]} id={emailErrorId} />
        </Field>

        {errors.root?.server?.message && (
          <Alert role="alert" variant="destructive">
            <WarningCircleIcon aria-hidden="true" />
            <AlertTitle>{t("submitErrorTitle")}</AlertTitle>
            <AlertDescription>{errors.root.server.message}</AlertDescription>
          </Alert>
        )}

        <PendingButton
          pending={isSubmitting}
          pendingLabel={t("saving")}
          type="submit"
        >
          {t("submit")}
        </PendingButton>
      </FieldGroup>
    </form>
  );
}

export { FormPatternExample };
