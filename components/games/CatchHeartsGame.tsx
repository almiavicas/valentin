"use client";

import { useEffect, useRef, useState } from "react";
import type { CatchGameConfig } from "@/data/days";
import { useAudio } from "@/components/audio/AudioProvider";

type Heart = {
  id: number;
  x: number;
  y: number;
  driftMs: number;
  delayMs: number;
};

type CatchHeartsGameProps = {
  config: CatchGameConfig;
  onComplete: () => void;
};

export function CatchHeartsGame({ config, onComplete }: CatchHeartsGameProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.durationSeconds);
  const [ended, setEnded] = useState(false);
  const [won, setWon] = useState(false);
  const idRef = useRef(0);
  const { playClick, playSuccess } = useAudio();

  useEffect(() => {
    if (ended) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [ended]);

  useEffect(() => {
    if (ended || won) return;

    const spawner = window.setInterval(() => {
      const id = idRef.current++;
      const x = Math.floor(Math.random() * 82) + 4;
      const y = Math.floor(Math.random() * 72) + 8;
      const driftMs = Math.floor(Math.random() * 450) + 650;
      const delayMs = Math.floor(Math.random() * 300);

      setHearts((prev) => [...prev, { id, x, y, driftMs, delayMs }]);

      window.setTimeout(() => {
        setHearts((prev) => prev.filter((heart) => heart.id !== id));
      }, 1300);
    }, config.spawnMs);

    return () => window.clearInterval(spawner);
  }, [config.spawnMs, ended, won]);

  useEffect(() => {
    if (score >= config.targetScore && !won) {
      setWon(true);
      setEnded(true);
      playSuccess();
      onComplete();
    }
  }, [config.targetScore, onComplete, playSuccess, score, won]);

  function resetGame() {
    setHearts([]);
    setScore(0);
    setTimeLeft(config.durationSeconds);
    setEnded(false);
    setWon(false);
    idRef.current = 0;
  }

  return (
    <section className="catch-game">
      <p className="catch-meta">
        ❤️ Puntaje: {score}/{config.targetScore} | ⏱️ Tiempo: {timeLeft}s
      </p>

      <div className="catch-board" aria-label="Area de juego para atrapar corazones">
        {hearts.map((heart) => (
          <button
            key={heart.id}
            type="button"
            className="heart-target"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              animationDuration: `${heart.driftMs}ms`,
              animationDelay: `${heart.delayMs}ms`
            }}
            onClick={() => {
              playClick();
              setScore((prev) => prev + 1);
              setHearts((prev) => prev.filter((item) => item.id !== heart.id));
            }}
          >
            💖
          </button>
        ))}
      </div>

      {ended && !won ? (
        <div className="game-inline-result">
          <p>Te faltaron algunos corazones 💔 Intentalo otra vez.</p>
          <button type="button" onClick={resetGame}>
            Reintentar 💞
          </button>
        </div>
      ) : null}

      {ended ? (
        <div className="catch-actions">
          <button type="button" onClick={resetGame}>
            Reiniciar 🔄
          </button>
        </div>
      ) : null}
    </section>
  );
}
