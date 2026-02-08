import type { Metadata } from "next";
import { AudioProvider } from "@/components/audio/AudioProvider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Nuestro San Valentin",
  description: "Minijuegos romanticos para jugar cada dia."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
