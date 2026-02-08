"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAudio } from "@/components/audio/AudioProvider";
import { CatchHeartsGame } from "@/components/games/CatchHeartsGame";
import { JigsawGame } from "@/components/games/JigsawGame";
import { MemoryGame } from "@/components/games/MemoryGame";
import { QuizGame } from "@/components/games/QuizGame";
import { TimelineSortGame } from "@/components/games/TimelineSortGame";
import { TreasureHuntGame } from "@/components/games/TreasureHuntGame";
import { WordScrambleGame } from "@/components/games/WordScrambleGame";
import { GameShell } from "@/components/ui/GameShell";
import { LoveMessageModal } from "@/components/ui/LoveMessageModal";
import type { DayConfig } from "@/data/days";

type GameDayClientProps = {
  dayConfig: DayConfig;
};

export function GameDayClient({ dayConfig }: GameDayClientProps) {
  const [showMessage, setShowMessage] = useState(false);
  const forceUnlockAll = false;
  const [unlocked, setUnlocked] = useState(forceUnlockAll || dayConfig.dayNumber === 1);
  const { playSuccess, playClick } = useAudio();

  useEffect(() => {
    if (forceUnlockAll) {
      setUnlocked(true);
      return;
    }

    if (dayConfig.dayNumber === 1) {
      setUnlocked(true);
      return;
    }

    const previousCompleted =
      window.localStorage.getItem(`day-${dayConfig.dayNumber - 1}-completed`) === "true";

    setUnlocked(previousCompleted);
  }, [dayConfig.dayNumber, forceUnlockAll]);

  const blockedText = useMemo(
    () => `Completa el Dia ${dayConfig.dayNumber - 1} para desbloquear este minijuego 💘.`,
    [dayConfig.dayNumber]
  );

  function completeDay() {
    setShowMessage(true);
    playSuccess();

    if (typeof window !== "undefined") {
      window.localStorage.setItem(`day-${dayConfig.dayNumber}-completed`, "true");
      window.dispatchEvent(new Event("progress-updated"));
    }
  }

  if (!unlocked) {
    return (
      <GameShell day={dayConfig}>
        <div className="game-locked">
          <p>{blockedText}</p>
          <Link href="/">Volver al inicio 🏠</Link>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell day={dayConfig}>
      {dayConfig.gameType === "quiz" && dayConfig.quiz ? (
        <QuizGame config={dayConfig.quiz} onComplete={completeDay} />
      ) : null}

      {dayConfig.gameType === "memory" && dayConfig.memory ? (
        <MemoryGame config={dayConfig.memory} onComplete={completeDay} />
      ) : null}

      {dayConfig.gameType === "jigsaw" && dayConfig.jigsaw ? (
        <JigsawGame config={dayConfig.jigsaw} onComplete={completeDay} />
      ) : null}

      {dayConfig.gameType === "catch" && dayConfig.catch ? (
        <CatchHeartsGame config={dayConfig.catch} onComplete={completeDay} />
      ) : null}

      {dayConfig.gameType === "scramble" && dayConfig.scramble ? (
        <WordScrambleGame config={dayConfig.scramble} onComplete={completeDay} />
      ) : null}

      {dayConfig.gameType === "timeline" && dayConfig.timeline ? (
        <TimelineSortGame config={dayConfig.timeline} onComplete={completeDay} />
      ) : null}

      {dayConfig.gameType === "treasure" && dayConfig.treasure ? (
        <TreasureHuntGame config={dayConfig.treasure} onComplete={completeDay} />
      ) : null}

      <div className="game-actions">
        <Link
          href="/"
          onClick={() => {
            playClick();
          }}
        >
          Volver al inicio 🏠
        </Link>
      </div>

      {showMessage ? (
        <LoveMessageModal
          message={dayConfig.loveMessage}
          onClose={() => {
            playClick();
            setShowMessage(false);
          }}
        />
      ) : null}
    </GameShell>
  );
}
