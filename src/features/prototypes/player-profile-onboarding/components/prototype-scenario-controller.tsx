"use client";

import { FlaskIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { PROTOTYPE_SCENARIOS } from "../player-profile-onboarding-prototype.constants";
import { prototypeStyles } from "../player-profile-onboarding-prototype.styles";
import type {
  PrototypeScenarioGroup,
  PrototypeScenarioId,
} from "../player-profile-onboarding-prototype.types";

type PrototypeScenarioControllerProps = Readonly<{
  scenarioId: PrototypeScenarioId;
  onScenarioChange: (scenarioId: PrototypeScenarioId) => void;
}>;

const scenarioGroups = [
  "form",
  "loadingAndReads",
  "catalogs",
  "commands",
  "sessionAndExit",
  "routing",
] as const satisfies ReadonlyArray<PrototypeScenarioGroup>;

function PrototypeScenarioController({
  onScenarioChange,
  scenarioId,
}: PrototypeScenarioControllerProps) {
  const t = useTranslations("PlayerProfileOnboardingPrototype.prototype");
  const scenarioT = useTranslations(
    "PlayerProfileOnboardingPrototype.scenarios",
  );

  return (
    <aside
      className={prototypeStyles.scenarioArea}
      aria-labelledby="prototype-controller-title"
    >
      <div className={prototypeStyles.scenarioPanel}>
        <div>
          <h2
            id="prototype-controller-title"
            className={prototypeStyles.scenarioHeading}
          >
            <FlaskIcon aria-hidden="true" />
            {t("controllerTitle")}
          </h2>
          <p className={prototypeStyles.scenarioDescription}>
            {scenarioT(`${scenarioId}.description`)}
          </p>
        </div>
        <div>
          <label
            htmlFor="prototype-scenario"
            className="mb-1.5 block text-sm font-medium"
          >
            {t("scenarioLabel")}
          </label>
          <select
            id="prototype-scenario"
            className={prototypeStyles.scenarioSelect}
            value={scenarioId}
            onChange={(event) =>
              onScenarioChange(event.currentTarget.value as PrototypeScenarioId)
            }
          >
            {scenarioGroups.map((group) => (
              <optgroup key={group} label={t(`groups.${group}`)}>
                {PROTOTYPE_SCENARIOS.filter(
                  (scenario) => scenario.group === group,
                ).map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenarioT(`${scenario.id}.label`)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}

export { PrototypeScenarioController };
