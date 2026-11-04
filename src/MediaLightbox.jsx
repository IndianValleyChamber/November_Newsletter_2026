import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function MediaLightbox() {
  const [media, setMedia] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    function openMedia(event) {
      if (!(event.target instanceof Element)) return;

      const element = event.target.closest("img, video");

      // Keep navigation, footer logos, and linked images working normally.
      if (
        !element ||
        element.closest("a, button, nav, header, footer, dialog")
      ) {
        return;
      }

      const src = element.currentSrc || element.src;
      if (!src) return;

      setMedia({
        src,
        type: element.tagName === "VIDEO" ? "video" : "image",
        alt: element.alt || "",
      });
    }

    document.addEventListener("click", openMedia);
    return () => document.removeEventListener("click", openMedia);
  }, []);

  useEffect(() => {
    if (!media) return;

    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [media]);

  if (!media) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="media-lightbox"
      aria-label="Expanded media"
      onCancel={(event) => {
        event.preventDefault();
        setMedia(null);
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) setMedia(null);
      }}
    >
      <button
        className="media-lightbox__close"
        type="button"
        aria-label="Close expanded media"
        onClick={() => setMedia(null)}
        autoFocus
      >
        ×
      </button>

      {media.type === "video" ? (
      <video
  key={media.src}
  src={media.src}
  className="media-lightbox__media"
  autoPlay
  muted
  loop
  playsInline
/>
      ) : (
        <img
          src={media.src}
          alt={media.alt}
          className="media-lightbox__media"
        />
      )}
    </dialog>,
    document.body
  );
}