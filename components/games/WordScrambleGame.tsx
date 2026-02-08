"use client";

import { useMemo, useState } from "react";
import type { ScrambleGameConfig } from "@/data/days";
import { useAudio } from "@/components/audio/AudioProvider";

type WordScrambleGameProps = {
  config: ScrambleGameConfig;
  onComplete: () => void;
};

function shuffleWord(word: string): string {
  const chars = word.split("");
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  const mixed = chars.join("");
  return mixed === word ? chars.reverse().join("") : mixed;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function WordScrambleGame({ config, onComplete }: WordScrambleGameProps) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const { playClick, playSuccess } = useAudio();

  const currentWord = config.words[index];
  const scrambled = useMemo(() => {
    if (!currentWord) return "";
    return shuffleWord(currentWord);
  }, [currentWord]);

  function submitWord() {
    playClick();
    if (!currentWord) return;

    if (normalize(input) !== normalize(currentWord)) {
      setError("Ups, esa no era 😅");
      return;
    }

    setError("");
    setInput("");

    if (index === config.words.length - 1) {
      setCompleted(true);
      playSuccess();
      onComplete();
      return;
    }

    setIndex((prev) => prev + 1);
  }

  return (
    <section className="scramble-game">
      <p className="scramble-meta">
        Palabra {Math.min(index + 1, config.words.length)}/{config.words.length}
      </p>

      {!completed ? (
        <>
          <p className="scramble-word">{scrambled}</p>
          <div className="scramble-form">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribe la palabra 💌"
              aria-label="Respuesta"
            />
            <button type="button" onClick={submitWord}>
              Validar ✨
            </button>
          </div>
          {error ? <p className="scramble-error">{error}</p> : null}
        </>
      ) : (
        <p className="game-inline-result">Todas correctas 💘</p>
      )}
    </section>
  );
}
