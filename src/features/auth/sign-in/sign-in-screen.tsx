import { CheckCircleIcon } from "@phosphor-icons/react/ssr";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { SignInSessionSurface } from "./components/sign-in-session-surface";
import { signInScreenStyles } from "./sign-in-screen.styles";
import type { SignInScreenProps } from "./sign-in-screen.types";

function SignInScreen(props: SignInScreenProps) {
  const t = useTranslations("SignIn");

  return (
    <main id="shell-main" className={signInScreenStyles.root}>
      <div className={signInScreenStyles.container}>
        <section className={signInScreenStyles.introduction}>
          <p className={signInScreenStyles.eyebrow}>{t("eyebrow")}</p>
          <h1 className={signInScreenStyles.title}>{t("title")}</h1>
          <p className={signInScreenStyles.description}>{t("description")}</p>
          <ul className={signInScreenStyles.benefits}>
            <li className={signInScreenStyles.benefit}>
              <CheckCircleIcon
                aria-hidden="true"
                className={signInScreenStyles.benefitIcon}
              />
              {t("benefits.session")}
            </li>
            <li className={signInScreenStyles.benefit}>
              <CheckCircleIcon
                aria-hidden="true"
                className={signInScreenStyles.benefitIcon}
              />
              {t("benefits.contexts")}
            </li>
          </ul>
        </section>

        <aside className={signInScreenStyles.surface}>
          <Card className={signInScreenStyles.card}>
            <CardHeader className={signInScreenStyles.cardHeader}>
              <p className={signInScreenStyles.cardEyebrow}>
                {t("surface.eyebrow")}
              </p>
              <h2 className={signInScreenStyles.cardTitle}>
                {t("surface.title")}
              </h2>
              <CardDescription className={signInScreenStyles.cardDescription}>
                {t("surface.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className={signInScreenStyles.cardContent}>
              <SignInSessionSurface {...props} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

export { SignInScreen };
