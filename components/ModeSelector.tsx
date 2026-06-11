import type { GameMode } from "@/lib/types";

type ModeSelectorProps = {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
};

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="mode-selector" role="tablist" aria-label="Select game mode">
      <button
        aria-selected={mode === "casual"}
        className={mode === "casual" ? "mode-button active" : "mode-button"}
        onClick={() => onChange("casual")}
        role="tab"
        type="button"
      >
        Casual
      </button>
      <button
        aria-selected={mode === "ultra"}
        className={mode === "ultra" ? "mode-button active" : "mode-button"}
        onClick={() => onChange("ultra")}
        role="tab"
        type="button"
      >
        Ultra
      </button>
    </div>
  );
}
