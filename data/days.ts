export type GameType =
  | "quiz"
  | "memory"
  | "jigsaw"
  | "catch"
  | "scramble"
  | "timeline"
  | "treasure";

export type QuizQuestion = {
  prompt: string;
  options: string[];
  correctIndex: number;
};

export type QuizGameConfig = {
  questions: QuizQuestion[];
};

export type MemoryGameConfig = {
  images: string[];
  pairCount: number;
};

export type JigsawGameConfig = {
  image: string;
  gridSize: number;
};

export type CatchGameConfig = {
  durationSeconds: number;
  targetScore: number;
  spawnMs: number;
};

export type ScrambleGameConfig = {
  words: string[];
};

export type TimelineGameConfig = {
  events: string[];
};

export type TreasureClue = {
  clue: string;
  answer: string;
};

export type TreasureGameConfig = {
  clues: TreasureClue[];
};

export type DayConfig = {
  dayNumber: number;
  title: string;
  subtitle: string;
  gameType: GameType;
  instructions: string;
  loveMessage: string;
  quiz?: QuizGameConfig;
  memory?: MemoryGameConfig;
  jigsaw?: JigsawGameConfig;
  catch?: CatchGameConfig;
  scramble?: ScrambleGameConfig;
  timeline?: TimelineGameConfig;
  treasure?: TreasureGameConfig;
};

export const days: DayConfig[] = [
  {
    dayNumber: 1,
    title: "Quiz de Amor 💌",
    subtitle: "¿Que tanto recuerdas de nosotros? 💭",
    gameType: "quiz",
    instructions: "Responde todas las preguntas para desbloquear tu mensaje 💘.",
    loveMessage:
      "Me encanta que conozcas cada detalle de nuestra historia ❤️. Te amo mucho 🫶.",
    quiz: {
      questions: [
        {
          prompt: "¿Qué cosa amo verte hacer?",
          options: ["Bailar", "Cocinar", "Dormir"],
          correctIndex: 0
        },
        {
          prompt: "¿Qué nos encanta hacer los sábados?",
          options: ["Ir de compras", "Día de flojitos", "Levantar temprano"],
          correctIndex: 1
        },
        {
          prompt: "¿Cuál es tu apodo que sólo yo te digo?",
          options: ["Mi osita <3", "Princesa", "Cariño"],
          correctIndex: 0
        }
      ]
    }
  },
  {
    dayNumber: 2,
    title: "Memoria de Nosotros 📸",
    subtitle: "Encuentra todas las parejas de fotos 💞",
    gameType: "memory",
    instructions: "Voltea cartas y empareja las fotos de nuestros momentos ✨.",
    loveMessage:
      "Cada recuerdo contigo es mi lugar favorito 🌹. Gracias por existir en mi vida ❤️.",
    memory: {
      images: [
        "/20260123_195800.jpg",
        "/20260113_191026.jpg",
        "/20260113_190950.jpg",
        "/20260110_221204.jpg",
        "/20251231_235423.jpg",
        "/20251224_201102.jpg",
        "/20251219_182634.jpg",
        "/20251116_191225.jpg"
      ],
      pairCount: 6
    }
  },
  {
    dayNumber: 3,
    title: "Rompecabezas de Nosotros 🧩",
    subtitle: "Ordena la foto para reconstruir el recuerdo 💗",
    gameType: "jigsaw",
    instructions:
      "Toca dos piezas para intercambiarlas hasta completar la imagen 📷.",
    loveMessage:
      "Contigo todo encaja perfecto 💞. Mi lugar favorito siempre sera a tu lado 🫂.",
    jigsaw: {
      image: "/20251108_220854.jpg",
      gridSize: 3
    }
  },
  {
    dayNumber: 4,
    title: "Atrapa Corazones 💖",
    subtitle: "Haz click en corazones antes de que desaparezcan",
    gameType: "catch",
    instructions: "Atrapa 14 corazones dentro del tiempo ⏱️.",
    loveMessage:
      "Siempre atrapas mi corazon incluso en mis dias dificiles 💓. Gracias por cuidarme 🥰.",
    catch: {
      durationSeconds: 25,
      targetScore: 14,
      spawnMs: 700
    }
  },
  {
    dayNumber: 5,
    title: "Palabras Mezcladas ✍️",
    subtitle: "Ordena palabras romanticas y nuestras claves 💌",
    gameType: "scramble",
    instructions: "Escribe cada palabra correctamente para avanzar 💫.",
    loveMessage:
      "Tu nombre siempre ordena todo lo bonito en mi cabeza y en mi vida ❤️.",
    scramble: {
      words: [
        "amor",
        "abrazos",
        "nosotros",
        "complice",
        "besitos",
        "siempre",
        "infinito",
        "osita"
      ]
    }
  },
  {
    dayNumber: 6,
    title: "Linea del Tiempo 🕰️",
    subtitle: "Ordena nuestros momentos del mas antiguo al mas reciente",
    gameType: "timeline",
    instructions: "Usa subir y bajar para acomodar los eventos 🫶.",
    loveMessage:
      "Cada etapa contigo supera la anterior 💗. Quiero seguir creando historia juntos ✨.",
    timeline: {
      events: [
        "Pedirte el numero",
        "Bailar contigo",
        "Tomar cafe picante",
        "Tomar cafe con harina",
        "Ir a Francia",
        "Pedirte la mano",
        "Casarnos"
      ]
    }
  },
  {
    dayNumber: 7,
    title: "Busqueda del Tesoro 🔎",
    subtitle: "Resuelve pistas finales para abrir el mensaje especial 💎",
    gameType: "treasure",
    instructions: "Responde cada pista con una palabra corta.",
    loveMessage:
      "Eres mi premio final y mi mejor comienzo 💍. Feliz San Valentin, mi amor ❤️.",
    treasure: {
      clues: [
        {
          clue: "Lugar donde te pedi la mano",
          answer: "Viena"
        },
        {
          clue: "Ciudad de nuestro primer viaje juntos",
          answer: "Caracas"
        },
        {
          clue: "Años de casados",
          answer: "1"
        }
      ]
    }
  }
];

export function getDay(dayNumber: number): DayConfig | undefined {
  return days.find((day) => day.dayNumber === dayNumber);
}
