"use client";

import { useEffect, useMemo, useState } from "react";
import type { JigsawGameConfig } from "@/data/days";
import { useAudio } from "@/components/audio/AudioProvider";

type JigsawGameProps = {
  config: JigsawGameConfig;
  onComplete: () => void;
};

function buildShuffledBoard(totalPieces: number) {
  const board = Array.from({ length: totalPieces }, (_, i) => i);
  for (let i = board.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }
  return board;
}

export function JigsawGame({ config, onComplete }: JigsawGameProps) {
  const totalPieces = config.gridSize * config.gridSize;
  const [board, setBoard] = useState<number[]>(() => buildShuffledBoard(totalPieces));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [boardWidth, setBoardWidth] = useState(360);
  const { playFlip } = useAudio();

  const boardHeight = useMemo(
    () => Math.max(200, Math.round(boardWidth / aspectRatio)),
    [aspectRatio, boardWidth]
  );

  const pieceWidth = useMemo(
    () => Math.round(boardWidth / config.gridSize),
    [boardWidth, config.gridSize]
  );

  const pieceHeight = useMemo(
    () => Math.round(boardHeight / config.gridSize),
    [boardHeight, config.gridSize]
  );

  useEffect(() => {
    const image = new window.Image();
    image.src = config.image;
    image.onload = () => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        setAspectRatio(image.naturalWidth / image.naturalHeight);
      }
    };
  }, [config.image]);

  useEffect(() => {
    const updateBoardWidth = () => {
      const maxAllowed = 560;
      const viewportBased = window.innerWidth - 72;
      setBoardWidth(Math.max(240, Math.min(maxAllowed, viewportBased)));
    };

    updateBoardWidth();
    window.addEventListener("resize", updateBoardWidth);
    return () => window.removeEventListener("resize", updateBoardWidth);
  }, []);

  function handlePieceClick(index: number) {
    if (solved) return;
    playFlip();

    if (selectedIndex === null) {
      setSelectedIndex(index);
      return;
    }

    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }

    setBoard((prev) => {
      const copy = [...prev];
      [copy[selectedIndex], copy[index]] = [copy[index], copy[selectedIndex]];
      return copy;
    });
    setMoves((prev) => prev + 1);
    setSelectedIndex(null);
  }

  useEffect(() => {
    const isSolved = board.every((pieceId, index) => pieceId === index);
    if (isSolved && !solved) {
      setSolved(true);
      onComplete();
    }
  }, [board, onComplete, solved]);

  return (
    <section className="jigsaw-game">
      <p className="jigsaw-meta">
        Movimientos: {moves} | Estado: {solved ? "Completado" : "En progreso"}
      </p>
      <div
        className="jigsaw-grid"
        style={{
          gridTemplateColumns: `repeat(${config.gridSize}, ${pieceWidth}px)`,
          gridTemplateRows: `repeat(${config.gridSize}, ${pieceHeight}px)`
        }}
      >
        {board.map((pieceId, index) => {
          const x = pieceId % config.gridSize;
          const y = Math.floor(pieceId / config.gridSize);
          const selected = selectedIndex === index;

          return (
            <button
              type="button"
              key={`slot-${index}`}
              className={`jigsaw-piece ${selected ? "selected" : ""}`}
              onClick={() => handlePieceClick(index)}
              style={{
                width: pieceWidth,
                height: pieceHeight,
                backgroundImage: `url(${config.image})`,
                backgroundSize: `${boardWidth}px ${boardHeight}px`,
                backgroundPosition: `${-x * pieceWidth}px ${-y * pieceHeight}px`
              }}
            >
              <span className="sr-only">Pieza {pieceId + 1}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
