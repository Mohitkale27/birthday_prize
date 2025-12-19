import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MemoryCard from "../components/MemoryCard";
import { api } from "../lib/api";

export default function Timeline() {
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchMemories() {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/api/memories");
        if (!isMounted) return;

        const list = Array.isArray(res.data) ? res.data : [];

        // Sort by memory date (oldest first). Fallback to createdAt/updatedAt.
        const sorted = [...list].sort((a, b) => {
          const aCandidate = a?.date || a?.createdAt || a?.updatedAt;
          const bCandidate = b?.date || b?.createdAt || b?.updatedAt;

          const aTime = aCandidate ? new Date(aCandidate).getTime() : 0;
          const bTime = bCandidate ? new Date(bCandidate).getTime() : 0;

          return (Number.isFinite(aTime) ? aTime : 0) - (Number.isFinite(bTime) ? bTime : 0);
        });

        setMemories(sorted);
        setCurrentIndex(0);
      } catch (err) {
        if (!isMounted) return;
        setError("Could not load memories. Please try again.");
        setMemories([]);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    fetchMemories();

    return () => {
      isMounted = false;
    };
  }, []);

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

      {loading ? (
        <section className="state">
          <p className="state__text">Loading memories…</p>
        </section>
      ) : error ? (
        <section className="state state--error" role="alert">
          <p className="state__text">{error}</p>
          <p className="state__hint">
            Backend:{" "}
            <span className="mono">{api?.defaults?.baseURL || "unknown"}</span>.
          </p>
          <p className="state__hint">
            If this still says <span className="mono">http://localhost:5000</span>, restart the
            frontend after setting <span className="mono">VITE_API_BASE_URL</span>.
          </p>
        </section>
      ) : memories.length === 0 ? (
        <section className="state">
          <p className="state__text">No memories yet.</p>
          <p className="state__hint">
            Add one from Postman first, then refresh this page.
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


