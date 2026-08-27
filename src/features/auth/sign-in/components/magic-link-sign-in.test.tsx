/**
 * @vitest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import { SandictsApiError } from "@/lib/api/runtime/sandicts-api-error";
import { MagicLinkSignIn } from "./magic-link-sign-in";

const requestMock = vi.hoisted(() => ({
  isPending: false,
  mutateAsync: vi.fn(),
}));

vi.mock("@/lib/api/generated/sandicts-api/auth/auth", () => ({
  useRequestMagicLinkControllerRequest: () => requestMock,
}));

describe("MagicLinkSignIn", () => {
  beforeEach(() => {
    requestMock.isPending = false;
    requestMock.mutateAsync.mockReset();
  });

  it("validates the email before requesting a link", async () => {
    renderWithI18n(<MagicLinkSignIn />);

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "invalid" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar link" }));

    expect(
      await screen.findByText("Informe um endereço de e-mail válido."),
    ).toBeInTheDocument();
    expect(requestMock.mutateAsync).not.toHaveBeenCalled();
  });

  it("shows the privacy-safe sent state without echoing the email", async () => {
    requestMock.mutateAsync.mockResolvedValue({ status: "accepted" });
    renderWithI18n(<MagicLinkSignIn />);

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "player@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar link" }));

    expect(await screen.findByText("Confira seu e-mail")).toBeInTheDocument();
    expect(screen.queryByText("player@example.com")).not.toBeInTheDocument();
    expect(
      screen.getByText("Você poderá solicitar outro link em 60 s."),
    ).toBeInTheDocument();
    expect(requestMock.mutateAsync).toHaveBeenCalledWith({
      data: { email: "player@example.com" },
    });
  });

  it("blocks immediate retries when the API rate-limits the request", async () => {
    requestMock.mutateAsync.mockRejectedValue(
      createApiError(429, "rate_limited"),
    );
    renderWithI18n(<MagicLinkSignIn />);

    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "player@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar link" }));

    expect(await screen.findByText("Muitas tentativas")).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Enviar link" }),
      ).toBeDisabled();
    });
  });
});

function createApiError(statusCode: number, code: string) {
  return new SandictsApiError({
    code,
    message: "API error",
    path: "/auth/magic-link/request",
    requestId: "request-id",
    statusCode,
    timestamp: "2026-08-27T00:00:00.000Z",
  });
}
