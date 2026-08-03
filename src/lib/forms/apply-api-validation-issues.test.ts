import type { UseFormSetError } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import {
  applyApiValidationIssues,
  toIssuePathKey,
} from "./apply-api-validation-issues";

type TestFormValues = {
  email: string;
  sports: Array<{
    level: string;
  }>;
};

describe("applyApiValidationIssues", () => {
  it("maps known API paths and focuses only the first invalid field", () => {
    const setError = vi.fn() as unknown as UseFormSetError<TestFormValues>;

    const result = applyApiValidationIssues<TestFormValues>({
      fieldMap: {
        email: "email",
        "sports.0.level": "sports.0.level",
      },
      issues: [
        {
          message: "Enter a valid email address.",
          path: ["email"],
        },
        {
          message: "Choose a supported level.",
          path: ["sports", 0, "level"],
        },
      ],
      rootErrorMessage: "Review the form and try again.",
      setError,
    });

    expect(setError).toHaveBeenNthCalledWith(
      1,
      "email",
      {
        message: "Enter a valid email address.",
        type: "server",
      },
      {
        shouldFocus: true,
      },
    );
    expect(setError).toHaveBeenNthCalledWith(
      2,
      "sports.0.level",
      {
        message: "Choose a supported level.",
        type: "server",
      },
      {
        shouldFocus: false,
      },
    );
    expect(result).toEqual({
      mappedFieldCount: 2,
      unmappedIssueCount: 0,
    });
  });

  it("sends unknown API paths to a root form error", () => {
    const setError = vi.fn() as unknown as UseFormSetError<TestFormValues>;

    const result = applyApiValidationIssues<TestFormValues>({
      fieldMap: {
        email: "email",
      },
      issues: [
        {
          message: "The submitted profile is invalid.",
          path: ["profile"],
        },
      ],
      rootErrorMessage: "Review the form and try again.",
      setError,
    });

    expect(setError).toHaveBeenCalledOnce();
    expect(setError).toHaveBeenCalledWith("root.server", {
      message: "Review the form and try again.",
      type: "server",
    });
    expect(result).toEqual({
      mappedFieldCount: 0,
      unmappedIssueCount: 1,
    });
  });

  it("normalizes nested and array issue paths", () => {
    expect(toIssuePathKey(["sports", 0, "level"])).toBe("sports.0.level");
  });
});
