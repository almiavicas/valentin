import { notFound } from "next/navigation";
import { GameDayClient } from "@/app/day/[day]/GameDayClient";
import { days, getDay } from "@/data/days";

type DayPageProps = {
  params: Promise<{ day: string }>;
};

export function generateStaticParams() {
  return days.map((day) => ({ day: String(day.dayNumber) }));
}

export default async function DayPage({ params }: DayPageProps) {
  const dayParam = Number((await params).day);
  const dayConfig = getDay(dayParam);

  if (!dayConfig) {
    notFound();
  }

  return <GameDayClient dayConfig={dayConfig} />;
}
