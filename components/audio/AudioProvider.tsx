"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

type AudioContextValue = {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicReady: boolean;
  toggleMusic: () => void;
  toggleSfx: () => void;
  playClick: () => void;
  playFlip: () => void;
  playSuccess: () => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

function useSafeAudioContext() {
  const audioRef = useRef<AudioContext | null>(null);

  const ensureContext = useCallback(() => {
    if (typeof window === "undefined") return null;

    if (!audioRef.current) {
      const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      audioRef.current = new Ctx();
    }

    if (audioRef.current.state === "suspended") {
      void audioRef.current.resume();
    }

    return audioRef.current;
  }, []);

  return ensureContext;
}

type ToneOptions = {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  delay?: number;
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicReady, setMusicReady] = useState(true);
  const ensureContext = useSafeAudioContext();
  const musicTimer = useRef<number | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const playTone = useCallback(
    ({ frequency, duration, type = "sine", volume = 0.04, delay = 0 }: ToneOptions) => {
      const ctx = ensureContext();
      if (!ctx) return;

      const startAt = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, startAt);
      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(volume, startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startAt);
      osc.stop(startAt + duration + 0.03);
    },
    [ensureContext]
  );

  const playClick = useCallback(() => {
    if (!sfxEnabled) return;
    playTone({ frequency: 620, duration: 0.08, type: "triangle", volume: 0.03 });
  }, [playTone, sfxEnabled]);

  const playFlip = useCallback(() => {
    if (!sfxEnabled) return;
    playTone({ frequency: 520, duration: 0.09, type: "square", volume: 0.025 });
  }, [playTone, sfxEnabled]);

  const playSuccess = useCallback(() => {
    if (!sfxEnabled) return;
    playTone({ frequency: 523, duration: 0.11, type: "triangle", volume: 0.03 });
    playTone({ frequency: 659, duration: 0.12, type: "triangle", volume: 0.03, delay: 0.1 });
    playTone({ frequency: 784, duration: 0.14, type: "triangle", volume: 0.03, delay: 0.2 });
  }, [playTone, sfxEnabled]);

  useEffect(() => {
    const savedMusic = window.localStorage.getItem("audio-music-enabled");
    const savedSfx = window.localStorage.getItem("audio-sfx-enabled");

    if (savedMusic === "true") setMusicEnabled(true);
    if (savedSfx === "false") setSfxEnabled(false);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("audio-music-enabled", String(musicEnabled));

    if (!musicRef.current) {
      musicRef.current = new Audio("/audio/lover.mp3");
      musicRef.current.loop = true;
      musicRef.current.volume = 0.35;
      musicRef.current.preload = "auto";
      musicRef.current.addEventListener("error", () => {
        setMusicReady(false);
      });
    }

    if (!musicEnabled) {
      void musicRef.current.pause();
      return;
    }

    musicRef.current
      .play()
      .then(() => setMusicReady(true))
      .catch(() => setMusicReady(false));
  }, [musicEnabled]);

  useEffect(() => {
    return () => {
      if (musicTimer.current) {
        window.clearInterval(musicTimer.current);
      }
      if (musicRef.current) {
        musicRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("audio-sfx-enabled", String(sfxEnabled));
  }, [sfxEnabled]);

  const value = useMemo(
    () => ({
      musicEnabled,
      sfxEnabled,
      musicReady,
      toggleMusic: () => setMusicEnabled((prev) => !prev),
      toggleSfx: () => setSfxEnabled((prev) => !prev),
      playClick,
      playFlip,
      playSuccess
    }),
    [musicEnabled, sfxEnabled, musicReady, playClick, playFlip, playSuccess]
  );

  return (
    <AudioCtx.Provider value={value}>
      {children}
      <AudioDock />
    </AudioCtx.Provider>
  );
}

function AudioDock() {
  const audio = useAudio();

  return (
    <aside className="audio-dock" aria-label="Controles de audio">
      <p>Audio</p>
      <button
        type="button"
        onClick={() => {
          audio.toggleMusic();
          audio.playClick();
        }}
      >
        Musica: {audio.musicEnabled ? "On" : "Off"}
      </button>
      <button
        type="button"
        onClick={() => {
          audio.toggleSfx();
          audio.playClick();
        }}
      >
        Efectos: {audio.sfxEnabled ? "On" : "Off"}
      </button>
      {!audio.musicReady ? (
        <span className="audio-note">Agrega /public/audio/lover.mp3</span>
      ) : null}
    </aside>
  );
}

export function useAudio() {
  const value = useContext(AudioCtx);
  if (!value) {
    throw new Error("useAudio must be used inside AudioProvider");
  }
  return value;
}
