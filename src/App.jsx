import { useEffect, useState } from "react";
import "./App.css";
import GeneseeSlideshow from "./GeneseeSlideshow";
import UmcSlideshow from "./UmcSlideshow";
import MediaLightbox from "./MediaLightbox";
import EventsCalendar from "./EventsCalendar";
import LightParadeSlideshow from "./LightParadeSlideshow";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

// Add missing filenames and links here when ready.
const media = {
  genesee: "videos/genesee_farms.mp4",
  umc: "videos/fall_into_greenville.mp4",
  waystation: "",
  hotel: "",
  trunkOrTreat: "",
  allTheRage: "images/jamie_rainbow.png",
  gemstoneGenie: "images/gemstone_geenie.jpg",
  chamberLogo: "images/chamber_round_logo.png",  
  hotelOutside: "images/crescent_hotel_outside.jpeg",
hotelRoom: "images/room_at_crescent_hotel.jpeg",
};

const links = {
  facebook: "https://www.facebook.com/IVCoC/",
  instagram: "https://www.instagram.com/indianvalley_chamber/",
  hotel:
  "https://app.mews.com/distributor/4b6eaa0c-7e6c-48c5-a8c3-b42d009d25a8",
  alyssaEmail: "",
  thanksgiving: "",
  paradeForm: "",
  overflow: "https://www.zeffy.com/en-US/ticketing/artisan-market-2",
  membership:
    "https://www.zeffy.com/en-US/ticketing/indian-valley-chamber-of-commerces-memberships",
};

function Media({
  src,
  alt,
  video = false,
  portrait = false,
}) {
  const [failed, setFailed] = useState(false);
  const className = `journal-media${portrait ? " journal-media--portrait" : ""}`;

  if (!src || failed) {
    return (
      <div
        className={`${className} journal-media--placeholder`}
        role="img"
        aria-label={`${alt}. Media coming soon.`}
      >
        <span>{alt} · {video ? "video" : "image"} to come</span>
      </div>
    );
  }

  if (video) {
    return (
      <video
        className={className}
        src={asset(src)}
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="metadata"
        aria-label={alt}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <img
      className={className}
      src={asset(src)}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function Sidebar({ title, children }) {
  return (
    <aside className="journal-sidebar">
      <h3>{title}</h3>
      {children}
    </aside>
  );
}

function OptionalLink({ href, children }) {
  if (!href) return null;

  return (
    <a
      className="journal-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
function SocialLinks() {
  return (
    <div className="journal-socials">
      {links.facebook && (
        <SocialIcon
          platform="facebook"
          href={links.facebook}
          label="Visit Indian Valley Chamber of Commerce on Facebook"
        />
      )}

      {links.instagram && (
        <SocialIcon
          platform="instagram"
          href={links.instagram}
          label="Visit Indian Valley Chamber of Commerce on Instagram"
        />
      )}
    </div>
  );
}
function SocialIcon({ platform, href, label }) {
  return (
    <a
      className="social-icon"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {platform === "instagram" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle
            cx="17.5"
            cy="6.5"
            r="1"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M14 22v-9h3l.5-4H14V6.5c0-1.2.4-2 2-2h1.7V1.1A23 23 0 0 0 15.2 1C12.6 1 11 2.6 11 5.5V9H8v4h3v9h3Z" />
        </svg>
      )}
    </a>
  );
}
export default function App() {
  const [shareMessage, setShareMessage] = useState("");
  const [showCalendar, setShowCalendar] = useState(
  () => window.location.hash === "#calendar"
);

useEffect(() => {
  function updatePage() {
    setShowCalendar(window.location.hash === "#calendar");
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", updatePage);
  return () => window.removeEventListener("hashchange", updatePage);
}, []);

  async function shareArticle() {
    const shareData = {
      title: "November 2026 | Indian Valley Chamber of Commerce",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        setShareMessage("Link copied");
      } else {
        setShareMessage("Copy this page’s address to share.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setShareMessage("Copy this page’s address to share.");
      }
    }
  }



const [showScrollHint, setShowScrollHint] = useState(false);

useEffect(() => {
  let timer;

  function updateScrollHint() {
    window.clearTimeout(timer);
    setShowScrollHint(false);

    if (window.scrollY < 40) {
      timer = window.setTimeout(() => {
        setShowScrollHint(true);
      }, 5000);
    }
  }

  updateScrollHint();
  window.addEventListener("scroll", updateScrollHint, { passive: true });

  return () => {
    window.clearTimeout(timer);
    window.removeEventListener("scroll", updateScrollHint);
  };
}, [showCalendar]);

  if (showCalendar) {
    return <EventsCalendar />;
  }

  return (
    <>
      <a className="skip-link" href="#journal">
        Skip to article
      </a>

      <header className="navbar">
        <a
          className="navbar__brand"
          href="https://indianvalleychamber.org/"
          target="_top"
          aria-label="Indian Valley Chamber of Commerce home"
        >
          <img
            src={asset("images/Charcoal Heron Engraving in Flight.png")}
            alt=""
            className="navbar__heron"
          />
          <span>
            Indian Valley
            <small>Chamber of Commerce</small>
          </span>
        </a>

<a className="navbar__issue" href="#newsletter">
  November 2026 Newsletter
</a>

<div className="navbar__actions">
  <a className="navbar__calendar" href="#calendar">
    Calendar of Events 
  </a>

  <a
    className="navbar__membership"
    href="https://www.zeffy.com/en-US/ticketing/indian-valley-chamber-of-commerces-memberships"
    target="_blank"
    rel="noopener noreferrer"
  >
    Become a Member 
  </a>
</div>
      </header>

      <main id="journal">
        <article>
          <header className="journal-hero">
            <figure className="journal-hero__figure">
  <img
    className="journal-hero__image"
    src={asset("images/fall_colors.jpeg")}
    alt="Autumn colors at Indian Falls, Plumas County, California"
    fetchPriority="high"
  />
  <figcaption className="journal-hero__caption">
    <abbr title={'Maidu for "Valley End Falls"'} tabIndex={0}>
      <i>Koyom Bukum Sewino</i>
    </abbr>
    {", Indian Falls"}
  </figcaption>
</figure>
            <div className="journal-hero__content">
              <time className="journal-hero__date" dateTime="2026-11-04">
                November 5, 2026
              </time>

              <h1>The familiar, taking new form.</h1>

              <div className="journal-hero__share">
                <button type="button" onClick={shareArticle}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    aria-hidden="true"
                  >
                    <path d="M12 16V3m0 0L7 8m5-5 5 5" />
                    <path d="M5 13v7h14v-7" />
                  </svg>
                  Share
                </button>
                <span role="status">{shareMessage}</span>
              </div>
            </div>
            <button
  type="button"
  className={`hero-scroll-hint ${showScrollHint ? "is-visible" : ""}`}
  tabIndex={showScrollHint ? 0 : -1}
  aria-hidden={!showScrollHint}
  onClick={() => {
    const opening = document.querySelector(".opening");

    if (opening) {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      opening.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }

    setShowScrollHint(false);
  }}
>
  <span>Scroll</span>

  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    aria-hidden="true"
  >
    <path d="M12 4v15M6 13l6 6 6-6" />
  </svg>
</button>
          </header>

          <div className="article-copy opening">
            <p>
As autumn brings fresh color to Indian Valley, our community calendar reflects changes of its own: favorite events return, newer traditions take root, and new gatherings begin.
            </p>
          </div>

<section className="genesee-section journal-width">
  <div className="genesee-section__video">
    <GeneseeSlideshow kind="videos" />
  </div>

  <div className="genesee-section__copy">
    <p className="eyebrow">An October in the valley</p>

    <p>
   Genesee Farm welcomed visitors to its October 3 open house for a tour and demonstrations of growing through the colder months. The farm grows organic produce in Genesee Valley, with young fruit trees planted for future harvests.
    </p>
  </div>

  <figure className="genesee-section__gallery">
    <div className="genesee-photo-row">
      {[
        "genesee_farms1.jpeg",
        "genesee_farms2.jpeg",
        "genessee_farms4.jpeg",
        "genesee_farms5.jpeg",
        "genesee_farms6.jpeg",
      ].map((filename, index) => (
        <img
          key={filename}
          src={asset(`images/${filename}`)}
          alt={`Scenes from Genesee Farms, photograph ${index + 1}`}
          loading="lazy"
        />
      ))}
    </div>

    <figcaption>
      While the farm is winterizing, mixed green lettuces
      can still be put together for you by arrangement with
      LJL. Message the farm on Facebook or arrange through
      the contact page on{" "}
      <a
        href="https://geneseefarm.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        its website ↗
      </a>
      .
    </figcaption>
  </figure>
</section>

         <section className="portrait-story portrait-story--reverse journal-width umc-story">
        <UmcSlideshow />
            <div className="portrait-story__copy">
              <p>
                October also brought new ways to celebrate together.
                UMC’s Fall into Greenville made its debut with a focus
                on fun for the community, while Taylorsville welcomed
                the return of its fall festival. One gathering beginning,
                another returning—both making room for familiar faces
                and new ones.
              </p>
            </div>
          </section>

       

        <section className="cy-hall-feature journal-width">
  <div className="cy-hall-feature__top">
    <figure className="cy-hall-feature__first">
      <img
        src={asset("images/cyHall1.jpeg")}
        alt="Greenville Cy Hall Memorial Museum"
        loading="lazy"
        decoding="async"
      />
    </figure>

    <div className="cy-hall-feature__copy">
      <p>
        In Greenville, preserving the past is itself a new beginning.
        The Greenville Cy Hall Memorial Museum welcomed visitors to tour
        its rebuilt building during an October 25 open house. After the
        Dixie Fire destroyed its historic building and much of its
        collection, this gathering marked a meaningful step toward the
        museum’s return.
      </p>
    </div>
  </div>

  <figure className="cy-hall-feature__second">
    <img
      src={asset("images/cyMuseumGreenville.jpeg")}
      alt="A view of the Greenville Cy Hall Memorial Museum"
      loading="lazy"
      decoding="async"
    />
    <figcaption>The rebuilt Greenville Cy Hall Memorial Museum</figcaption>
  </figure>
</section>

<section className="waystation-feature">
  <div className="waystation-feature__copy">
    <p>
      That same sense of renewal is taking shape elsewhere in town.
      At The Waystation, finishing touches on the exterior are bringing
      its changing appearance into focus, another visible step in
      Greenville’s ongoing rebuilding.
    </p>
  </div>

  <figure className="waystation-feature__image">
    <img
      src={asset("images/waystation.jpeg")}
      alt="The Waystation exterior in Greenville"
      loading="lazy"
      decoding="async"
    /><figcaption>The Waystation</figcaption>
  </figure>
</section>

<section className="hotel-feature journal-width">
  <div className="hotel-feature__left">
    <Media
      src={media.hotelOutside}
      alt="The exterior of The Crescent Hotel in Crescent Mills"
    />
    <figcaption>Moon Deck at Night</figcaption>

    <div className="hotel-feature__copy">
      <p>
        In Crescent Mills, The Crescent Hotel is welcoming
        guests into its newly remodeled upstairs rooms.
        A familiar landmark with a fresh look, its
        transformation is another reminder that change
        can bring new life to places we have long known.
      </p>
    </div>

    <Sidebar title="Stay in Crescent Mills">
      <OptionalLink href={links.hotel}>
        Book a Room at The Crescent Hotel ↗
      </OptionalLink>
    </Sidebar>
  </div>

  <figure className="hotel-feature__photo">
    <Media
      src={media.hotelRoom}
      alt="A newly remodeled guest room at The Crescent Hotel"
    />
    <figcaption>Room in the newly remodeled Crescent Hotel</figcaption>
  </figure>


</section>

    <section className="christmas-feature journal-width">
  <div className="editorial-row">
    <div className="editorial-row__copy">
      <p>
        Soon, there will be another reason to stay. Christmas in
        Crescent, a newer tradition finding its place among our
        familiar celebrations, is returning for another season.
        Planning is underway for this year’s gathering.
      </p>
      <p className="crescent-save-the-date">
  <span>Looking ahead</span>
  <time dateTime="2026-12-13">Sunday, December 13, 2026</time>
  {" · 2–8 PM · Crescent Mills"}
</p>
    </div>

    <Sidebar title="Christmas in Crescent Vendors">
      <p>
        Chamber members interested in a vendor space are
        invited to text Alyssa Dobbins.
      </p>

      <div className="parade-contact">
        <div className="parade-contact__options">
<div className="alyssa-contact">
  <span>Text Alyssa</span>

  <details>
    <summary aria-label="Show Alyssa’s phone number">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m7 3 3 5-2 2a15 15 0 0 0 6 6l2-2 5 3-1 4C10 22 2 14 3 4Z" />
      </svg>
    </summary>

    <a href="sms:+15302498941">
      (530) 249-8941
    </a>
  </details>
</div>
        </div>
      </div>
    </Sidebar>
  </div>

  <figure className="christmas-feature__gallery">
    <div className="christmas-feature__images">
      <img
        src={asset("images/christmas_in_crescent1.jpg")}
        alt="Christmas in Crescent festivities in 2025"
        loading="lazy"
        decoding="async"
      />

      <img
        src={asset("images/christmasInCrescent2.jpg")}
        alt="Another scene from Christmas in Crescent 2025"
        loading="lazy"
        decoding="async"
      />

      <img
        src={asset("images/christmasInCrescent3.jpg")}
        alt="Christmas in Crescent celebration in 2025"
        loading="lazy"
        decoding="async"
      />
    </div>

    <figcaption>Christmas in Crescent 2025</figcaption>
  </figure>
</section>
<section className="veterans-feature journal-width">
  <div className="veterans-feature__copy">
    <p>
      Other traditions need little introduction. For many in
      Indian Valley, November 11 means heading to downtown
      Greenville, greeting familiar faces, and gathering to
      honor those who have served. This year’s Veterans Day
      Parade begins at 11 AM on Wednesday, November 11, 2026.
    </p>
  </div>

  <figure className="veterans-feature__image">
    <img
      src={asset("images/veterans.png")}
      alt="Veterans carrying flags at a local parade"
      loading="lazy"
      decoding="async"
    />

    <figcaption>
      Veterans carrying the colors at a local parade.
    </figcaption>
  </figure>
</section>

          <section className="editorial-row journal-width">
<div className="editorial-row__copy">
  <h2 className="journal-section-title">
    Holiday Dinner at the Indian Valley Museum
  </h2>
  <p>
    The Indian Valley Museum hosts its Holiday Dinner on Monday,
    November 9, from 5:30 to 8:30 PM. The evening includes a turkey
    dinner and time to visit in the museum’s Community Room in
    Taylorsville.
  </p>

  <h2 className="journal-section-title">Community Suppers</h2>
  <p>
    Our community suppers have been a bright spot in the
    changing landscape of life since the Dixie Fire.
  </p>
  <p>
    On Monday, November 16, the Indian Valley Riding and Roping
    Club will serve Thanksgiving dinner at Historic Taylorsville
    Hall for the November Community Supper. Everyone is welcome
    from 5 to 6:30 PM.
  </p>
  <p>
    In Greenville, the Community Thanksgiving Dinner will take
    place on Thursday, November 26, from 11 AM to 3 PM at The
    Legion. The meal is free and open to everyone, with delivery
    available for those physically unable to attend.
  </p>
</div>

  <div className="sidebar-stack">
<Sidebar title="Greenville Dinner: Delivery & Donations">
  <p>
    Meal delivery is available for people physically unable
    to attend the Greenville Community Thanksgiving Dinner.
    Sign yourself or someone you know up by November 15.
  </p>

  <p>
    Volunteers and donations of baked goods are welcome.
    To help support the meal, look for the donation box
    at The Crescent Store.
  </p>

  <p>
    For more information about meal delivery, volunteering,
    or donating, contact{" "}
    <a
      href="https://www.facebook.com/karen.morcomb"
      target="_blank"
      rel="noopener noreferrer"
    >
      Karen Morcomb on Facebook ↗
    </a>.
  </p>
</Sidebar>
  </div>
</section>
<section className="light-parade-feature journal-width">
  <LightParadeSlideshow />

  <div className="light-parade-feature__copy">
    <p>
      As November draws to a close, another familiar celebration
      will light up Taylorsville. The annual Taylorsville Light
      Parade returns on Saturday, November 28, at 6 PM,
      welcoming everyone to ring in the Christmas season.
    </p>

    <Sidebar title="Join the Light Parade">
      <p>
        Bring your completed entry form and line up by 5:30 PM on
        Cemetery Road, single file on the museum side. Forms will
        be collected during lineup.
      </p>

  <div className="parade-contact">
  <span className="parade-contact__label">
    Contact Laura Kearns
  </span>

  <div className="parade-contact__options">
    <details>
      <summary aria-label="Show Laura’s email">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <path d="m3 6 9 7 9-7" />
        </svg>
      </summary>

      <a href="mailto:histayhall@gmail.com">
        histayhall@gmail.com
      </a>
    </details>

    <details>
      <summary aria-label="Show Laura’s phone number">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m7 3 3 5-2 2a15 15 0 0 0 6 6l2-2 5 3-1 4C10 22 2 14 3 4Z" />
        </svg>
      </summary>

      <a href="tel:+16198382420">
        (619) 838-2420
      </a>
    </details>
  </div>
</div>

      <OptionalLink href={links.paradeForm}>
        Print Entry Form ↗
      </OptionalLink>
    </Sidebar>
  </div>
</section>
<section className="shoppe-feature journal-width">
  <div className="shoppe-feature__lead">
    <div className="editorial-row__copy">
      <p>
        Still a young tradition itself, the Artisan Shoppe returns for
        its second year—this time at Indian Valley Mercantile in
        Greenville. A new setting, returning participants, and new
        makers joining in: another example of the familiar growing
        into something new.
      </p>

      <p className="shoppe-details">
        November 26–December 20, 2026
        <br />
        147 Crescent Street, Greenville
      </p>
    </div>

    <figure className="shoppe-reel">
      <iframe
        className="shoppe-reel__video"
        title="A look at the Artisan Shoppe"
        src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1561939162401767%2F&show_text=false&width=267&t=0"
        width={267}
        height={476}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
      />
      <figcaption>
        <a
          href="https://www.facebook.com/reel/1561939162401767/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch on Facebook ↗
        </a>
      </figcaption>
    </figure>
  </div>

<div className="shoppe-feature__notes">
  <figure className="shoppe-feature__photo">
    <img
      src={asset("images/shelby.png")}
      alt="Shelby Janea and Katie smiling together"
      loading="lazy"
      decoding="async"
    />
    <figcaption>
      Shelby Janea with Katie at the Plumas County Fairgrounds.
    </figcaption>
  </figure>

  <Sidebar title="Behind the Shoppe">
    <p>
      This year’s effort is headed by Shelby Janea, founder of the
      Women of Plumas County Expo. Shelby personally funded its
      initial venue booking and waived booth fees, helping bring
      around 50 women-owned businesses and nonprofits together.
    </p>
    <p>
      The Expo returns to the Plumas County Fairgrounds on
      Sunday, September 12, 2027.
    </p>
  </Sidebar>

  <div className="shoppe-feature__overflow">
    <Sidebar title="Still Interested in Participating?">
      <p>
        The Shoppe filled quickly, but artisans can still apply for
        overflow space. Additional vendors may be selected the week
        before opening if space allows.
      </p>

      <div className="shoppe-feature__overflow-links">
        <OptionalLink href={links.overflow}>
          Apply for Overflow Space ↗
        </OptionalLink>
        <OptionalLink href={links.membership}>
          Join the Chamber ↗
        </OptionalLink>
      </div>
    </Sidebar>
  </div>
</div>
</section>

          <section className="makers-section journal-width">
            <p className="eyebrow">Meet the makers</p>

<div className="makers-grid">
  <div className="maker maker--portrait">
    <Media
      src={media.allTheRage}
      alt="Creations from All the Rage"
      portrait
    />

    <h2>All the Rage</h2>

    <p>
Nature, whimsy, and a little magic come together at All the Rage: light-up mushroom crowns adorned with real quartz crystals and moss, flower crowns, clay moon necklaces, and hand-painted terra cotta pots featuring imaginative alien landscapes. Each piece is individually handmade—unusual, colorful, and fun.
    </p>

    <SocialIcon
      platform="instagram"
      href="https://www.instagram.com/alltherageinsta/"
      label="Visit All the Rage on Instagram"
    />
  </div>

  <div className="maker maker--landscape">
    <Media
      src={media.gemstoneGenie}
      alt="Creations from Gemstone Genie"
    />

    <h2>Gemstone Genie</h2>

    <p>
      Custom wire-wrapped jewelry and other oddities,
      bringing crystals and materials from nature into
      individually crafted pieces. An all-new collection is in the works for this year’s Artisan Shoppe.
    </p>

    <SocialIcon
      platform="facebook"
      href="https://www.facebook.com/media/set/?set=a.142173428855761&type=3"
      label="View Gemstone Genie’s collection on Facebook"
    />
  </div>
</div>

            <div className="makers-follow">
              <p>
                These are just two of the businesses taking part. Follow
                our Facebook and Instagram for more vendor introductions
                leading up to opening and throughout the Artisan Shoppe
                season.
              </p>
            <SocialLinks />
            </div>
          </section>

          <div className="article-copy opening">
            <h2 className="journal-section-title">Welcoming Our New Board Members</h2>
            <p>
              Change is taking place within the Chamber, too. We’re
              pleased to welcome two new Board Members: Jamie Ashley of
              All the Rage and Christi Hazelton of Region Burger.
              Alongside sharing her creations, Jamie will be helping at
              the Artisan Shoppe. We look forward to the ideas and
              experience both will bring as we continue our work together.
            </p>
            <figure className="region-burger-gallery">
  <div className="region-burger-gallery__images">
    <img
      src={asset("images/region_burger_1.jpg")}
      alt="Region Burger"
      loading="lazy"
      decoding="async"
    />
    <img
      src={asset("images/region_burger_2.jpg")}
      alt="Another view of Region Burger"
      loading="lazy"
      decoding="async"
    />
  </div>
  <figcaption>Region Burger</figcaption>
</figure>
          </div>
<section className="article-copy opening" aria-labelledby="halloween-around-the-valley">
  <h2 id="halloween-around-the-valley" className="journal-section-title">
    Halloween Around the Valley
  </h2>

<p>
  Trunk-or-Treat is a newer way to celebrate Halloween in Indian Valley,
  and it’s already become a tradition in Taylorsville. The Indian Valley
  Recreation &amp; Parks District helps keep the event running safely and
  smoothly, while the Tavern and neighbors turn out for the kids. With
  decorated houses along the way, there’s still plenty to see going
  door to door.
</p>
<p>
  Elsewhere in the valley, Nicole Chilelli brought Halloween to life
  with The Cursed Cove. If you missed it, she shared{" "}
  <a
    href="https://www.instagram.com/nicole_chilelli/?hl=en"
    target="_blank"
    rel="noopener noreferrer"
  >
    clips on Instagram
  </a>.
</p>

<p>
  The district has more coming up, including{" "}
  <button
    type="button"
    className="ivrpd-flyer-link"
    aria-haspopup="dialog"
    aria-controls="ivrpd-flyers"
    onClick={() => document.getElementById("ivrpd-flyers").showModal()}
  >
    yoga and other November classes
  </button>
  . We’ve included a few classes starting this month. For sessions already
  underway and other events, check the district’s website.
</p>

<OptionalLink href="https://ivrpd.org/events/">
  Browse IVRPD Events
</OptionalLink>

<dialog
  id="ivrpd-flyers"
  className="ivrpd-flyers"
  aria-labelledby="ivrpd-flyers-title"
>
  <div className="ivrpd-flyers__header">
    <h2 id="ivrpd-flyers-title">November Classes from IVRPD</h2>
    <form method="dialog">
      <button type="submit" aria-label="Close November flyers">
        Close
      </button>
    </form>
  </div>



  <ul id="ivrpd-flyer-row" className="ivrpd-flyers__row">
    {[
      ["adult-yoga.png", "Adult Yoga"],
      ["seniors-yoga.png", "Serenity Seniors Yoga"],
      ["daddy-daughter-dance.jpg", "Daddy Daughter Dance"],
      ["cheerleading.png", "Cheerleading Skills"],
      ["fall-ceramic-painting.png", "Fall Ceramic Painting"],
    ].map(([file, title]) => (
      <li key={file}>
        <a
          href={asset(`images/${file}`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the full-size ${title} flyer in a new tab`}
        >
          <img
           src={asset(`images/${file}`)}
            alt={`${title} flyer`}
            loading="lazy"
            decoding="async"
          />
        </a>
      </li>
    ))}
  </ul>
    <div className="ivrpd-flyers__controls">
    <button
      type="button"
      aria-label="Scroll flyers left"
      aria-controls="ivrpd-flyer-row"
      onClick={() =>
        document.getElementById("ivrpd-flyer-row").scrollBy({ left: -320 })
      }
    >
      ‹
    </button>
    <button
      type="button"
      aria-label="Scroll flyers right"
      aria-controls="ivrpd-flyer-row"
      onClick={() =>
        document.getElementById("ivrpd-flyer-row").scrollBy({ left: 320 })
      }
    >
      ›
    </button>
  </div>
</dialog>

</section>
<figure className="halloween-gallery journal-width">
  <div className="halloween-gallery__grid">
    <video
      src={asset("images/trickTreatVideo.mov")}
      aria-label="A short clip of trick-or-treating in Taylorsville"
      muted
      playsInline
      preload="metadata"
      ref={(video) => {
        if (!video) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;

            if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              video.play().catch(() => {});
            }

            observer.disconnect();
          },
          { threshold: 0.5 }
        );

        observer.observe(video);
        return () => observer.disconnect();
      }}
    />
    <img
      src={asset("images/trunk_treat_bus.jpg")}
      alt="Decorated bus at Taylorsville’s Trunk-or-Treat"
      loading="lazy"
      decoding="async"
    />
    <img
      src={asset("images/taylorsvilleTrickOrTreat.jpeg")}
      alt="Halloween in Taylorsville"
      loading="lazy"
      decoding="async"
    />
    <img
      src={asset("images/trickTreat.jpeg.jpeg")}
      alt="A scene from trick-or-treating in Taylorsville"
      loading="lazy"
      decoding="async"
    />
  </div>
  <figcaption>Trick-or-treating in Taylorsville, 2025</figcaption>
</figure>
<section
  className="article-copy opening journal-closing"
  aria-labelledby="more-around-the-valley"
>
  <h2 id="more-around-the-valley" className="journal-section-title">
    More Around the Valley
  </h2>

  <p>
    More events are in the works. Follow the Chamber on Facebook
    and Instagram for new announcements and details as plans come
    together.
  </p>

  <SocialLinks />
</section>
        </article>
      </main>

      <footer className="journal-footer">
        <a className="footer-back-to-top" href="#root">
  Back to Top
</a>
        {media.chamberLogo ? (
          <img
            className="journal-footer__logo"
            src={asset(media.chamberLogo)}
            alt="Indian Valley Chamber of Commerce"
            loading="lazy"
          />
        ) : (
          <div className="journal-footer__logo-placeholder">
            Round Chamber
            <br />
            logo
          </div>
        )}

        <SocialLinks />

        <a href="mailto:chamberofcommerceiv@gmail.com">
          chamberofcommerceiv@gmail.com
        </a>

        <p>© 2026 Indian Valley Chamber of Commerce</p>
      </footer>
      <MediaLightbox />
    </>
  );
}