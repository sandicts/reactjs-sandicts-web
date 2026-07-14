import { cn } from "@/lib/utils";
import { pageStateStyles, pageStateToneClasses } from "./page-state.styles";
import type { PageStateProps } from "./page-state.types";
import { getAnnouncementProps } from "./page-state.utils";

function PageState({
  announcement,
  className,
  description,
  eyebrow,
  headingLevel,
  Icon,
  primaryAction,
  secondaryAction,
  title,
  tone = "neutral",
}: PageStateProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <section
      data-slot="page-state"
      data-tone={tone}
      className={cn(pageStateStyles.root, className)}
      {...getAnnouncementProps(announcement)}
    >
      {Icon && (
        <div
          className={cn(
            pageStateStyles.iconContainer,
            pageStateToneClasses[tone],
          )}
        >
          <Icon className={pageStateStyles.icon} aria-hidden="true" />
        </div>
      )}

      {eyebrow && <p className={pageStateStyles.eyebrow}>{eyebrow}</p>}

      <Heading className={pageStateStyles.heading}>{title}</Heading>

      <p className={pageStateStyles.description}>{description}</p>

      {(primaryAction || secondaryAction) && (
        <div className={pageStateStyles.actions}>
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </section>
  );
}

export { PageState };
