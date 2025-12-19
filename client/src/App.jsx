import "./App.css";
import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import BackgroundMusic from "./components/BackgroundMusic";
import Landing from "./pages/Landing";
import Letter from "./pages/Letter";
import Gallery from "./pages/Gallery";
import Surprise from "./pages/Surprise";
import Final from "./pages/Final";
import Timeline from "./pages/Timeline";

function isUnlocked() {
  try {
    return window.localStorage.getItem("birthday_unlocked") === "1";
  } catch {
    return false;
  }
}

function RequireUnlock({ children }) {
  return isUnlocked() ? children : <Navigate to="/surprise" replace />;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Force the app to always start at the first page on refresh/load.
  useEffect(() => {
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
    }
    // Intentionally run only once on initial mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BackgroundMusic />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/timeline" element={<RequireUnlock><Timeline /></RequireUnlock>} />
        <Route path="/letter" element={<RequireUnlock><Letter /></RequireUnlock>} />
        <Route path="/gallery" element={<RequireUnlock><Gallery /></RequireUnlock>} />
        <Route path="/surprise" element={<Surprise />} />
        <Route path="/final" element={<RequireUnlock><Final /></RequireUnlock>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
