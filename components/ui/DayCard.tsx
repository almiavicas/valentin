import Link from "next/link";
import type { DayConfig } from "@/data/days";

type DayCardProps = {
  day: DayConfig;
  unlocked: boolean;
  completed: boolean;
};

export function DayCard({ day, unlocked, completed }: DayCardProps) {
  if (!unlocked) {
    return (
      <article className="day-card day-card-locked" aria-disabled="true">
        <p className="day-number">Dia {day.dayNumber} 🔒</p>
        <h2>{day.title}</h2>
        <p>{day.subtitle}</p>
        <span className="day-status">Bloqueado hasta completar el dia anterior 💔</span>
      </article>
    );
  }

  return (
    <Link href={`/day/${day.dayNumber}`} className="day-card">
      <p className="day-number">Dia {day.dayNumber} 💝</p>
      <h2>{day.title}</h2>
      <p>{day.subtitle}</p>
      <span className="day-link">{completed ? "Rejugar 🔁" : "Jugar ▶️"}</span>
      {completed ? <span className="day-status">Completado ✅</span> : null}
    </Link>
  );
}
