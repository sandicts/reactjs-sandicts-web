import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlayerProfileOnboardingPrototype } from "@/features/prototypes/player-profile-onboarding/player-profile-onboarding-prototype";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PlayerProfileOnboardingPrototype.metadata");

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function PlayerProfileOnboardingPrototypePage() {
  return <PlayerProfileOnboardingPrototype />;
}
