"use client";

import { useEffect, useMemo, useState } from "react";
import AdSlot from "@/components/AdSlot";
import AnswerKitGraphic from "@/components/AnswerKitGraphic";
import ClueList from "@/components/ClueList";
import GuessInput from "@/components/GuessInput";
import { buildClues, createShareText, isCorrectGuess } from "@/lib/gameLogic";
import { getPlayerById } from "@/lib/players";
import { createInitialStoredGame, loadStoredGame, saveStoredGame } from "@/lib/storage";
import type { DailyGameSlot, StoredGameResult } from "@/lib/types";

type GameCardProps = {
  slot: DailyGameSlot;
};

export default function GameCard({ slot }: GameCardProps) {
  const player = getPlayerById(slot.playerId);
  const [game, setGame] = useState<StoredGameResult | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const clues = useMemo(() => {
    if (!player) {
      return [];
    }
    return buildClues(player, slot.mode, `${slot.dateKey}:${slot.slot}:${player.id}`);
  }, [player, slot.dateKey, slot.mode, slot.slot]);

  useEffect(() => {
    if (!player) {
      return;
    }
    const stored = loadStoredGame(slot.dateKey, slot.mode, slot.slot);
    setGame(stored?.playerId === player.id ? stored : createInitialStoredGame(slot.dateKey, slot.mode, slot.slot, player.id));
  }, [player, slot.dateKey, slot.mode, slot.slot]);

  useEffect(() => {
    if (game) {
      saveStoredGame(game);
    }
  }, [game]);

  if (!player || !game) {
    return <section className="game-card">Loading today&apos;s game...</section>;
  }

  const activePlayer = player;
  const activeGame = game;
  const completed = game.completed;
  const revealedCount = completed ? clues.length : Math.min(game.revealedCount, clues.length);
  const kitRevealed = clues.slice(0, revealedCount).some((clue) => clue.key === "kit");

  function revealNextClue() {
    setGame((current) => {
      if (!current || current.completed) {
        return current;
      }

      const nextRevealedCount = Math.min(current.revealedCount + 1, clues.length);
      return {
        ...current,
        revealedCount: nextRevealedCount,
        completed: false,
        solved: false
      };
    });
  }

  function submitGuess(guess: string) {
    setGame((current) => {
      if (!current || current.completed) {
        return current;
      }

      const solved = isCorrectGuess(guess, activePlayer);
      const nextGuesses = [...current.guesses, guess];
      const finalGuessMissed = !solved && current.revealedCount >= clues.length;
      const nextRevealedCount = solved || finalGuessMissed ? current.revealedCount : Math.min(current.revealedCount + 1, clues.length);

      return {
        ...current,
        guesses: nextGuesses,
        revealedCount: nextRevealedCount,
        completed: solved || finalGuessMissed,
        solved,
        completedAt: solved || finalGuessMissed ? new Date().toISOString() : current.completedAt
      };
    });
  }

  async function copyShareText() {
    const text = createShareText(slot.mode, activeGame.solved, revealedCount);
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <section className="game-card" aria-label={`Game ${slot.slot + 1}`}>
      <div className="shirt-stage">
        {completed ? (
          <AnswerKitGraphic player={player} />
        ) : kitRevealed ? (
          <AnswerKitGraphic player={player} showCaption={false} showPrint={false} />
        ) : (
          <figure className="shirt-placeholder-figure" aria-label="Mystery player shirt">
            <img className="shirt-placeholder-img" src="/kits/shirt-placeholder-question.png" alt="" />
          </figure>
        )}
        {completed || !kitRevealed ? (
          <div className="shirt-caption">
            <strong>{completed ? player.displayName : "Mystery player"}</strong>
            {completed ? <span>{`${player.nation} - ${player.position}`}</span> : null}
          </div>
        ) : null}
      </div>

      <div className="game-main">
        <div className="status-row">
          <span className="mode-tag">Daily Game</span>
          <span className="progress-text">
            Clue {revealedCount} of {clues.length}
          </span>
        </div>

        <ClueList clues={clues} revealedCount={revealedCount} />

        {completed ? (
          <div className={game.solved ? "result-box success" : "result-box miss"}>
            <strong>{game.solved ? "Correct" : "Answer revealed"}</strong>
            <span>
              {player.displayName} was the player.{" "}
              {game.solved ? `Solved with ${revealedCount} clue${revealedCount === 1 ? "" : "s"}.` : "Try the next daily game."}
            </span>
          </div>
        ) : (
          <GuessInput disabled={completed} onSubmit={submitGuess} />
        )}

        {game.guesses.length ? (
          <div className="guess-history">Guesses: {game.guesses.join(", ")}</div>
        ) : null}

        <div className="actions-row">
          <button className="secondary-button" disabled={completed || revealedCount >= clues.length} onClick={revealNextClue} type="button">
            Reveal next clue
          </button>
          {completed ? (
            <button className="secondary-button" onClick={copyShareText} type="button">
              {copyState === "copied" ? "Copied result" : copyState === "failed" ? "Copy unavailable" : "Copy result"}
            </button>
          ) : null}
        </div>

        {completed ? <AdSlot placement="post-game" /> : null}
      </div>
    </section>
  );
}
