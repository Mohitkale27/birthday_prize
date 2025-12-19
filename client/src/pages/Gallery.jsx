import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Edit these anytime 💖
// Tip: you can use local images too (put files in `client/public/` and use src like "/photos/1.jpg")
const PHOTOS = [
  { src: "/photos/1.jpg", caption: "" },
  { src: "/photos/2.jpg", caption: "" },
  { src: "/photos/3.jpg", caption: "" },
  { src: "/photos/4.jpg", caption: "", isWide: true },
  { src: "/photos/5.jpg", caption: "" },
  { src: "/photos/6.jpg", caption: "" },
  { src: "/photos/7.jpg", caption: "" },
  { src: "/photos/8.jpg", caption: "", isWide: true },
  { src: "/photos/9.jpg", caption: "", isWide: true },
];

export default function Gallery() {
  const navigate = useNavigate();
  const photos = useMemo(() => PHOTOS, []);
  const [activeIndex, setActiveIndex] = useState(null);

  const activePhoto = activeIndex == null ? null : photos[activeIndex];
  const total = photos.length;

  function openAt(index) {
    setActiveIndex(index);
  }

  function close() {
    setActiveIndex(null);
  }

  function prev() {
    setActiveIndex((i) => {
      if (i == null) return 0;
      return (i - 1 + total) % total;
    });
  }

  function next() {
    setActiveIndex((i) => {
      if (i == null) return 0;
      return (i + 1) % total;
    });
  }

  useEffect(() => {
    if (!activePhoto) return;

    function onKeyDown(e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePhoto, total]);

  return (
    <main className="page">
      <header className="page__header">
        <p className="page__eyebrow">A few chapters of us</p>
        <h1 className="page__title">Our Little Gallery</h1>
        <p className="page__subtitle">
          Tap a photo — each one is a memory I keep close.
        </p>
      </header>

      <section className="gallery" aria-label="Photo gallery">
        {photos.map((p, idx) => (
          <button
            key={`${p.src}-${idx}`}
            type="button"
            className={`gallery__tile ${p.isWide ? "gallery__tile--wide" : ""}`}
            onClick={() => openAt(idx)}
            aria-label={`Open photo ${idx + 1}`}
          >
            <div className="gallery__frame">
              <img className="gallery__img" src={p.src} alt={p.caption || "Photo"} loading="lazy" />
              {p.caption ? <p className="gallery__caption">{p.caption}</p> : null}
            </div>
          </button>
        ))}
      </section>

      <div className="gallery__footer">
        <button
          type="button"
          className="gallery__next"
          onClick={() => navigate("/final")}
        >
          One last thing 💝
        </button>
      </div>

      {activePhoto ? (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="modal__card">
            <div className="modal__top">
              <button type="button" className="modal__close" onClick={close} aria-label="Close">
                ×
              </button>
            </div>

            <button type="button" className="modal__nav modal__nav--prev" onClick={prev} aria-label="Previous photo">
              ‹
            </button>
            <button type="button" className="modal__nav modal__nav--next" onClick={next} aria-label="Next photo">
              ›
            </button>

            <img className="modal__img" src={activePhoto.src} alt={activePhoto.caption || "Photo"} />

            {activePhoto.caption ? (
              <p className="modal__caption">{activePhoto.caption}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
