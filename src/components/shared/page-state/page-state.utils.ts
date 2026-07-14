import type { PageStateProps } from "./page-state.types";

function getAnnouncementProps(announcement: PageStateProps["announcement"]) {
  if (announcement === "assertive") {
    return { role: "alert" as const };
  }

  if (announcement === "polite") {
    return { role: "status" as const };
  }

  return {};
}

export { getAnnouncementProps };
