import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/lib/routes/app-routes";
import { BrandLink } from "../chrome/brand-link";
import { SkipLink } from "../chrome/skip-link";
import type { PublicShellProps } from "./public-shell.types";

function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipLink />
      <header className="border-b border-border/80 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-18 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <BrandLink />
          <nav
            className="ml-auto flex items-center gap-1 sm:gap-2"
            aria-label="Navegação pública"
          >
            <Button asChild variant="ghost" size="sm">
              <Link href={APP_ROUTES.public.discovery}>
                <Search aria-hidden="true" />
                <span className="hidden sm:inline">Explorar</span>
                <span className="sr-only sm:hidden">Explorar quadras</span>
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href={APP_ROUTES.public.signIn}>Entrar</Link>
            </Button>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

export { PublicShell };
