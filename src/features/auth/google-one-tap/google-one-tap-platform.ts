type GoogleOneTapPlatformInput = Readonly<{
  isTopLevel: boolean;
  userAgent: string;
}>;

function isGoogleOneTapPlatformSupported(
  input: GoogleOneTapPlatformInput = readBrowserPlatform(),
) {
  if (!input.isTopLevel) {
    return false;
  }

  const { userAgent } = input;
  const isIos = /\b(iPad|iPhone|iPod)\b/i.test(userAgent);
  const isFirefox = /\b(Firefox|FxiOS)\//i.test(userAgent);
  const isEmbeddedWebView =
    /\b(wv|WebView)\b|; wv\)|\b(FBAN|FBAV|Instagram)\//i.test(userAgent);
  const isSafari =
    /Safari\//i.test(userAgent) &&
    !/(Chrome|Chromium|CriOS|Edg|EdgiOS)\//i.test(userAgent);
  const isChromium = /(Chrome|Chromium|CriOS|Edg|EdgiOS)\//i.test(userAgent);

  return isChromium && !isIos && !isFirefox && !isSafari && !isEmbeddedWebView;
}

function readBrowserPlatform(): GoogleOneTapPlatformInput {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { isTopLevel: false, userAgent: "" };
  }

  return {
    isTopLevel: window.top === window.self,
    userAgent: navigator.userAgent,
  };
}

export { isGoogleOneTapPlatformSupported };
export type { GoogleOneTapPlatformInput };
