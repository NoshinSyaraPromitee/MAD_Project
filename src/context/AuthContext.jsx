import React, { createContext, useContext, useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { BACKEND_URL, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from "../config";

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app boot
  useEffect(() => {
    (async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("authToken");
        const storedUser = await SecureStore.getItemAsync("authUser");
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const loginWithGoogle = async () => {
    // This is the exp://<ip>:<port>/... URI Expo Go generates for this
    // device/network right now. We hand it to the backend as `state` so
    // it knows where to send the browser back after the exchange.
    const redirectUri = AuthSession.makeRedirectUri();

    const googleAuthUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${GOOGLE_CLIENT_ID}` +
      // Google rejects private-network IPs (like your LAN IP) as a redirect_uri
      // unless device_id/device_name are supplied (a different, TV-auth flow).
      // GOOGLE_REDIRECT_URI (from config.js) is your ngrok public URL —
      // update it there, not here, each time you restart ngrok.
      `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
      "&response_type=code" +
      "&scope=openid%20email%20profile" +
      `&state=${encodeURIComponent(redirectUri)}`;

    const result = await WebBrowser.openAuthSessionAsync(googleAuthUrl, redirectUri);

    if (result.type !== "success") {
      // User cancelled, or something went wrong — not necessarily an error
      // worth surfacing loudly, just don't log them in.
      return { success: false };
    }

    // Don't rely on result.url containing the token — Expo Go's deep link
    // handling doesn't reliably preserve query params on this redirect.
    // Instead, fetch it directly from the backend using the same
    // redirectUri we sent as `state`.
    let jwt;
    try {
      const response = await fetch(
        `${GOOGLE_REDIRECT_URI.replace(/\/auth\/google\/callback$/, "")}/auth/google/session/${encodeURIComponent(redirectUri)}`
      );
      if (!response.ok) {
        console.error("Failed to fetch session token, status:", response.status);
        return { success: false };
      }
      const data = await response.json();
      jwt = data.token;
    } catch (err) {
      console.error("Error fetching session token:", err);
      return { success: false };
    }

    if (!jwt) {
      console.error("No token returned from session endpoint");
      return { success: false };
    }

    // Decode the JWT payload just to get userId/email for local state —
    // NOT verifying the signature here, that already happened server-side.
    const payloadBase64 = jwt.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));

    const loggedInUser = { _id: payload.userId, email: payload.email };

    await SecureStore.setItemAsync("authToken", jwt);
    await SecureStore.setItemAsync("authUser", JSON.stringify(loggedInUser));

    setToken(jwt);
    setUser(loggedInUser);

    return { success: true };
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("authUser");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}