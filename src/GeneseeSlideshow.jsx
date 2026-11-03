import { useEffect, useRef, useState } from "react";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const collections = {
  videos: [
    "images/genesee_video1.mov",
    "images/genesee_video2.mov",
  ],
  photos: [
    "images/genesee_farms1.jpeg",
    "images/genesee_farms2.jpeg",
    "images/genessee_farms4.jpeg",
    "images/genesee_farms5.jpeg",
    "images/genesee_farms6.jpeg",
  ],
};

export default function GeneseeSlideshow({ kind = "videos" }) {
  const slides = collections[kind];
  const isVideo = kind === "videos";

  const [active, setActive] = useState(0);
  const [ready, setReady] = useState({});
  const [failed, setFailed] = useState({});
  const [blocked, setBlocked] = useState(false);
  const [reducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const videoRefs = useRef([]);

  function next() {
    setBlocked(false);
    setActive((current) => (current + 1) % slides.length);
  }

  useEffect(() => {
    if (!isVideo) return;

    let cancelled = false;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index !== active) {
        // Retain the last frame while the outgoing video fades.
        video.pause();
      } else if (reducedMotion) {
        video.pause();
      } else {
        video.currentTime = 0;
        video.play().catch(() => {
          if (!cancelled) setBlocked(true);
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [active, isVideo, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    let delay;

    if (failed[active] || blocked) {
      delay = 2500;
    } else if (!ready[active]) {
      delay = 30000;
    } else if (!isVideo) {
      delay = 6000;
    } else {
      // Loaded videos advance through onEnded.
      return;
    }

    const timer = window.setTimeout(() => {
      setBlocked(false);
      setActive((current) => (current + 1) % slides.length);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [active, ready, failed, blocked, isVideo, reducedMotion, slides.length]);

  return (
    <figure
      className={`genesee-reel genesee-reel--${kind}`}
      aria-label={
        isVideo ? "Videos from Genesee Farms" : "Photos from Genesee Farms"
      }
    >
      <div className="genesee-reel__frame">
        {slides.map((src, index) => (
          <div
            key={src}
            className={`genesee-reel__slide ${
              active === index && ready[index] && !failed[index]
                ? "is-active"
                : ""
            }`}
            aria-hidden={active !== index}
          >
            {isVideo ? (
              <video
                ref={(element) => {
                  videoRefs.current[index] = element;
                }}
                src={asset(src)}
                muted
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                onLoadedData={() =>
                  setReady((current) => ({ ...current, [index]: true }))
                }
                onEnded={() => {
                  if (index === active) next();
                }}
                onError={() =>
                  setFailed((current) => ({ ...current, [index]: true }))
                }
              />
            ) : (
              <img
                src={asset(src)}
                alt="An October visit to Genesee Farms"
                onLoad={() =>
                  setReady((current) => ({ ...current, [index]: true }))
                }
                onError={() =>
                  setFailed((current) => ({ ...current, [index]: true }))
                }
              />
            )}
          </div>
        ))}
      </div>

      {isVideo && <figcaption>Genesee Farms</figcaption>}
    </figure>
  );
}