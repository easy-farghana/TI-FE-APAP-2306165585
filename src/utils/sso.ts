export interface SSOPayload {
  token: string | null;
  username: string | null;
}

const baseAuthURL = import.meta.env.VITE_AUTH_URL;

export function openSSOPopup(providerUrl: string = baseAuthURL + "/sso-popup"): Promise<SSOPayload> {
  return new Promise((resolve, reject) => {

    // 1. Calculate center of screen for a nice popup experience
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // 2. Open the popup
    const popup = window.open(
        providerUrl,
        "SSO_LOGIN_WINDOW",
        `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!popup) {
      reject(new Error("Popup blocked by browser. Please allow popups."));
      return;
    }

    // 3. Define the Message Handler
    const messageHandler = (event: MessageEvent) => {
      // SECURITY: Ensure message comes from the specific provider origin
      // Extract origin from the providerUrl to compare accurately
      const targetOrigin = new URL(providerUrl).origin;

      if (event.origin !== targetOrigin) return;
      if (event.data?.type !== "SSO_RESPONSE") return;

      // Clean up: Remove listener and interval
      cleanup();

      // Return the data
      resolve(event.data.payload);
    };

    // 4. Define a poller to check if user closed the window manually
    let checkClosedInterval: number | null = window.setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error("User closed the login window"));
      }
    }, 1000);

    // Helper to clean up memory
    const cleanup = () => {
      window.removeEventListener("message", messageHandler);
      if (checkClosedInterval) clearInterval(checkClosedInterval);
    };

    // 5. Start listening
    window.addEventListener("message", messageHandler);
  });
}