"use client";

import type { ReactNode } from "react";
import type { DayConfig } from "@/data/days";

type GameShellProps = {
  day: DayConfig;
  children: ReactNode;
};

export function GameShell({ day, children }: GameShellProps) {
  return (
    <main className="game-shell">
      <div className="game-shell-bg" />
      <section className="game-shell-content">
        <p className="game-kicker">Dia {day.dayNumber} 💘</p>
        <h1>{day.title}</h1>
        <p className="game-subtitle">{day.subtitle}</p>
        <p className="game-instructions">{day.instructions}</p>
        {children}
      </section>
    </main>
  );
}
