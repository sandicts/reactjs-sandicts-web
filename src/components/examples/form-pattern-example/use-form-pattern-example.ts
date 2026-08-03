import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { isSandictsApiError } from "@/lib/api/runtime/sandicts-api-error";
import { applyApiValidationIssues } from "@/lib/forms/apply-api-validation-issues";
import type { ApiValidationIssueFieldMap } from "@/lib/forms/apply-api-validation-issues.types";
import {
  createFormPatternExampleSchema,
  type FormPatternExampleInput,
  type FormPatternExampleValues,
} from "./form-pattern-example.schemas";
import type {
  FormPatternExampleProps,
  UseFormPatternExampleResult,
} from "./form-pattern-example.types";

const defaultValues = {
  displayName: "",
  email: "",
} satisfies FormPatternExampleInput;

const apiValidationIssueFieldMap = {
  displayName: "displayName",
  email: "email",
} satisfies ApiValidationIssueFieldMap<FormPatternExampleInput>;

function useFormPatternExample({
  onSubmit,
}: FormPatternExampleProps): UseFormPatternExampleResult {
  const t = useTranslations("FormExample");
  const schema = useMemo(
    () =>
      createFormPatternExampleSchema({
        displayNameMax: t("displayNameMax"),
        displayNameMin: t("displayNameMin"),
        emailInvalid: t("emailInvalid"),
      }),
    [t],
  );
  const form = useForm<
    FormPatternExampleInput,
    unknown,
    FormPatternExampleValues
  >({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
    shouldFocusError: true,
  });

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
          rootErrorMessage: t("unmatchedFieldsError"),
          setError: form.setError,
        });
        return;
      }

      form.setError("root.server", {
        message: t("rootServerError"),
        type: "server",
      });
    }
  }

  return {
    errors: form.formState.errors,
    handleSubmit: form.handleSubmit(handleValidSubmit),
    isSubmitting: form.formState.isSubmitting,
    register: form.register,
  };
}

export { useFormPatternExample };
