/**
 * @vitest-environment jsdom
 */

import { CheckCircle2 } from "lucide-react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

describe("UI foundation", () => {
  it("composes accessible form and feedback primitives", () => {
    render(
      <div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" aria-describedby="email-description" />
          <FieldDescription id="email-description">
            Used for account access.
          </FieldDescription>
        </Field>
        <Button type="button">Continue</Button>
        <Alert role="status" variant="success">
          <CheckCircle2 aria-hidden="true" />
          <AlertTitle>Foundation ready</AlertTitle>
          <AlertDescription>
            Shared primitives can be composed.
          </AlertDescription>
        </Alert>
      </div>,
    );

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "aria-describedby",
      "email-description",
    );
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
    expect(screen.getByRole("status")).toHaveTextContent("Foundation ready");
  });
});
