/**
 * Utility to enforce the permitted source hosts.
 */
export const PERMITTED_HOSTS = [
  "moneyhelper.org.uk",
  "gov.uk",
  "ofgem.gov.uk",
  "register.fca.org.uk",
  "citizensadvice.org.uk",
  "moneysavingexpert.com",
  "bankofengland.co.uk",
] as const;

/**
 * Validates a URL string against the allowlist.
 * Returns the URL if valid, or null if invalid or malformed.
 */
export function validateUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    const hostAllowed = PERMITTED_HOSTS.some(
      (permitted) => hostname === permitted || hostname.endsWith(`.${permitted}`)
    );
    if (!hostAllowed) return null;

    // A bare homepage (origin only, e.g. https://www.gov.uk/) is never a
    // primary source for a specific claim. Require a real path.
    const isOriginOnly = parsed.pathname === "/" || parsed.pathname === "";
    if (isOriginOnly) return null;

    return url;
  } catch (e) {
    return null;
  }
}

export type UrlStatus = "verified" | "unverified" | "dead";

// Some allowlisted hosts (e.g. moneyhelper.org.uk, moneysavingexpert.com) sit
// behind bot walls that return 403 to ALL automated traffic regardless of path.
// A recent-Chrome User-Agent with a GET clears crude method/UA filters; it does
// not clear a real bot wall, which is handled by the "unverified" state below.
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

/**
 * Checks a URL and classifies it:
 *  - "verified":   the host returned 2xx. Safe to show with a verified tick.
 *  - "dead":       the host returned 404/410, or we could not reach it at all.
 *                  The path does not exist (catches hallucinated URLs). Drop it.
 *  - "unverified": the host responded but blocked or challenged us (e.g. a 403
 *                  bot wall). We could NOT confirm the page exists, so we must
 *                  not claim a check we did not do. Keep the link, no tick.
 *
 * Crucially we never blanket-trust a 403: a bot-walled host returns 403 for a
 * hallucinated path too, so "unverified" is the honest label, not "verified".
 */
export async function checkUrlStatus(url: string): Promise<UrlStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeoutId);

    if (response.ok) return "verified";
    if (response.status === 404 || response.status === 410) return "dead";
    return "unverified";
  } catch (error) {
    // Network failure, DNS error, or timeout: we could not reach it at all.
    return "dead";
  }
}