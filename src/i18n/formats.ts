import type { Formats } from "next-intl";

const I18N_FORMATS = {
  dateTime: {
    dateTime: {
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
    shortDate: {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
    time: {
      hour: "2-digit",
      minute: "2-digit",
    },
  },
  number: {
    currencyBRL: {
      currency: "BRL",
      style: "currency",
    },
    decimal: {
      maximumFractionDigits: 2,
    },
    percent: {
      maximumFractionDigits: 1,
      style: "percent",
    },
  },
} satisfies Formats;

export { I18N_FORMATS };
