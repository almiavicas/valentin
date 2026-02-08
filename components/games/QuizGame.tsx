"use client";

import { useMemo, useState } from "react";
import type { QuizGameConfig } from "@/data/days";
import { useAudio } from "@/components/audio/AudioProvider";

type QuizGameProps = {
  config: QuizGameConfig;
  onComplete: () => void;
};

export function QuizGame({ config, onComplete }: QuizGameProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const { playClick } = useAudio();

  const score = useMemo(() => {
    return config.questions.reduce((acc, question, index) => {
      if (answers[index] === question.correctIndex) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [answers, config.questions]);

  const isComplete = score === config.questions.length && submitted;

  function handleSubmit() {
    setSubmitted(true);
    playClick();
    if (score === config.questions.length) {
      onComplete();
    }
  }

  return (
    <section className="quiz-game">
      {config.questions.map((question, questionIndex) => (
        <article key={question.prompt} className="quiz-question">
          <p>
            {questionIndex + 1}. {question.prompt}
          </p>
          <div className="quiz-options">
            {question.options.map((option, optionIndex) => {
              const selected = answers[questionIndex] === optionIndex;
              return (
                <button
                  type="button"
                  key={option}
                  className={selected ? "selected" : undefined}
                  onClick={() => {
                    playClick();
                    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </article>
      ))}
      <div className="quiz-footer">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== config.questions.length}
        >
          Revisar respuestas
        </button>
        {submitted && !isComplete ? (
          <p>
            Acertaste {score} de {config.questions.length}. Intentalo otra vez.
          </p>
        ) : null}
      </div>
    </section>
  );
}
