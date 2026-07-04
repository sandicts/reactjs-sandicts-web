function formatRouteSlugLabel(routeSlug: string) {
  return decodeURIComponent(routeSlug)
    .split(/[-_]+/)
    .filter(Boolean)
    .map(
      (part) => `${part.charAt(0).toLocaleUpperCase("pt-BR")}${part.slice(1)}`,
    )
    .join(" ");
}

export { formatRouteSlugLabel };
