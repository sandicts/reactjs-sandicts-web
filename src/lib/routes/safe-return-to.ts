const maximumReturnToLength = 2_048;
const sensitiveParameterPattern =
  /(?:^|[_-])(authorization|code|credential|email|idtoken|id_token|magic|password|refresh|secret|token)(?:$|[_-])/i;

function readSafeReturnTo(value: string | null | undefined, webOrigin: URL) {
  const candidate = value?.trim();

  if (
    !candidate ||
    candidate.length > maximumReturnToLength ||
    /[\u0000-\u001f\u007f]/.test(candidate) ||
    fullyDecode(candidate) === null ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//")
  ) {
    return null;
  }

  try {
    const resolvedUrl = new URL(candidate, webOrigin);
    const decodedPathname = fullyDecode(resolvedUrl.pathname);

    if (
      decodedPathname === null ||
      resolvedUrl.origin !== webOrigin.origin ||
      !decodedPathname.startsWith("/") ||
      decodedPathname.startsWith("//") ||
      decodedPathname.includes("\\") ||
      isAuthenticationRoute(resolvedUrl.pathname) ||
      containsSensitiveData(resolvedUrl)
    ) {
      return null;
    }

    return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
  } catch {
    return null;
  }
}

function isAuthenticationRoute(pathname: string) {
  const decodedPathname = fullyDecode(pathname);

  if (decodedPathname === null) {
    return true;
  }

  const normalizedPathname = decodedPathname.replace(/\/+$/, "") || "/";

  return (
    normalizedPathname === "/sign-in" ||
    normalizedPathname.startsWith("/sign-in/") ||
    normalizedPathname === "/auth" ||
    normalizedPathname.startsWith("/auth/")
  );
}

function containsSensitiveData(url: URL) {
  const hasSensitiveSearchParameter = Array.from(url.searchParams.keys()).some(
    (key) => sensitiveParameterPattern.test(key),
  );
  const decodedHash = fullyDecode(url.hash);

  if (decodedHash === null) {
    return true;
  }

  const normalizedHash = decodedHash.replace(/^#/, "");
  const hasSensitiveHashParameter = normalizedHash
    .split(/[&;]/)
    .map((part) => part.split("=", 1)[0] ?? "")
    .some((key) => sensitiveParameterPattern.test(key));

  return hasSensitiveSearchParameter || hasSensitiveHashParameter;
}

function fullyDecode(value: string): string | null {
  let decodedValue = value;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const nextValue = decodeURIComponent(decodedValue);

      if (nextValue === decodedValue) {
        return decodedValue;
      }

      decodedValue = nextValue;
    } catch {
      return null;
    }
  }

  return decodedValue;
}

export { maximumReturnToLength, readSafeReturnTo };
