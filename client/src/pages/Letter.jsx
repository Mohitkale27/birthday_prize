import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Edit this letter anytime 💖 (use new lines freely)
const LETTER_TEXT = `Dear Laddoo ❤️,

Saglyat adhi, Happy Birthday To You! 🎂

You are the best thing that’s ever happened to me — the reason behind my smile and my happiness every morning.

Jevha pasun tu mala ushta pani dila, tevha pasunach dokyat sairat che gane suru jhale 😘. 
Ani tu disli ki   te constant butterflies, ti excitement… roj school madhe tula baghaychi ti constant longing,
ni school samplyavar tu nasnyachi ti void…
Mag punha tula bolne instant change in life depression to celebration, tich butterflies, tich excitement .
Aaj pan tu disli ki tich feeling yeti —
jashi first time tula baghun aali hoti. Tich nervousness, tech goosebumps, ani tech butterflies... ❤️

I love your smile, your voice, your energy — tujha sagla kahi.
Tujhi chid-chid pan 😉. Everything about you is perfect Pillu. Especially Tujhi nose , Ani tujhi eyes ani tujhe mutated dimples 😁.

Wishing you a beautiful year ahead, laddoo 🧿.
Tu nehmi confident rah, khush raha, vichar kami kar, ani smile jast kar.
Mi nehmi tujhyasobat ahe — always loving you, always admiring you, always falling for you more, and more and more.

11:11🧿💫
Keep smiling, pillu.

I love you endlesslly. ❤️
Yours forever,
Pandi 🐼`;

function splitLines(text) {
  return String(text).replace(/\r\n/g, "\n").split("\n");
}

export default function Letter() {
  const navigate = useNavigate();
  const lines = useMemo(() => splitLines(LETTER_TEXT), []);
  const [visibleCount, setVisibleCount] = useState(0);

  const done = visibleCount >= lines.length;

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq?.matches) {
      setVisibleCount(lines.length);
      return undefined;
    }

    if (done) return;

    const nextLine = lines[visibleCount] ?? "";
    const trimmed = nextLine.trim();

    // Faster for blank lines, slightly slower for longer lines (smooth reading).
    const delayMs = trimmed.length === 0 ? 120 : Math.min(650, 120 + trimmed.length * 10);

    const id = setTimeout(() => {
      setVisibleCount((c) => Math.min(lines.length, c + 1));
    }, delayMs);

    return () => clearTimeout(id);
  }, [done, lines.length, visibleCount]);

  return (
    <main className="letter">
      <section className="letter__paper" aria-label="Love letter">
        <h1 className="letter__title">From Me to You, Forever</h1>

        <div className="letter__body" aria-live="polite">
          {lines.slice(0, visibleCount).map((line, idx) => (
            <p className="letter__line" key={`${idx}-${line}`}>
              {line || "\u00A0"}
            </p>
          ))}

          {!done ? <span className="letter__cursor" aria-hidden="true" /> : null}
        </div>

        {done ? (
          <button
            type="button"
            className="letter__next"
            onClick={() => navigate("/gallery")}
          >
            Next 💕
          </button>
        ) : null}
      </section>
    </main>
  );
}


