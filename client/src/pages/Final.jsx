import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Edit these anytime 💖
const GIRLFRIEND_NAME = "Laddoo";
const FINAL_MESSAGE =
  "You are the best person in the world, Majhi Favourite. Nehmi happy raha, pillu. I’m always with you. Love you, Motu.";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export default function Final() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const particlesRef = useRef([]);

  const [reducedMotion, setReducedMotion] = useState(false);

  const colors = useMemo(
    () => ["#ffb3c9", "#d35b86", "#ffd1dc", "#fff2f6", "#f7c6d0"],
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    setReducedMotion(Boolean(mq.matches));

    const onChange = () => setReducedMotion(Boolean(mq.matches));
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnBurst(count = 140) {
      const w = window.innerWidth;
      const startX = w / 2;
      const startY = -20;

      for (let i = 0; i < count; i += 1) {
        particlesRef.current.push({
          x: startX + rand(-80, 80),
          y: startY + rand(-40, 40),
          vx: rand(-2.4, 2.4),
          vy: rand(1.6, 5.2),
          r: rand(3, 6),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.12, 0.12),
          color: colors[Math.floor(rand(0, colors.length))],
          life: rand(90, 160),
        });
      }
    }

    let running = true;
    resize();
    spawnBurst(170);

    const start = Date.now();

    function tick() {
      if (!running) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const p = particlesRef.current;
      for (let i = p.length - 1; i >= 0; i -= 1) {
        const part = p[i];
        part.x += part.vx;
        part.y += part.vy;
        part.vy += 0.03; // gravity
        part.rot += part.vr;
        part.life -= 1;

        ctx.save();
        ctx.translate(part.x, part.y);
        ctx.rotate(part.rot);
        ctx.fillStyle = part.color;

        // small rounded rectangle confetti
        const wRect = part.r * 2.2;
        const hRect = part.r * 1.1;
        const radius = Math.min(3, part.r);

        ctx.beginPath();
        ctx.moveTo(-wRect / 2 + radius, -hRect / 2);
        ctx.lineTo(wRect / 2 - radius, -hRect / 2);
        ctx.quadraticCurveTo(wRect / 2, -hRect / 2, wRect / 2, -hRect / 2 + radius);
        ctx.lineTo(wRect / 2, hRect / 2 - radius);
        ctx.quadraticCurveTo(wRect / 2, hRect / 2, wRect / 2 - radius, hRect / 2);
        ctx.lineTo(-wRect / 2 + radius, hRect / 2);
        ctx.quadraticCurveTo(-wRect / 2, hRect / 2, -wRect / 2, hRect / 2 - radius);
        ctx.lineTo(-wRect / 2, -hRect / 2 + radius);
        ctx.quadraticCurveTo(-wRect / 2, -hRect / 2, -wRect / 2 + radius, -hRect / 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        if (part.life <= 0 || part.y > h + 40) {
          p.splice(i, 1);
        }
      }

      // stop after a few seconds to keep it lightweight
      if (Date.now() - start < 5500 || particlesRef.current.length > 0) {
        rafRef.current = window.requestAnimationFrame(tick);
      }
    }

    rafRef.current = window.requestAnimationFrame(tick);

    window.addEventListener("resize", resize);
    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
    };
  }, [colors, reducedMotion]);

  return (
    <main className="final">
      {!reducedMotion ? (
        <canvas className="final__confetti" ref={canvasRef} aria-hidden="true" />
      ) : null}

      <section className="final__card" aria-label="Celebration">
        <div className="final__badge" aria-hidden="true">
          🎂
        </div>

        <h1 className="final__heading">Happy Birthday ❤️</h1>
        <p className="final__name">{GIRLFRIEND_NAME}</p>
        <p className="final__message">{FINAL_MESSAGE}</p>

        <div className="final__illustration" aria-hidden="true">
          <div className="final__heart" />
          <div className="final__heart final__heart--small" />
        </div>

        <button
          type="button"
          className="final__replay"
          onClick={() => navigate("/")}
        >
          Replay the Surprise 🔁
        </button>
      </section>
    </main>
  );
}
