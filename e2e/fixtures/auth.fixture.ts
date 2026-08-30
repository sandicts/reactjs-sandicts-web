import { expect, test as base, type Page, type Route } from "@playwright/test";
import type { AuthSessionSnapshot } from "../../src/lib/auth/auth-session.types";

const e2eGoogleCredential = "playwright-google-credential";
const googleIdentityScriptUrl = "https://accounts.google.com/gsi/client";

const e2eAuthSession = {
  accessToken: "playwright-access-token",
  accessTokenExpiresAt: "2099-01-01T00:00:00.000Z",
  account: {
    displayName: "Jogadora E2E",
    email: "jogadora.e2e@example.test",
    id: "account-e2e",
  },
  session: {
    id: "session-e2e",
  },
} satisfies AuthSessionSnapshot;

type AuthApiFixture = Readonly<{
  googleCredentials: readonly string[];
  setSession: (session: AuthSessionSnapshot | null) => void;
}>;

type AuthFixtures = Readonly<{
  authApi: AuthApiFixture;
}>;

const test = base.extend<AuthFixtures>({
  authApi: async ({ page }, provide) => {
    const state: {
      googleCredentials: string[];
      session: AuthSessionSnapshot | null;
    } = {
      googleCredentials: [],
      session: null,
    };

    await installGoogleIdentityMock(page);
    await page.route("**/auth/**", async (route) => {
      await handleAuthApiRoute(route, state);
    });

    await provide({
      get googleCredentials() {
        return state.googleCredentials;
      },
      setSession(session) {
        state.session = session;
      },
    });
  },
});

async function installGoogleIdentityMock(page: Page) {
  await page.route(googleIdentityScriptUrl, async (route) => {
    await route.fulfill({
      body: createGoogleIdentityMockScript(),
      contentType: "application/javascript",
      status: 200,
    });
  });
}

function createGoogleIdentityMockScript() {
  return `(() => {
    let credentialCallback = () => {};

    window.google = {
      accounts: {
        id: {
          cancel() {},
          initialize(configuration) {
            credentialCallback = configuration.callback;
          },
          prompt() {},
          renderButton(parent, configuration) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "Continuar com Google";
            button.setAttribute("aria-label", "Continuar com Google");
            button.addEventListener("click", () => {
              configuration.click_listener?.();
              credentialCallback({
                credential: ${JSON.stringify(e2eGoogleCredential)},
                select_by: "btn",
              });
            });
            parent.append(button);
          },
        },
      },
    };
  })();`;
}

async function handleAuthApiRoute(
  route: Route,
  state: {
    googleCredentials: string[];
    session: AuthSessionSnapshot | null;
  },
) {
  const request = route.request();
  const requestUrl = new URL(request.url());
  const corsHeaders = createCorsHeaders(request.headers()["origin"]);

  if (request.method() === "OPTIONS") {
    await route.fulfill({ headers: corsHeaders, status: 204 });
    return;
  }

  if (requestUrl.pathname === "/auth/refresh" && request.method() === "POST") {
    await fulfillSessionOrUnauthorized(route, state.session, corsHeaders);
    return;
  }

  if (
    requestUrl.pathname === "/auth/google/sign-in" &&
    request.method() === "POST"
  ) {
    const body = request.postDataJSON() as { credential?: unknown };
    const credential =
      typeof body.credential === "string" ? body.credential : "";

    state.googleCredentials.push(credential);

    if (credential !== e2eGoogleCredential) {
      await fulfillApiError(
        route,
        401,
        "invalid_google_credential",
        corsHeaders,
      );
      return;
    }

    state.session = e2eAuthSession;
    await fulfillJson(route, 200, e2eAuthSession, corsHeaders);
    return;
  }

  if (requestUrl.pathname === "/auth/me" && request.method() === "GET") {
    const expectedAuthorization = state.session
      ? `Bearer ${state.session.accessToken}`
      : null;

    if (
      !state.session ||
      request.headers()["authorization"] !== expectedAuthorization
    ) {
      await fulfillApiError(route, 401, "unauthorized", corsHeaders);
      return;
    }

    await fulfillJson(
      route,
      200,
      {
        account: state.session.account,
        session: state.session.session,
      },
      corsHeaders,
    );
    return;
  }

  await fulfillApiError(route, 501, "e2e_auth_route_not_mocked", corsHeaders);
}

async function fulfillSessionOrUnauthorized(
  route: Route,
  session: AuthSessionSnapshot | null,
  headers: Record<string, string>,
) {
  if (session) {
    await fulfillJson(route, 200, session, headers);
    return;
  }

  await fulfillApiError(route, 401, "invalid_refresh_token", headers);
}

async function fulfillApiError(
  route: Route,
  statusCode: number,
  code: string,
  headers: Record<string, string>,
) {
  await fulfillJson(
    route,
    statusCode,
    {
      code,
      message: "Deterministic Playwright auth response.",
      path: new URL(route.request().url()).pathname,
      requestId: "playwright-request",
      statusCode,
      timestamp: "2099-01-01T00:00:00.000Z",
    },
    headers,
  );
}

async function fulfillJson(
  route: Route,
  status: number,
  body: unknown,
  headers: Record<string, string>,
) {
  await route.fulfill({
    body: JSON.stringify(body),
    headers: {
      ...headers,
      "content-type": "application/json",
    },
    status,
  });
}

function createCorsHeaders(origin: string | undefined) {
  return {
    "access-control-allow-credentials": "true",
    "access-control-allow-headers": "authorization, content-type",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-origin": origin ?? "http://localhost:3001",
  };
}

export { e2eAuthSession, e2eGoogleCredential, expect, test };
export type { AuthApiFixture };
