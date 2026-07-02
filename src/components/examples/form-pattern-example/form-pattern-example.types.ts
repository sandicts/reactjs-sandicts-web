import type { FormEventHandler } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type {
  FormPatternExampleInput,
  FormPatternExampleValues,
} from "./form-pattern-example.schemas";

type FormPatternExampleProps = Readonly<{
  onSubmit: (values: FormPatternExampleValues) => Promise<void> | void;
}>;

type UseFormPatternExampleResult = Readonly<{
  errors: FieldErrors<FormPatternExampleInput>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  register: UseFormRegister<FormPatternExampleInput>;
}>;

export type { FormPatternExampleProps, UseFormPatternExampleResult };
