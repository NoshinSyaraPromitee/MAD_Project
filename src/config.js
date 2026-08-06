import Constants from "expo-constants";

// In Expo Go, the phone connects to Metro (your dev server) at some
// exp://<ip>:<port> address — Expo Go had to already know that IP to load
// the app at all. We reuse that same IP for the backend instead of hardcoding
// it, so this keeps working across different wifi networks with no manual edits.
function resolveBackendUrl() {
  const hostUri =
    Constants.expoConfig?.hostUri || Constants.expoGoConfig?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(":")[0];
    return `http://${host}:5000`;
  }

  // Fallback for production/standalone builds, where there's no dev host —
  // replace with your real deployed backend URL once you host it somewhere.
  return "https://your-deployed-backend.example.com";
}

export const BACKEND_URL = resolveBackendUrl();

// Google will not accept a redirect_uri pointing at a private LAN IP
// (192.168.x.x) — it must be a real public HTTPS URL or localhost.
// Use ngrok to tunnel your local backend during dev, then paste the
// https://xxxx.ngrok-free.app URL here. Update this each time your
// ngrok URL changes (or use a reserved/static ngrok domain to avoid that).
export const GOOGLE_REDIRECT_URI =
  "https://sixfold-document-bucktooth.ngrok-free.dev/auth/google/callback";

// Public — safe to embed, this is the Client ID only, never the secret.
export const GOOGLE_CLIENT_ID =
  "951483915022-b7ape69mbclro6jlhnjrm7650qmftcuk.apps.googleusercontent.com";