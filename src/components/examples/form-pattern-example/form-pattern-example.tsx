"use client";

import { useId } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { isSandictsApiError } from "@/lib/api/runtime/sandicts-api-error";
import { applyApiValidationIssues } from "@/lib/forms/apply-api-validation-issues";
import type { ApiValidationIssueFieldMap } from "@/lib/forms/apply-api-validation-issues.types";
import {
  formPatternExampleSchema,
  type FormPatternExampleInput,
  type FormPatternExampleValues,
} from "./form-pattern-example.schemas";
import type { FormPatternExampleProps } from "./form-pattern-example.types";

const defaultValues = {
  displayName: "",
  email: "",
} satisfies FormPatternExampleInput;

const apiValidationIssueFieldMap = {
  displayName: "displayName",
  email: "email",
} satisfies ApiValidationIssueFieldMap<FormPatternExampleInput>;

function FormPatternExample({ onSubmit }: FormPatternExampleProps) {
  const id = useId();
  const form = useForm<
    FormPatternExampleInput,
    unknown,
    FormPatternExampleValues
  >({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(formPatternExampleSchema),
    shouldFocusError: true,
  });
  const {
    formState: { errors, isSubmitting },
  } = form;

  const displayNameId = `${id}-display-name`;
  const displayNameDescriptionId = `${displayNameId}-description`;
  const displayNameErrorId = `${displayNameId}-error`;
  const emailId = `${id}-email`;
  const emailDescriptionId = `${emailId}-description`;
  const emailErrorId = `${emailId}-error`;

  async function handleValidSubmit(values: FormPatternExampleValues) {
    form.clearErrors("root");

    try {
      await onSubmit(values);
    } catch (error) {
      if (
        isSandictsApiError(error) &&
        error.code === "validation_error" &&
        error.issues?.length
      ) {
        applyApiValidationIssues({
          fieldMap: apiValidationIssueFieldMap,
          issues: error.issues,
          rootErrorMessage:
            "Some fields could not be matched. Review your information and try again.",
          setError: form.setError,
        });
        return;
      }

      form.setError("root.server", {
        message: "Unable to save your information. Try again.",
        type: "server",
      });
    }
  }

  return (
    <form
      noValidate
      aria-busy={isSubmitting}
      onSubmit={form.handleSubmit(handleValidSubmit)}
    >
      <FieldGroup>
        <Field data-invalid={Boolean(errors.displayName)}>
          <FieldLabel htmlFor={displayNameId}>Display name</FieldLabel>
          <Input
            {...form.register("displayName")}
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
            Use the name other players should see.
          </FieldDescription>
          <FieldError errors={[errors.displayName]} id={displayNameErrorId} />
        </Field>

        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor={emailId}>Email</FieldLabel>
          <Input
            {...form.register("email")}
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
            We use this address for account access.
          </FieldDescription>
          <FieldError errors={[errors.email]} id={emailErrorId} />
        </Field>

        {errors.root?.server?.message && (
          <Alert variant="destructive">
            <CircleAlert aria-hidden="true" />
            <AlertTitle>We could not submit the form</AlertTitle>
            <AlertDescription>{errors.root.server.message}</AlertDescription>
          </Alert>
        )}

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          )}
          {isSubmitting ? "Saving..." : "Save example"}
        </Button>
      </FieldGroup>
    </form>
  );
}

export { FormPatternExample };
