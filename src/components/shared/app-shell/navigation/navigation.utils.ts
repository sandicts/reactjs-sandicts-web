import type {
  ShellNavigationGroup,
  ShellNavigationItem,
} from "./navigation.types";

function normalizePathname(pathname: string) {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "");
}

function navigationItemMatchesPathname(
  pathname: string,
  item: ShellNavigationItem,
) {
  const normalizedPathname = normalizePathname(pathname);
  const normalizedHref = normalizePathname(item.href);

  if (item.match === "exact") {
    return normalizedPathname === normalizedHref;
  }

  return (
    normalizedPathname === normalizedHref ||
    normalizedPathname.startsWith(`${normalizedHref}/`)
  );
}

function getActiveNavigationItem(
  pathname: string,
  groups: readonly ShellNavigationGroup[],
) {
  return groups
    .flatMap((group) => group.items)
    .filter((item) => navigationItemMatchesPathname(pathname, item))
    .sort((left, right) => right.href.length - left.href.length)[0];
}

export { getActiveNavigationItem, navigationItemMatchesPathname };
