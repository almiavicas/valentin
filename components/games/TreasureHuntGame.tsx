"use client";

import { useState } from "react";
import type { TreasureGameConfig } from "@/data/days";
import { useAudio } from "@/components/audio/AudioProvider";

type TreasureHuntGameProps = {
  config: TreasureGameConfig;
  onComplete: () => void;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function TreasureHuntGame({ config, onComplete }: TreasureHuntGameProps) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const { playClick, playSuccess } = useAudio();

  const clue = config.clues[index];

  function submit() {
    playClick();
    if (!clue) return;

    if (normalize(input) !== normalize(clue.answer)) {
      setError("Pista incorrecta, intenta de nuevo 💭");
      return;
    }

    setError("");
    setInput("");

    if (index === config.clues.length - 1) {
      setCompleted(true);
      playSuccess();
      onComplete();
      return;
    }

    setIndex((prev) => prev + 1);
  }

  return (
    <section className="treasure-game">
      {!completed ? (
        <>
          <p className="treasure-progress">
            Pista {index + 1}/{config.clues.length}
          </p>
          <p className="treasure-clue">🔎 {clue.clue}</p>
          <div className="treasure-form">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Tu respuesta"
              aria-label="Respuesta de pista"
            />
            <button type="button" onClick={submit}>
              Confirmar 💌
            </button>
          </div>
          {error ? <p className="scramble-error">{error}</p> : null}
        </>
      ) : (
        <p className="game-inline-result">Tesoro desbloqueado 💎❤️</p>
      )}
    </section>
  );
}
