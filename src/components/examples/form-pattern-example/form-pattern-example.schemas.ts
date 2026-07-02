import { z } from "zod";

const formPatternExampleSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Enter at least 2 characters.")
    .max(80, "Enter no more than 80 characters."),
  email: z.string().trim().pipe(z.email("Enter a valid email address.")),
});

type FormPatternExampleInput = z.input<typeof formPatternExampleSchema>;
type FormPatternExampleValues = z.output<typeof formPatternExampleSchema>;

export { formPatternExampleSchema };
export type { FormPatternExampleInput, FormPatternExampleValues };
