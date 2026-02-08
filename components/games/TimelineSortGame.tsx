"use client";

import { useEffect, useMemo, useState } from "react";
import type { TimelineGameConfig } from "@/data/days";
import { useAudio } from "@/components/audio/AudioProvider";

type TimelineSortGameProps = {
  config: TimelineGameConfig;
  onComplete: () => void;
};

function shuffled<T>(items: T[]): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export function TimelineSortGame({ config, onComplete }: TimelineSortGameProps) {
  const original = useMemo(() => [...config.events], [config.events]);
  const [items, setItems] = useState<string[]>(() => [...config.events]);
  const [won, setWon] = useState(false);
  const { playClick, playSuccess } = useAudio();

  useEffect(() => {
    setItems(shuffled(config.events));
    setWon(false);
  }, [config.events]);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    playClick();
    setItems((prev) => {
      const copy = [...prev];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  function validate() {
    playClick();
    const ok = items.every((event, idx) => event === original[idx]);
    if (!ok) return;

    if (!won) {
      setWon(true);
      playSuccess();
      onComplete();
    }
  }

  return (
    <section className="timeline-game">
      <ol className="timeline-list">
        {items.map((event, index) => (
          <li key={`${event}-${index}`}>
            <span>{event}</span>
            <div className="timeline-actions">
              <button type="button" onClick={() => move(index, -1)}>
                ⬆️
              </button>
              <button type="button" onClick={() => move(index, 1)}>
                ⬇️
              </button>
            </div>
          </li>
        ))}
      </ol>

      <div className="timeline-footer">
        <button type="button" onClick={validate}>
          Revisar orden 🕰️
        </button>
        {won ? <p>Orden perfecto 💞</p> : null}
      </div>
    </section>
  );
}
