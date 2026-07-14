import { publicHomeScreenStyles } from "../public-home-screen.styles";
import type { PublicHomeSignalRowProps } from "./public-home-signal-row.types";

function PublicHomeSignalRow({ label, value }: PublicHomeSignalRowProps) {
  return (
    <div className={publicHomeScreenStyles.signalRow.root}>
      <span className={publicHomeScreenStyles.signalRow.label}>{label}</span>
      <strong className={publicHomeScreenStyles.signalRow.value}>
        {value}
      </strong>
    </div>
  );
}

export { PublicHomeSignalRow };
