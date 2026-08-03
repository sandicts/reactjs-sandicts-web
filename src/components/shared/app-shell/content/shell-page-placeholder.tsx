import { Card } from "@/components/ui/card";
import type { ShellPagePlaceholderProps } from "./shell-page-placeholder.types";

function ShellPagePlaceholder({
  eyebrow,
  title,
  description,
  Icon,
}: ShellPagePlaceholderProps) {
  return (
    <section className="grid min-h-[calc(100vh-5rem)] content-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-10">
      <div className="max-w-3xl self-center">
        <p className="mb-3 text-sm font-medium text-primary">{eyebrow}</p>
        <h1 className="text-4xl leading-tight font-semibold text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {description}
        </p>
      </div>
      <Card className="flex min-h-56 items-center justify-center self-center py-0 shadow-none">
        <Icon className="size-16 text-success" aria-hidden="true" />
      </Card>
    </section>
  );
}

export { ShellPagePlaceholder };
