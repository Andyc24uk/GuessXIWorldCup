export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

type ShareRequest = {
  fullText: string;
  url: string;
  title?: string;
};

export function createNativeSharePayload(fullText: string, url: string, title?: string): ShareData {
  const normalizedUrl = url.trim();
  const normalizedText = fullText.trimEnd();
  const textWithoutTrailingUrl = normalizedText.endsWith(normalizedUrl)
    ? normalizedText.slice(0, Math.max(0, normalizedText.length - normalizedUrl.length)).trimEnd()
    : normalizedText;

  return {
    title,
    text: textWithoutTrailingUrl,
    url: normalizedUrl
  };
}

export async function shareWithFallback({ fullText, url, title }: ShareRequest): Promise<ShareOutcome> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share(createNativeSharePayload(fullText, url, title));
      return "shared";
    } catch (error) {
      if (isShareCancellation(error)) {
        return "cancelled";
      }
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(fullText);
      return "copied";
    } catch {
      return "failed";
    }
  }

  return "failed";
}

function isShareCancellation(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const name = "name" in error ? String(error.name) : "";
  return name === "AbortError";
}
