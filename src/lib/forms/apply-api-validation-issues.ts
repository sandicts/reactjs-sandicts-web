import type { FieldPath, FieldValues } from "react-hook-form";
import type {
  ApplyApiValidationIssuesOptions,
  ApplyApiValidationIssuesResult,
} from "./apply-api-validation-issues.types";

function applyApiValidationIssues<TFieldValues extends FieldValues>({
  fieldMap,
  issues,
  rootErrorMessage,
  setError,
}: ApplyApiValidationIssuesOptions<TFieldValues>): ApplyApiValidationIssuesResult {
  const mappedFields = new Set<FieldPath<TFieldValues>>();
  let unmappedIssueCount = 0;

  for (const issue of issues) {
    const fieldName = fieldMap[toIssuePathKey(issue.path)];

    if (!fieldName) {
      unmappedIssueCount += 1;
      continue;
    }

    if (mappedFields.has(fieldName)) {
      continue;
    }

    setError(
      fieldName,
      {
        message: issue.message,
        type: "server",
      },
      {
        shouldFocus: mappedFields.size === 0,
      },
    );
    mappedFields.add(fieldName);
  }

  if (unmappedIssueCount > 0) {
    setError("root.server", {
      message: rootErrorMessage,
      type: "server",
    });
  }

  return {
    mappedFieldCount: mappedFields.size,
    unmappedIssueCount,
  };
}

function toIssuePathKey(path: readonly (string | number)[]) {
  return path.map(String).join(".");
}

export { applyApiValidationIssues, toIssuePathKey };
