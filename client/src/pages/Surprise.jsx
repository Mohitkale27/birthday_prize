import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Client-side only (you can change this anytime)
// The decoded phrase (3 words):
const SECRET_ANSWER = "laddoo pandi forever";

// The "amalgamation" clue (anagram-style scrambled words).
// You can reshuffle these letters anytime.
const CLUE_WORDS = ["odlado", "idnap", "revrefo"];

export default function Surprise() {
  const navigate = useNavigate();
  const expected = useMemo(
    () => SECRET_ANSWER.trim().toLowerCase().replace(/\s+/g, " "),
    [],
  );
  const inputRefs = useRef([]);
  const [words, setWords] = useState(["", "", ""]);
  const [status, setStatus] = useState("locked"); // locked | error | unlocked

  const unlocked = status === "unlocked";
  const error = status === "error";

  const typedPhrase = useMemo(
    () =>
      words
        .map((w) => String(w || "").trim())
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .replace(/\s+/g, " "),
    [words],
  );

  useEffect(() => {
    // Avoid popping the keyboard on small screens; focus only on larger screens.
    if (window.innerWidth >= 640) {
      inputRefs.current[0]?.focus?.();
    }
  }, []);

  function onSubmit(e) {
    e.preventDefault();

    if (!typedPhrase) {
      setStatus("error");
      return;
    }

    if (typedPhrase === expected) {
      setStatus("unlocked");
      try {
        window.localStorage.setItem("birthday_unlocked", "1");
      } catch {
        // ignore
      }
    } else {
      setStatus("error");
    }
  }

  return (
    <main className="surprise">
      <section
        className={`surprise__card ${unlocked ? "surprise__card--unlocked" : ""}`}
        aria-label="Surprise unlock"
      >
        <div className="surprise__icon" aria-hidden="true">
          {unlocked ? "🔓" : "🔒"}
        </div>

        <p className="surprise__eyebrow">One last puzzle</p>
        <h1 className="surprise__title">A Little Secret for You 🔒</h1>

        {unlocked ? (
          <p className="surprise__message surprise__message--success">
            Yay! You unlocked it.
          </p>
        ) : error ? (
          <p className="surprise__message surprise__message--error" role="alert">
            Almost… try again. Hint: three words… you, me, forever (our nicknames).
          </p>
        ) : (
          <p className="surprise__message">
            Three little words. One big meaning. Put them in the right order.
          </p>
        )}

        {!unlocked ? (
          <form className="surprise__form" onSubmit={onSubmit}>
            <div className="surprise__clue" aria-label="Clue words">
              {CLUE_WORDS.map((w, idx) => (
                <span className="surprise__clueChip" key={`${w}-${idx}`}>
                  {w}
                </span>
              ))}
            </div>

            <label className="surprise__label" htmlFor="secretWord1">
              Decoded words
            </label>

            <div className="surprise__words" aria-label="Decoded words">
              {["Word 1", "Word 2", "Word 3"].map((placeholder, idx) => (
                <input
                  // eslint-disable-next-line react/no-array-index-key
                  key={idx}
                  id={idx === 0 ? "secretWord1" : undefined}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  className="surprise__wordInput"
                  value={words[idx]}
                  onChange={(e) => {
                    const raw = e.target.value;

                    // If user pastes/types multiple words, distribute across inputs.
                    const parts = raw.split(/\s+/).filter(Boolean);
                    if (parts.length > 1) {
                      const next = [...words];
                      for (let j = 0; j < parts.length && idx + j < 3; j += 1) {
                        next[idx + j] = parts[j];
                      }
                      setWords(next);
                      inputRefs.current[Math.min(2, idx + parts.length)]?.focus?.();
                      return;
                    }

                    // Single word: keep value, but if it ends with a space, jump to next field.
                    const trimmedEnd = raw.replace(/\s+$/, "");
                    const next = [...words];
                    next[idx] = trimmedEnd;
                    setWords(next);

                    if (raw.endsWith(" ") && idx < 2) {
                      inputRefs.current[idx + 1]?.focus?.();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (idx < 2) {
                        e.preventDefault();
                        inputRefs.current[idx + 1]?.focus?.();
                      }
                    }
                  }}
                  placeholder={placeholder}
                  autoComplete="off"
                  inputMode="text"
                />
              ))}
            </div>

            <button className="surprise__submit" type="submit">
              Unlock
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="surprise__open"
            onClick={() => navigate("/timeline")}
          >
            Start the Surprise 🎁
          </button>
        )}
      </section>
    </main>
  );
}
