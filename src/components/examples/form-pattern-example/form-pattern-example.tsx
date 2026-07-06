"use client";

import { useId } from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
          <Alert variant="destructive">
            <CircleAlert aria-hidden="true" />
            <AlertTitle>{t("submitErrorTitle")}</AlertTitle>
            <AlertDescription>{errors.root.server.message}</AlertDescription>
          </Alert>
        )}

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          )}
          {isSubmitting ? t("saving") : t("submit")}
        </Button>
      </FieldGroup>
    </form>
  );
}

export { FormPatternExample };
