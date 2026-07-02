/**
 * @vitest-environment jsdom
 */

import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SandictsApiError } from "@/lib/api/runtime/sandicts-api-error";
import { FormPatternExample } from "./form-pattern-example";

describe("FormPatternExample", () => {
  it("shows accessible client validation before submission", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<FormPatternExample onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Save example" }));

    const displayName = screen.getByRole("textbox", {
      name: "Display name",
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(displayName).toHaveAttribute("aria-invalid", "true");
    expect(displayName).toHaveFocus();
    expect(
      screen.getByText("Enter at least 2 characters."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter a valid email address."),
    ).toBeInTheDocument();
  });

  it("submits parsed values inferred from the Zod schema", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<FormPatternExample onSubmit={onSubmit} />);

    await user.type(
      screen.getByRole("textbox", { name: "Display name" }),
      "  Lucas  ",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "  lucas@example.com  ",
    );
    await user.click(screen.getByRole("button", { name: "Save example" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        displayName: "Lucas",
        email: "lucas@example.com",
      });
    });
  });

  it("maps recognized API validation issues to the responsible field", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(
      new SandictsApiError({
        code: "validation_error",
        issues: [
          {
            message: "This email cannot be used.",
            path: ["email"],
          },
        ],
        message: "The submitted form is invalid.",
        path: "/example",
        requestId: "request-id",
        statusCode: 400,
        timestamp: "2026-07-02T00:00:00.000Z",
      }),
    );

    render(<FormPatternExample onSubmit={onSubmit} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Save example" }));

    const email = screen.getByRole("textbox", { name: "Email" });

    expect(await screen.findByText("This email cannot be used.")).toBeVisible();
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveFocus();
  });

  it("uses a root error for API paths the form does not recognize", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(
      new SandictsApiError({
        code: "validation_error",
        issues: [
          {
            message: "The profile is invalid.",
            path: ["profile"],
          },
        ],
        message: "The submitted form is invalid.",
        path: "/example",
        requestId: "request-id",
        statusCode: 400,
        timestamp: "2026-07-02T00:00:00.000Z",
      }),
    );

    render(<FormPatternExample onSubmit={onSubmit} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Save example" }));

    expect(
      await screen.findByText(
        "Some fields could not be matched. Review your information and try again.",
      ),
    ).toBeVisible();
  });

  it("prevents duplicate submissions while a request is pending", async () => {
    const user = userEvent.setup();
    let resolveSubmission: (() => void) | undefined;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmission = resolve;
        }),
    );

    render(<FormPatternExample onSubmit={onSubmit} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Save example" }));

    const pendingButton = screen.getByRole("button", { name: "Saving..." });

    expect(pendingButton).toBeDisabled();
    await user.click(pendingButton);
    expect(onSubmit).toHaveBeenCalledOnce();

    await act(async () => {
      resolveSubmission?.();
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Save example" }),
      ).toBeEnabled();
    });
  });
});

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByRole("textbox", { name: "Display name" }),
    "Lucas",
  );
  await user.type(
    screen.getByRole("textbox", { name: "Email" }),
    "lucas@example.com",
  );
}
