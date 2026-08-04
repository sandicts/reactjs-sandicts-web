/**
 * @vitest-environment jsdom
 */

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithI18n } from "@test/render-with-i18n";
import { AuthMethodStack } from "./auth-method-stack";

describe("AuthMethodStack", () => {
  it("keeps Google first and adds the approved divider only with an email method", () => {
    renderWithI18n(
      <AuthMethodStack
        googleMethod={<div>Google method</div>}
        magicLinkMethod={<div>Email method</div>}
      />,
    );

    const googleMethod = screen.getByText("Google method");
    const emailMethod = screen.getByText("Email method");

    expect(screen.getByText("ou continue por e-mail")).toBeInTheDocument();
    expect(
      googleMethod.compareDocumentPosition(emailMethod) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("does not render a divider before KAN-105 supplies the magic-link slot", () => {
    renderWithI18n(
      <AuthMethodStack googleMethod={<div>Google method</div>} />,
    );

    expect(
      screen.queryByText("ou continue por e-mail"),
    ).not.toBeInTheDocument();
  });
});
