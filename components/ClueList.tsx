import type { Clue } from "@/lib/types";

type ClueListProps = {
  clues: Clue[];
  revealedCount: number;
};

export default function ClueList({ clues, revealedCount }: ClueListProps) {
  return (
    <ol className="clue-list" aria-label="Clues">
      {clues.map((clue, index) => {
        const revealed = index < revealedCount;
        return (
          <li className={revealed ? "clue-item" : "clue-item locked"} key={`${clue.key}-${index}`}>
            <span className="clue-label">Clue {index + 1}: {clue.label}</span>
            <span className="clue-value">{revealed ? clue.value : "Locked"}</span>
          </li>
        );
      })}
    </ol>
  );
}
