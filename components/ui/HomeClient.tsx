"use client";

import { useEffect, useMemo, useState } from "react";
import { DayCard } from "@/components/ui/DayCard";
import { days } from "@/data/days";

type ProgressMap = Record<number, boolean>;

function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  const progress: ProgressMap = {};
  for (const day of days) {
    progress[day.dayNumber] =
      window.localStorage.getItem(`day-${day.dayNumber}-completed`) === "true";
  }
  return progress;
}

export function HomeClient() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const forceUnlockAll = false;

  useEffect(() => {
    const refresh = () => setProgress(readProgress());

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("progress-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("progress-updated", refresh);
    };
  }, []);

  const nextUnlockedDay = useMemo(() => {
    if (forceUnlockAll) return days.length;
    for (const day of days) {
      if (day.dayNumber === 1) continue;
      if (!progress[day.dayNumber - 1]) {
        return day.dayNumber - 1;
      }
    }
    return days.length;
  }, [progress]);

  return (
    <>
      <section className="home-hero">
        <p className="hero-kicker">Nuestro rincon 💕</p>
        <h1>San Valentin en Minijuegos 💘</h1>
        <p>
          Cada dia desbloquea un juego nuevo. Al terminarlo, encontraras un mensaje
          especial para ti 🥰.
        </p>
      </section>

      <section className="home-progress">
        <p>
          Progreso: {Object.values(progress).filter(Boolean).length}/{days.length} ❤️
        </p>
        <p>Dia actual habilitado: {nextUnlockedDay} ✨</p>
      </section>

      <section className="days-grid">
        {days.map((day) => {
          const unlocked =
            forceUnlockAll ||
            day.dayNumber === 1 ||
            Boolean(progress[day.dayNumber - 1]);
          const completed = Boolean(progress[day.dayNumber]);

          return (
            <DayCard
              key={day.dayNumber}
              day={day}
              unlocked={unlocked}
              completed={completed}
            />
          );
        })}
      </section>
    </>
  );
}
