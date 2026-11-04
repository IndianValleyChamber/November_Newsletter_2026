import { useEffect, useRef, useState } from "react";
import VideoLoadingFrame from "./VideoLoadingFrame";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const clips = [
  "images/taylorsville_parade_1.mov",
  "images/taylorsville_parade_2.mov",
];

export default function LightParadeSlideshow() {
  const [active, setActive] = useState(0);
  const [reducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const videoRefs = useRef([]);

  useEffect(() => {
    let cancelled = false;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      video.muted = true;

      if (index !== active || reducedMotion) {
        video.pause();
        return;
      }

      video.currentTime = 0;

      video.play().catch(() => {
        if (!cancelled) video.pause();
      });
    });

    return () => {
      cancelled = true;
    };
  }, [active, reducedMotion]);

  return (
    <figure className="light-parade-film">
      <VideoLoadingFrame
        className="light-parade-film__frame"
        activeIndex={active}
      >
        {clips.map((src, index) => (
          <video
            key={src}
            ref={(element) => {
              videoRefs.current[index] = element;
            }}
            className={`light-parade-film__video ${
              index === active ? "is-active" : ""
            }`}
            src={asset(src)}
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            aria-label={`Taylorsville Light Parade 2025, clip ${index + 1}`}
            aria-hidden={index !== active}
            onEnded={() => {
              if (index === active && !reducedMotion) {
                setActive((current) => (current + 1) % clips.length);
              }
            }}
          />
        ))}
      </VideoLoadingFrame>

      <figcaption>Taylorsville Light Parade 2025</figcaption>
    </figure>
  );
}