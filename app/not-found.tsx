import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <h1>Ups, este dia no existe 💔</h1>
      <p>Vuelve al inicio y elige uno de los dias disponibles 💞.</p>
      <Link href="/">Ir al inicio 🏠</Link>
    </main>
  );
}
