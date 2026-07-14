import { ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { publicHomeScreenStyles } from "../public-home-screen.styles";
import type { PublicHomeStatusCardProps } from "../public-home-screen.types";
import { PublicHomeSignalRow } from "./public-home-signal-row";

function PublicHomeStatusCard({
  eyebrow,
  title,
  status,
  description,
  signals,
}: PublicHomeStatusCardProps) {
  return (
    <aside className={publicHomeScreenStyles.statusCardAside}>
      <Card className={publicHomeScreenStyles.statusCard.root}>
        <CardHeader className={publicHomeScreenStyles.statusCard.header}>
          <div>
            <p className={publicHomeScreenStyles.statusCard.eyebrow}>
              {eyebrow}
            </p>
            <h2 className={publicHomeScreenStyles.statusCard.title}>{title}</h2>
          </div>
          <ShieldCheck
            className={publicHomeScreenStyles.statusCard.icon}
            aria-hidden="true"
          />
        </CardHeader>
        <CardContent className={publicHomeScreenStyles.statusCard.content}>
          <Alert variant="success">
            <ShieldCheck aria-hidden="true" />
            <AlertTitle>{status}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
          </Alert>
          {signals.map(({ id, label, value }) => (
            <PublicHomeSignalRow key={id} label={label} value={value} />
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}

export { PublicHomeStatusCard };
