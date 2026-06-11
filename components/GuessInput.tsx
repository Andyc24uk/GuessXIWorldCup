"use client";

import { FormEvent, useMemo, useState } from "react";
import { searchPlayers } from "@/lib/gameLogic";

type GuessInputProps = {
  disabled: boolean;
  onSubmit: (guess: string) => void;
};

export default function GuessInput({ disabled, onSubmit }: GuessInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const suggestions = useMemo(() => searchPlayers(value), [value]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const guess = value.trim();
    if (!guess || disabled) {
      return;
    }
    onSubmit(guess);
    setValue("");
    setFocused(false);
  }

  return (
    <form className="guess-form" onSubmit={handleSubmit}>
      <div>
        <input
          aria-label="Guess player name"
          autoComplete="off"
          className="guess-input"
          disabled={disabled}
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Type a player name"
          value={value}
        />
        {focused && value ? (
          <div className="suggestions" role="listbox">
            {suggestions.map((player) => (
              <button
                className="suggestion-button"
                key={player.id}
                onMouseDown={(event) => {
                  event.preventDefault();
                  setValue(player.displayName);
                  setFocused(false);
                }}
                type="button"
              >
                {player.displayName}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <button className="primary-button" disabled={disabled} type="submit">
        Submit Guess
      </button>
    </form>
  );
}
