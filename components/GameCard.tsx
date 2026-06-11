"use client";

import { useEffect, useMemo, useState } from "react";
import AdSlot from "@/components/AdSlot";
import AnswerKitGraphic from "@/components/AnswerKitGraphic";
import ClueList from "@/components/ClueList";
import GuessInput from "@/components/GuessInput";
import {
  trackAnswerRevealed,
  trackClueRevealed,
  trackCopyResult,
  trackGameFailed,
  trackGameSolved,
  trackGameStart,
  trackGuessSubmitted
} from "@/lib/analytics";
import { applyGuessToGame, buildClues, createShareText, isCorrectGuess } from "@/lib/gameLogic";
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
    if (slot.isPromo) {
      setGame(createInitialStoredGame(slot.dateKey, slot.mode, slot.slot, player.id));
      return;
    }

    const stored = loadStoredGame(slot.dateKey, slot.mode, slot.slot);
    setGame(stored?.playerId === player.id ? stored : createInitialStoredGame(slot.dateKey, slot.mode, slot.slot, player.id));
  }, [player, slot.dateKey, slot.isPromo, slot.mode, slot.slot]);

  useEffect(() => {
    if (game && !slot.isPromo) {
      saveStoredGame(game);
    }
  }, [game, slot.isPromo]);

  useEffect(() => {
    if (!player || !game) {
      return;
    }

    trackGameStart(getAnalyticsProperties(player, slot, {
      clueNumber: Math.min(game.revealedCount, clues.length)
    }));
  }, [clues.length, game?.playerId, player, slot]);

  if (!player || !game) {
    return <section className="game-card">Loading today&apos;s game...</section>;
  }

  const activePlayer = player;
  const activeGame = game;
  const completed = game.completed;
  const revealedCount = completed ? clues.length : Math.min(game.revealedCount, clues.length);
  const solvedClueCount = game.solvedClueCount ?? Math.min(game.revealedCount, clues.length);
  const kitRevealed = clues.slice(0, revealedCount).some((clue) => clue.key === "kit");

  function revealNextClue() {
    setGame((current) => {
      if (!current || current.completed) {
        return current;
      }

      const nextRevealedCount = Math.min(current.revealedCount + 1, clues.length);
      trackClueRevealed(getAnalyticsProperties(activePlayer, slot, {
        clueNumber: nextRevealedCount
      }));
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
      const previousClueCount = Math.min(current.revealedCount, clues.length);
      const nextGame = applyGuessToGame(current, guess, activePlayer, clues.length);
      const clueWasRevealed = !nextGame.completed && nextGame.revealedCount > previousClueCount;

      trackGuessSubmitted(getAnalyticsProperties(activePlayer, slot, {
        clueNumber: previousClueCount,
        solved
      }));

      if (clueWasRevealed) {
        trackClueRevealed(getAnalyticsProperties(activePlayer, slot, {
          clueNumber: nextGame.revealedCount
        }));
      }

      if (nextGame.solved) {
        trackGameSolved(getAnalyticsProperties(activePlayer, slot, {
          clueNumber: nextGame.solvedClueCount,
          cluesUsed: nextGame.solvedClueCount,
          solved: true
        }));
      } else if (nextGame.completed) {
        trackGameFailed(getAnalyticsProperties(activePlayer, slot, {
          clueNumber: clues.length,
          cluesUsed: clues.length,
          solved: false
        }));
        trackAnswerRevealed(getAnalyticsProperties(activePlayer, slot, {
          clueNumber: clues.length,
          solved: false
        }));
      }

      return nextGame;
    });
  }

  async function copyShareText() {
    const text = createShareText(slot.mode, activeGame.solved, activeGame.solved ? solvedClueCount : revealedCount);
    try {
      await navigator.clipboard.writeText(text);
      trackCopyResult(getAnalyticsProperties(activePlayer, slot, {
        cluesUsed: activeGame.solved ? solvedClueCount : revealedCount,
        solved: activeGame.solved
      }));
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <section className="game-card" aria-label={`Game ${slot.slot + 1}`}>
      <div className="shirt-stage">
        {completed ? (
          <AnswerKitGraphic player={player} showCaption={false} />
        ) : kitRevealed ? (
          <AnswerKitGraphic player={player} showCaption={false} showPrint={false} />
        ) : (
          <figure className="shirt-placeholder-figure" aria-label="Mystery player shirt">
            <img className="shirt-placeholder-img" src="/kits/shirt-placeholder-question.png" alt="" />
          </figure>
        )}
        {completed || !kitRevealed ? (
          <div className={completed ? "shirt-caption answer-caption" : "shirt-caption"}>
            <strong>{completed ? player.displayName : "Mystery player"}</strong>
            {completed ? <span>{`${player.nation} - ${player.position}`}</span> : null}
          </div>
        ) : null}
      </div>

      <div className="game-main">
        <div className="status-row">
          <span className="mode-tag">{slot.isPromo ? "Promo Preview" : "Daily Game"}</span>
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
              {game.solved ? `Solved with ${solvedClueCount} clue${solvedClueCount === 1 ? "" : "s"}.` : "Try the next daily game."}
            </span>
          </div>
        ) : (
          <GuessInput disabled={completed} onSubmit={submitGuess} />
        )}

        {game.guesses.length ? (
          <div className="guess-history">Guesses: {game.guesses.join(", ")}</div>
        ) : null}

        <div className="actions-row">
          {!completed ? (
            <button className="secondary-button" disabled={revealedCount >= clues.length} onClick={revealNextClue} type="button">
              Reveal next clue
            </button>
          ) : null}
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

function getAnalyticsProperties(
  player: NonNullable<ReturnType<typeof getPlayerById>>,
  slot: DailyGameSlot,
  extras: Record<string, string | number | boolean | undefined> = {}
): Record<string, string | number | boolean | undefined> {
  return {
    gameSlot: slot.slot,
    playerId: player.id,
    nation: player.nation,
    fameTier: player.fameTier,
    isPromo: Boolean(slot.isPromo),
    selectionMode: slot.selectionMode ?? (slot.isPromo ? "promo" : "daily-random"),
    seedType: slot.seedType ?? (slot.isPromo ? "promo" : "user-day"),
    ...extras
  };
}
