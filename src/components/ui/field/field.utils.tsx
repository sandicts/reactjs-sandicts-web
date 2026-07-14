import type { ReactNode } from "react";
import { fieldStyles } from "./field.styles";
import type { FieldErrorItem } from "./field.types";

function getFieldErrorContent(
  children: ReactNode,
  errors?: Array<FieldErrorItem | undefined>,
) {
  if (children) {
    return children;
  }

  if (!errors?.length) {
    return null;
  }

  const uniqueErrors = [
    ...new Map(errors.map((error) => [error?.message, error])).values(),
  ];

  if (uniqueErrors.length === 1) {
    return uniqueErrors[0]?.message;
  }

  return (
    <ul className={fieldStyles.errorList}>
      {uniqueErrors.map(
        (error, index) =>
          error?.message && <li key={index}>{error.message}</li>,
      )}
    </ul>
  );
}

export { getFieldErrorContent };
