import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import type { SandictsApiValidationIssue } from "@/lib/api/contracts/sandicts-api-error.types";

type ApiValidationIssueFieldMap<TFieldValues extends FieldValues> = Readonly<
  Partial<Record<string, FieldPath<TFieldValues>>>
>;

type ApplyApiValidationIssuesOptions<TFieldValues extends FieldValues> =
  Readonly<{
    fieldMap: ApiValidationIssueFieldMap<TFieldValues>;
    issues: readonly SandictsApiValidationIssue[];
    rootErrorMessage: string;
    setError: UseFormSetError<TFieldValues>;
  }>;

type ApplyApiValidationIssuesResult = Readonly<{
  mappedFieldCount: number;
  unmappedIssueCount: number;
}>;

export type {
  ApiValidationIssueFieldMap,
  ApplyApiValidationIssuesOptions,
  ApplyApiValidationIssuesResult,
};
