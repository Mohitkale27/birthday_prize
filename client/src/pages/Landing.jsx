import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Change these two constants for your surprise 💖
const GIRLFRIEND_NAME = "Laddoo";
// Birthday: 20/12 (dd/mm)
const BIRTHDAY_MONTH_INDEX = 11; // 0=Jan ... 11=Dec
const BIRTHDAY_DAY = 20;
const BIRTHDAY_TIME_HOURS = 0;
const BIRTHDAY_TIME_MINUTES = 0;

function getNextBirthdayDate() {
  const now = new Date();
  const year = now.getFullYear();

  const candidateThisYear = new Date(
    year,
    BIRTHDAY_MONTH_INDEX,
    BIRTHDAY_DAY,
    BIRTHDAY_TIME_HOURS,
    BIRTHDAY_TIME_MINUTES,
    0,
    0,
  );

  if (candidateThisYear.getTime() >= now.getTime()) return candidateThisYear;

  return new Date(
    year + 1,
    BIRTHDAY_MONTH_INDEX,
    BIRTHDAY_DAY,
    BIRTHDAY_TIME_HOURS,
    BIRTHDAY_TIME_MINUTES,
    0,
    0,
  );
}

function getTimeLeftMs(targetDate) {
  return Math.max(0, targetDate.getTime() - Date.now());
}

function formatCountdown(msLeft) {
  const totalSeconds = Math.floor(msLeft / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

export default function Landing() {
  const navigate = useNavigate();
  const targetDate = useMemo(() => getNextBirthdayDate(), []);
  const [msLeft, setMsLeft] = useState(() => getTimeLeftMs(targetDate));

  useEffect(() => {
    const id = setInterval(() => {
      setMsLeft(getTimeLeftMs(targetDate));
    }, 1000);

    return () => clearInterval(id);
  }, [targetDate]);

  const isReady = msLeft === 0;
  const { days, hours, minutes, seconds } = formatCountdown(msLeft);

  return (
    <main className="landing">
      <section className="landing__card" aria-label="Birthday landing">
        <p className="landing__eyebrow">A tiny surprise for</p>
        <h1 className="landing__title">Happy Birthday ❤️</h1>
        <p className="landing__name">{GIRLFRIEND_NAME}</p>

        <div className="landing__countdown" aria-live="polite">
          {isReady ? (
            <p className="landing__itsYourDay">It’s your day 🎉</p>
          ) : (
            <>
              <p className="landing__countdownLabel">Countdown</p>
              <div className="countdown">
                <div className="countdown__cell">
                  <div className="countdown__value">{days}</div>
                  <div className="countdown__unit">days</div>
                </div>
                <div className="countdown__cell">
                  <div className="countdown__value">{pad2(hours)}</div>
                  <div className="countdown__unit">hours</div>
                </div>
                <div className="countdown__cell">
                  <div className="countdown__value">{pad2(minutes)}</div>
                  <div className="countdown__unit">min</div>
                </div>
                <div className="countdown__cell">
                  <div className="countdown__value">{pad2(seconds)}</div>
                  <div className="countdown__unit">sec</div>
                </div>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          className="landing__button"
          onClick={() => navigate("/surprise")}
        >
          Start the Surprise 🎁
        </button>
      </section>
    </main>
  );
}


