"use client";

import { useTranslations } from "next-intl";
import { AlertDialog } from "radix-ui";
import type { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { prototypeStyles } from "../player-profile-onboarding-prototype.styles";

type ExitConfirmationDialogProps = Readonly<{
  open: boolean;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}>;

function ExitConfirmationDialog({
  onConfirm,
  onOpenChange,
  open,
  returnFocusRef,
}: ExitConfirmationDialogProps) {
  const t = useTranslations(
    "PlayerProfileOnboardingPrototype.exitConfirmation",
  );

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={prototypeStyles.dialogOverlay} />
        <AlertDialog.Content
          className={prototypeStyles.dialogContent}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocusRef.current?.focus();
          }}
        >
          <AlertDialog.Title className={prototypeStyles.dialogTitle}>
            {t("title")}
          </AlertDialog.Title>
          <AlertDialog.Description
            className={prototypeStyles.dialogDescription}
          >
            {t("description")}
          </AlertDialog.Description>
          <div className={prototypeStyles.dialogActions}>
            <AlertDialog.Cancel asChild>
              <Button type="button" variant="outline" size="lg">
                {t("safeAction")}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                type="button"
                variant="destructive"
                size="lg"
                onClick={onConfirm}
              >
                {t("discardAction")}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export { ExitConfirmationDialog };
