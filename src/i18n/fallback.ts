type MessageFallbackInfo = Readonly<{
  key: string;
  namespace?: string;
}>;

function getI18nMessageFallback({ key, namespace }: MessageFallbackInfo) {
  return `[${namespace ? `${namespace}.` : ""}${key}]`;
}

export { getI18nMessageFallback };
export type { MessageFallbackInfo };
