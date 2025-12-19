import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MemoryCard from "../components/MemoryCard";
import { MEMORIES } from "../data/memories";

export default function Timeline() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const memories = useMemo(() => {
    // Sort by memory date (oldest first).
    return [...MEMORIES].sort((a, b) => {
      const aTime = a?.date ? new Date(a.date).getTime() : 0;
      const bTime = b?.date ? new Date(b.date).getTime() : 0;
      return (Number.isFinite(aTime) ? aTime : 0) - (Number.isFinite(bTime) ? bTime : 0);
    });
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [memories.length]);

  const currentMemory = memories[currentIndex];
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= memories.length - 1;

  return (
    <main className="page">
      <header className="page__header">
        <p className="page__eyebrow">For you, with love</p>
        <h1 className="page__title">Our Memories</h1>
        <p className="page__subtitle">
          A little timeline of moments I never want to forget.
        </p>
      </header>

      {memories.length === 0 ? (
        <section className="state">
          <p className="state__text">No memories yet.</p>
          <p className="state__hint">
            Add memories in <span className="mono">client/src/data/memories.js</span>.
          </p>
        </section>
      ) : (
        <>
          <section className="timeline" aria-label="Memories timeline">
            <div className="timeline__item" key={currentMemory?._id || currentIndex}>
              <div className="timeline__dot" aria-hidden="true" />
              <MemoryCard memory={currentMemory} />
            </div>
          </section>

          <section className="timeline-nav" aria-label="Timeline navigation">
            <button
              type="button"
              className="timeline-nav__button"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={isFirst}
            >
              ← Previous
            </button>

            <p className="timeline-nav__meta" aria-live="polite">
              {currentIndex + 1} / {memories.length}
            </p>

            <button
              type="button"
              className="timeline-nav__button"
              onClick={() => setCurrentIndex((i) => Math.min(memories.length - 1, i + 1))}
              disabled={isLast}
            >
              Next →
            </button>
          </section>

          <section className="timeline-cta" aria-label="Continue">
            <button
              type="button"
              className="timeline-cta__button"
              onClick={() => navigate("/letter")}
            >
              Continue 💌
            </button>
          </section>
        </>
      )}
    </main>
  );
}


