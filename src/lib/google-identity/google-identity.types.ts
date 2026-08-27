type GoogleCredentialResponse = Readonly<{
  credential?: string;
  select_by?: string;
  state?: string;
}>;

type GoogleIdentityConfiguration = Readonly<{
  auto_select?: boolean;
  callback: (response: GoogleCredentialResponse) => void;
  client_id: string;
  ux_mode?: "popup" | "redirect";
}>;

type GoogleButtonConfiguration = Readonly<{
  click_listener?: () => void;
  locale?: string;
  logo_alignment?: "center" | "left";
  shape?: "circle" | "pill" | "rectangular" | "square";
  size?: "large" | "medium" | "small";
  text?: "continue_with" | "signin" | "signin_with" | "signup_with";
  theme?: "filled_black" | "filled_blue" | "outline" | "outline_dark";
  type: "icon" | "standard";
  width?: string;
}>;

type GoogleIdentityServices = Readonly<{
  accounts: Readonly<{
    id: Readonly<{
      initialize: (configuration: GoogleIdentityConfiguration) => void;
      cancel: () => void;
      prompt: () => void;
      renderButton: (
        parent: HTMLElement,
        configuration: GoogleButtonConfiguration,
      ) => void;
    }>;
  }>;
}>;

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

export type {
  GoogleButtonConfiguration,
  GoogleCredentialResponse,
  GoogleIdentityConfiguration,
  GoogleIdentityServices,
};
