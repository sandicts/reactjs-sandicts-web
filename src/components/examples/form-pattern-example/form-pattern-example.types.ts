import type { FormPatternExampleValues } from "./form-pattern-example.schemas";

type FormPatternExampleProps = Readonly<{
  onSubmit: (values: FormPatternExampleValues) => Promise<void> | void;
}>;

export type { FormPatternExampleProps };
