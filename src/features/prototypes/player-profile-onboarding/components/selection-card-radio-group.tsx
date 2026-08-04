"use client";

import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react";
import { RadioGroup } from "radix-ui";
import { cn } from "@/lib/utils";
import { prototypeStyles } from "../player-profile-onboarding-prototype.styles";

type SelectionCardOption = Readonly<{
  id: string;
  title: string;
  friendlyName?: string;
  description?: string;
  accessibleLabel?: string;
}>;

type SelectionCardRadioGroupProps = Readonly<{
  ariaDescribedBy: string;
  ariaInvalid: boolean;
  ariaLabel: string;
  disabled?: boolean;
  firstItemRef?: (element: HTMLButtonElement | null) => void;
  gridClassName: string;
  onBlur?: () => void;
  onValueChange: (value: string) => void;
  options: ReadonlyArray<SelectionCardOption>;
  value: string;
}>;

function SelectionCardRadioGroup({
  ariaDescribedBy,
  ariaInvalid,
  ariaLabel,
  disabled,
  firstItemRef,
  gridClassName,
  onBlur,
  onValueChange,
  options,
  value,
}: SelectionCardRadioGroupProps) {
  return (
    <RadioGroup.Root
      data-slot="radio-group"
      className={gridClassName}
      disabled={disabled}
      value={value}
      required
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid || undefined}
      onBlur={onBlur}
      onValueChange={onValueChange}
    >
      {options.map((option, index) => (
        <RadioGroup.Item
          key={option.id}
          ref={index === 0 ? firstItemRef : undefined}
          value={option.id}
          aria-label={option.accessibleLabel}
          className={cn(prototypeStyles.radioCard, "group/choice")}
        >
          <span className={prototypeStyles.radioIndicator}>
            <CircleIcon
              className="size-5 group-data-[state=checked]/choice:hidden"
              aria-hidden="true"
            />
            <RadioGroup.Indicator>
              <CheckCircleIcon
                className="hidden size-5 group-data-[state=checked]/choice:block"
                weight="fill"
                aria-hidden="true"
              />
            </RadioGroup.Indicator>
          </span>
          <span className={prototypeStyles.radioText}>
            <span className={prototypeStyles.radioTitleRow}>
              <span className={prototypeStyles.radioTitle}>{option.title}</span>
              {option.friendlyName ? (
                <span className={prototypeStyles.radioFriendly}>
                  {option.friendlyName}
                </span>
              ) : null}
            </span>
            {option.description ? (
              <span className={prototypeStyles.radioDescription}>
                {option.description}
              </span>
            ) : null}
          </span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}

export { SelectionCardRadioGroup };
export type { SelectionCardOption };
