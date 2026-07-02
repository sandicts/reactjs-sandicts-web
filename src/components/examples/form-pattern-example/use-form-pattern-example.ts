import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isSandictsApiError } from "@/lib/api/runtime/sandicts-api-error";
import { applyApiValidationIssues } from "@/lib/forms/apply-api-validation-issues";
import type { ApiValidationIssueFieldMap } from "@/lib/forms/apply-api-validation-issues.types";
import {
  formPatternExampleSchema,
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

  return {
    errors: form.formState.errors,
    handleSubmit: form.handleSubmit(handleValidSubmit),
    isSubmitting: form.formState.isSubmitting,
    register: form.register,
  };
}

export { useFormPatternExample };
