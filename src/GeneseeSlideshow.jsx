import { useEffect, useRef, useState } from "react";
import VideoLoadingFrame from "./VideoLoadingFrame";

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
  const [reducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const videoRefs = useRef([]);

  useEffect(() => {
    if (!isVideo) return;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index !== active || reducedMotion) {
        // Keep the outgoing clip’s last frame visible during the fade.
        video.pause();
        return;
      }

      video.currentTime = 0;
      // VideoLoadingFrame handles the loading message and retry.
      video.play().catch(() => {});
    });
  }, [active, isVideo, reducedMotion]);

  useEffect(() => {
    if (isVideo || reducedMotion) return;

    const delay = failed[active] ? 2500 : ready[active] ? 6000 : 30000;

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % slides.length);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [active, ready, failed, isVideo, reducedMotion, slides.length]);

  function markReady(index) {
    setReady((current) => ({ ...current, [index]: true }));
    setFailed((current) =>
      current[index] ? { ...current, [index]: false } : current
    );
  }

  function markFailed(index) {
    setFailed((current) => ({ ...current, [index]: true }));
  }

  const slideElements = slides.map((src, index) => (
    <div
      key={src}
      className={`genesee-reel__slide ${
        active === index && ready[index] && !failed[index] ? "is-active" : ""
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
          onLoadedData={() => markReady(index)}
          onPlaying={() => markReady(index)}
          onEnded={() => {
            if (index === active && !reducedMotion) {
              setActive((current) => (current + 1) % slides.length);
            }
          }}
          onError={() => markFailed(index)}
        />
      ) : (
        <img
          src={asset(src)}
          alt="An October visit to Genesee Farms"
          onLoad={() => markReady(index)}
          onError={() => markFailed(index)}
        />
      )}
    </div>
  ));

  return (
    <figure
      className={`genesee-reel genesee-reel--${kind}`}
      aria-label={
        isVideo ? "Videos from Genesee Farms" : "Photos from Genesee Farms"
      }
    >
      {isVideo ? (
        <VideoLoadingFrame
          className="genesee-reel__frame"
          activeIndex={active}
        >
          {slideElements}
        </VideoLoadingFrame>
      ) : (
        <div className="genesee-reel__frame">{slideElements}</div>
      )}

      {isVideo && <figcaption>Genesee Farms</figcaption>}
    </figure>
  );
}