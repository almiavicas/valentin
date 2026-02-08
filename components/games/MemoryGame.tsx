"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { MemoryGameConfig } from "@/data/days";
import { useAudio } from "@/components/audio/AudioProvider";

type MemoryCard = {
  id: string;
  image: string;
  pairId: number;
};

type MemoryGameProps = {
  config: MemoryGameConfig;
  onComplete: () => void;
};

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function MemoryGame({ config, onComplete }: MemoryGameProps) {
  const cards = useMemo<MemoryCard[]>(() => {
    const selectedImages = config.images.slice(0, config.pairCount);
    const pairs = selectedImages.flatMap((image, index) => [
      { id: `${index}-a`, image, pairId: index },
      { id: `${index}-b`, image, pairId: index }
    ]);
    return shuffleArray(pairs);
  }, [config.images, config.pairCount]);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const { playFlip } = useAudio();

  function handleFlip(card: MemoryCard) {
    if (blocked) return;
    if (flipped.includes(card.id)) return;
    if (matchedPairs.includes(card.pairId)) return;
    if (flipped.length === 2) return;

    playFlip();
    setFlipped((prev) => [...prev, card.id]);
  }

  useEffect(() => {
    if (flipped.length !== 2) return;

    setMoves((prev) => prev + 1);
    const [first, second] = flipped.map((id) => cards.find((card) => card.id === id));
    if (!first || !second) return;

    if (first.pairId === second.pairId) {
      setMatchedPairs((prev) => [...prev, first.pairId]);
      setFlipped([]);
      return;
    }

    setBlocked(true);
    const timer = setTimeout(() => {
      setFlipped([]);
      setBlocked(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [cards, flipped]);

  useEffect(() => {
    if (!hasCompleted && matchedPairs.length === config.pairCount) {
      setHasCompleted(true);
      onComplete();
    }
  }, [config.pairCount, hasCompleted, matchedPairs, onComplete]);

  return (
    <section className="memory-game">
      <p className="memory-meta">
        Parejas: {matchedPairs.length}/{config.pairCount} | Movimientos: {moves}
      </p>
      <div className="memory-grid">
        {cards.map((card) => {
          const isFlipped =
            flipped.includes(card.id) || matchedPairs.includes(card.pairId);

          return (
            <button
              key={card.id}
              type="button"
              className={`memory-card ${isFlipped ? "revealed" : ""}`}
              onClick={() => handleFlip(card)}
            >
              {isFlipped ? (
                <Image
                  src={card.image}
                  alt="Recuerdo de pareja"
                  fill
                  sizes="(max-width: 768px) 25vw, 120px"
                />
              ) : (
                <span>{"\u2665"}</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
