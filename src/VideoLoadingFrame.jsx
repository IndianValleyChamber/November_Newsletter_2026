import { useEffect, useRef, useState } from "react";

const heron = `${import.meta.env.BASE_URL}images/Charcoal Heron Engraving in Flight.png`;

export default function VideoLoadingFrame({
  children,
  className = "",
  activeIndex = 0,
}) {
  const frameRef = useRef(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const video = frameRef.current?.querySelectorAll("video")[activeIndex];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;

    if (!video) return;

    function clear() {
      window.clearTimeout(timer);
      setStatus("");
    }

    function fail() {
      window.clearTimeout(timer);
      setStatus("retry");
    }

    function loading() {
      clear();
      if (motion.matches) return;

      setStatus("loading");
      timer = window.setTimeout(fail, 8000);
    }

    function sync() {
      if (motion.matches || video.ended) clear();
      else if (video.error) fail();
      else if (video.paused || video.readyState < 3) loading();
      else clear();
    }

    const listeners = {
      loadstart: loading,
      waiting: loading,
      playing: clear,
      ended: clear,
      error: fail,
    };

    for (const [event, handler] of Object.entries(listeners)) {
      video.addEventListener(event, handler);
    }

    motion.addEventListener("change", sync);
    sync();

    return () => {
      window.clearTimeout(timer);
      motion.removeEventListener("change", sync);
      for (const [event, handler] of Object.entries(listeners)) {
        video.removeEventListener(event, handler);
      }
    };
  }, [activeIndex]);

  async function retry() {
    const video = frameRef.current?.querySelectorAll("video")[activeIndex];
    if (!video) return;

    if (video.error) video.load();

    try {
      await video.play();
    } catch {
      setStatus("retry");
    }
  }

  return (
    <div ref={frameRef} className={`video-loading-frame ${className}`}>
      {children}

      {status && (
        <div className="video-loading-frame__veil">
          <img src={heron} alt="" aria-hidden="true" />
          <span role="status">
            {status === "loading" ? "Loading video…" : "Video couldn’t start."}
          </span>
          {status === "retry" && (
            <button type="button" onClick={retry}>
              Retry video
            </button>
          )}
        </div>
      )}
    </div>
  );
}