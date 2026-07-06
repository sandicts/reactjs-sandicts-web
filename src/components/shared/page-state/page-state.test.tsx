/**
 * @vitest-environment jsdom
 */

import { forwardRef } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";
import { PageState } from "./page-state";

const TestIcon = forwardRef<SVGSVGElement, Omit<LucideProps, "ref">>(
  function TestIcon(props, ref) {
    return <svg data-testid="page-state-icon" ref={ref} {...props} />;
  },
) as LucideIcon;

describe("PageState", () => {
  it("renders a route-level state with h1, decorative icon, and actions", () => {
    render(
      <PageState
        eyebrow="Página indisponível"
        title="Não encontramos esta página."
        description="O endereço pode estar incorreto."
        headingLevel={1}
        Icon={TestIcon}
        primaryAction={<Button type="button">Explorar quadras</Button>}
        secondaryAction={<Button type="button">Voltar ao início</Button>}
      />,
    );

    expect(screen.getByText("Página indisponível")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Não encontramos esta página.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("O endereço pode estar incorreto."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Explorar quadras" }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Voltar ao início" }),
    ).toBeEnabled();
    expect(screen.getByTestId("page-state-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders an in-page state with h2 and a presentation tone", () => {
    render(
      <PageState
        title="Nenhum resultado encontrado."
        description="Remova filtros para ampliar a busca."
        headingLevel={2}
        tone="warning"
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Nenhum resultado encontrado.",
      }),
    ).toBeInTheDocument();
  });

  it("uses explicit live region semantics only when requested", () => {
    const { rerender } = render(
      <PageState
        title="Conteúdo atualizado."
        description="A lista foi carregada novamente."
        headingLevel={2}
        announcement="polite"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Conteúdo atualizado.",
    );

    rerender(
      <PageState
        title="Não foi possível salvar."
        description="Revise a operação e tente novamente."
        headingLevel={2}
        announcement="assertive"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível salvar.",
    );
  });
});
