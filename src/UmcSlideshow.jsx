import { useEffect, useRef, useState } from "react";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const clips = [
  "images/umc_1.mov",
  "images/umc_2.mov",
];

export default function UmcSlideshow() {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState({});
  const [reducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const videos = useRef([]);

  useEffect(() => {
    let cancelled = false;

    videos.current.forEach((video, index) => {
      if (!video) return;

      if (index !== active || reducedMotion) {
        video.pause();
        return;
      }

      video.currentTime = 0;
      video.play().catch(() => {
        if (!cancelled) {
          // Leave the frame visible if autoplay is unavailable.
          video.pause();
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [active, reducedMotion]);

  return (
    <figure className="umc-slideshow">
      <div className="umc-slideshow__frame">
        {clips.map((src, index) => (
          <video
            key={src}
            ref={(element) => {
              videos.current[index] = element;
            }}
            className={`umc-slideshow__video ${
              active === index && ready[index] ? "is-active" : ""
            }`}
            src={asset(src)}
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            aria-hidden={active !== index}
            onLoadedData={() =>
              setReady((current) => ({
                ...current,
                [index]: true,
              }))
            }
            onEnded={() => {
              if (index === active && !reducedMotion) {
                setActive((current) => (current + 1) % clips.length);
              }
            }}
          />
        ))}
      </div>

      <figcaption>UMC’s Fall into Greenville</figcaption>
    </figure>
  );
}