"use client";

import {
  CaretDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Popover } from "radix-ui";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { prototypeStyles } from "../player-profile-onboarding-prototype.styles";
import type {
  PrototypeScenarioId,
  SportOption,
} from "../player-profile-onboarding-prototype.types";
import {
  filterSports,
  findSport,
} from "../player-profile-onboarding-prototype.utils";
import { useMediaQuery } from "../hooks/use-media-query";

type SportCatalogSearchProps = Readonly<{
  ariaDescribedBy: string;
  ariaInvalid: boolean;
  ariaLabel: string;
  disabled?: boolean;
  onBlur?: () => void;
  onValueChange: (sportId: string) => void;
  scenarioId: PrototypeScenarioId;
  sports: ReadonlyArray<SportOption>;
  triggerRef?: (element: HTMLButtonElement | null) => void;
  value: string;
}>;

type SearchPanelProps = Readonly<{
  activeIndex: number;
  filteredSports: ReadonlyArray<SportOption>;
  inputId: string;
  listboxId: string;
  onActiveIndexChange: (index: number) => void;
  onQueryChange: (query: string) => void;
  onSelect: (sportId: string) => void;
  query: string;
  selectedSportId: string;
}>;

function SearchPanel({
  activeIndex,
  filteredSports,
  inputId,
  listboxId,
  onActiveIndexChange,
  onQueryChange,
  onSelect,
  query,
  selectedSportId,
}: SearchPanelProps) {
  const t = useTranslations("PlayerProfileOnboardingPrototype.catalogSearch");
  const inputRef = useRef<HTMLInputElement>(null);
  const activeOptionId =
    filteredSports.length > 0
      ? `${listboxId}-option-${filteredSports[activeIndex]?.id}`
      : undefined;

  useEffect(() => {
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!filteredSports.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      onActiveIndexChange((activeIndex + 1) % filteredSports.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      onActiveIndexChange(
        (activeIndex - 1 + filteredSports.length) % filteredSports.length,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const activeSport = filteredSports[activeIndex];
      if (activeSport) {
        onSelect(activeSport.id);
      }
    }
  }

  return (
    <>
      <div className={prototypeStyles.searchField}>
        <MagnifyingGlassIcon
          className={prototypeStyles.searchIcon}
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          role="combobox"
          aria-label={t("searchLabel")}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded="true"
          aria-activedescendant={activeOptionId}
          autoComplete="off"
          className={prototypeStyles.searchInput}
          id={inputId}
          placeholder={t("placeholder")}
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {filteredSports.length ? (
        <div
          id={listboxId}
          role="listbox"
          className={prototypeStyles.listbox}
          aria-label={t("resultsLabel")}
        >
          {filteredSports.map((sport, index) => (
            <button
              key={sport.id}
              id={`${listboxId}-option-${sport.id}`}
              type="button"
              role="option"
              aria-selected={sport.id === selectedSportId}
              data-active={index === activeIndex}
              className={prototypeStyles.option}
              onClick={() => onSelect(sport.id)}
              onMouseMove={() => onActiveIndexChange(index)}
            >
              <span>{sport.name}</span>
              {sport.id === selectedSportId ? (
                <CheckIcon weight="bold" aria-hidden="true" />
              ) : null}
            </button>
          ))}
        </div>
      ) : (
        <div id={listboxId} role="status" className={prototypeStyles.noResults}>
          {t("noResults")}
        </div>
      )}

      {query ? (
        <Button
          type="button"
          size="lg"
          variant="ghost"
          className={prototypeStyles.clearSearch}
          onClick={() => onQueryChange("")}
        >
          {t("clear")}
        </Button>
      ) : null}
    </>
  );
}

function SportCatalogSearch({
  ariaDescribedBy,
  ariaInvalid,
  ariaLabel,
  disabled,
  onBlur,
  onValueChange,
  scenarioId,
  sports,
  triggerRef,
  value,
}: SportCatalogSearchProps) {
  const t = useTranslations("PlayerProfileOnboardingPrototype.catalogSearch");
  const isDesktop = useMediaQuery("(min-width: 48rem)");
  const id = useId();
  const listboxId = `${id}-sport-listbox`;
  const inputId = `${id}-sport-search`;
  const [open, setOpen] = useState(scenarioId === "searchNoResults");
  const [query, setQuery] = useState(
    scenarioId === "searchNoResults" ? "Natação" : "",
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedSport = findSport(sports, value);
  const filteredSports = useMemo(
    () => filterSports(sports, query),
    [query, sports],
  );

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    setActiveIndex(0);
  }

  function selectSport(sportId: string) {
    onValueChange(sportId);
    setOpen(false);
  }

  const trigger = (
    <Button
      ref={triggerRef}
      type="button"
      role="combobox"
      variant="outline"
      disabled={disabled}
      aria-controls={listboxId}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-expanded={open}
      aria-invalid={ariaInvalid || undefined}
      aria-required="true"
      className={prototypeStyles.comboboxTrigger}
      onBlur={onBlur}
    >
      <span>{selectedSport?.name ?? t("triggerPlaceholder")}</span>
      <CaretDownIcon aria-hidden="true" />
    </Button>
  );

  const searchPanel = (
    <SearchPanel
      activeIndex={activeIndex}
      filteredSports={filteredSports}
      inputId={inputId}
      listboxId={listboxId}
      query={query}
      selectedSportId={value}
      onActiveIndexChange={setActiveIndex}
      onQueryChange={updateQuery}
      onSelect={selectSport}
    />
  );

  if (isDesktop) {
    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            side="bottom"
            align="start"
            sideOffset={8}
            className={prototypeStyles.comboboxContent}
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <p className="mb-3 font-heading text-sm font-semibold">
              {t("title")}
            </p>
            {searchPanel}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="bottom"
        closeLabel={t("close")}
        className="max-h-[85dvh]"
      >
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {searchPanel}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { SportCatalogSearch };
