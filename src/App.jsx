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

  if (showCalendar) {
  return <EventsCalendar />;
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
    Calendar of Events ↗
  </a>

  <a
    className="navbar__membership"
    href="https://www.zeffy.com/en-US/ticketing/indian-valley-chamber-of-commerces-memberships"
    target="_blank"
    rel="noopener noreferrer"
  >
    Become a Member ↗
  </a>
</div>
      </header>

      <main id="journal">
        <article>
          <header className="journal-hero">
            <img
              className="journal-hero__image"
              src={asset("images/fall_colors.jpg")}
              alt="Autumn colors in Indian Valley, Plumas County, California"
              fetchPriority="high"
            />

            <div className="journal-hero__content">
              <time className="journal-hero__date" dateTime="2026-11-04">
                November 4, 2026
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

          <figure className="journal-width journal-figure">
            <Media
              src={media.trunkOrTreat}
              alt="Halloween in downtown Taylorsville"
            />
            <figcaption>
              On Halloween, IVRPD helped host Taylorsville’s
              Trunk-or-Treat, where decorated vehicles lined downtown
              and neighbors handed out goodies alongside the town’s
              traditional door-to-door trick-or-treating.
            </figcaption>
          </figure>

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
    />
  </figure>
</section>

<section className="hotel-feature journal-width">
  <div className="hotel-feature__left">
    <Media
      src={media.hotelOutside}
      alt="The exterior of The Crescent Hotel in Crescent Mills"
    />

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

  <Media
    src={media.hotelRoom}
    alt="A newly remodeled guest room at The Crescent Hotel"
  />
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
    <p>
      Our community suppers have been a bright spot in the
      changing landscape of life since the Dixie Fire.
    </p>

    <p>
      The Indian Valley Museum’s Holiday Dinner is Monday,
      November 9, from 5:30 to 8:30 PM—a turkey dinner and
      visiting in the museum’s Community Room in Taylorsville.
    </p>

    <p>
      On Monday, November 16, the Indian Valley Riding and
      Roping Club will provide a Thanksgiving dinner at Historic
      Taylorsville Hall for the November Community Supper.
      Everyone is welcome from 5 to 6:30 PM.
    </p>

    <p>
      In Greenville, the Community Thanksgiving Dinner will
      take place on Thursday, November 26, from 11 AM to 3 PM
      at The Legion. The meal is free and open to everyone,
      with delivery available for those physically unable
      to attend.
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

          <section className="editorial-row journal-width">
            <div className="editorial-row__copy">
              <p>
                Still a young tradition itself, the Artisan Shoppe
                returns for its second year—this time at Indian Valley
                Mercantile in Greenville. A new setting, returning
                participants, and new makers joining in: another example
                of the familiar growing into something new.
              </p>
              <p className="shoppe-details">
                November 26–December 20, 2026
                <br />
                147 Crescent Street, Greenville
              </p>
            </div>

            <div className="sidebar-stack">
              <Sidebar title="Behind the Shoppe">
                <p>
                  This year’s effort is headed by Shelby Janea, founder
                  of the Women of Plumas County Expo. Shelby personally
                  funded its initial venue booking and waived booth
                  fees, helping bring around 50 women-owned businesses
                  and nonprofits together.
                </p>
                <p>
                  The Expo returns to the Plumas County Fairgrounds on
                  Sunday, September 12, 2027.
                </p>
              </Sidebar>

              <Sidebar title="Still interested in participating?">
                <p>
                  The Artisan Shoppe filled quickly, but applications
                  are open for potential overflow spaces. Additional
                  vendors may be selected the week before opening,
                  depending on available space.
                </p>
                <OptionalLink href={links.overflow}>
                  Apply for Overflow Space ↗
                </OptionalLink>
                <OptionalLink href={links.membership}>
                  Join the Chamber ↗
                </OptionalLink>
              </Sidebar>
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
            <p>
              Change is taking place within the Chamber, too. We’re
              pleased to welcome two new Board Members: Jamie Ashley of
              All the Rage and Christi Hazelton of Region Burger.
              Alongside sharing her creations, Jamie will be helping at
              the Artisan Shoppe. We look forward to the ideas and
              experience both will bring as we continue our work together.
            </p>
          </div>
        </article>
      </main>

      <footer className="journal-footer">
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