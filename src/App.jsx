import { useState } from "react";
import "./App.css";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

// Add missing filenames and links here when ready.
const media = {
  genesee: "videos/genesee_farms.mp4",
  umc: "videos/fall_into_greenville.mp4",
  waystation: "",
  hotel: "",
  trunkOrTreat: "",
  allTheRage: "",
  gemstoneGenie: "",
  chamberLogo: "",
};

const links = {
  facebook: "",
  instagram: "",
  hotel: "",
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
      <OptionalLink href={links.facebook}>Facebook ↗</OptionalLink>
      <OptionalLink href={links.instagram}>Instagram ↗</OptionalLink>
    </div>
  );
}

export default function App() {
  const [shareMessage, setShareMessage] = useState("");

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

        <a className="navbar__link" href="#journal">
          November Journal
        </a>
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
          </header>

          <div className="article-copy opening">
            <p>
              In Indian Valley, traditions have a way of carrying on
              without much thought. Familiar faces greet us in the little
              towns that make up our valley and its close neighbors.
              Knowing the people we pass is one of the quiet constants
              of life here.
            </p>
            <p>
              Since the Dixie Fire, change has become another constant.
              Familiar places take new forms, beloved gatherings return,
              and new traditions begin. This autumn, as gold and
              rust-colored oak leaves trace veins through the evergreen
              pines and firs along our mountainsides, there is beauty to
              notice in the changes around us.
            </p>
            <p>
              California black oaks can send up new shoots after fire
              from roots that survive beneath the surface. Perhaps there
              is something familiar in that, too: new growth drawing
              strength from what remains. As we rebuild, reopen, and
              gather again, we can make room for what is emerging while
              holding close the traditions—and the people—that connect us.
            </p>
          </div>

          <section className="portrait-story journal-width">
            <Media
              src={media.genesee}
              alt="An October visit to Genesee Farms"
              video
              portrait
            />
            <div className="portrait-story__copy">
              <p className="eyebrow">An October in the valley</p>
              <p>
                In Genesee Valley, the opening of Genesee Farms offers
                another place to gather and a new connection to the land.
                The organic, sustainable farm welcomed visitors this
                October, giving neighbors a chance to explore and meet
                the people bringing it to life.
              </p>
            </div>
          </section>

          <section className="portrait-story portrait-story--reverse journal-width">
            <Media
              src={media.umc}
              alt="UMC’s Fall into Greenville festival"
              video
              portrait
            />
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

          <div className="article-copy opening">
            <p>
              In Greenville, preserving the past is itself a new
              beginning. The Greenville Cy Hall Memorial Museum welcomed
              visitors to tour its rebuilt building during an October 25
              open house. After the Dixie Fire destroyed its historic
              building and much of its collection, this gathering marked
              a meaningful step toward the museum’s return.
            </p>
          </div>

          <section className="journal-width">
            <Media
              src={media.waystation}
              alt="Finishing touches at The Waystation"
              video
            />
            <div className="article-copy">
              <p>
                That same sense of renewal is taking shape elsewhere in
                town. At The Waystation, finishing touches on the exterior
                are bringing its changing appearance into focus, another
                visible step in Greenville’s ongoing rebuilding.
              </p>
            </div>
          </section>

          <section className="journal-width">
            <Media
              src={media.hotel}
              alt="Newly remodeled rooms at The Crescent Hotel"
            />

            <div className="editorial-row">
              <div className="editorial-row__copy">
                <p>
                  In Crescent Mills, The Crescent Hotel is welcoming
                  guests into its newly remodeled upstairs rooms. A
                  familiar landmark with a fresh look, its transformation
                  is another reminder that change can bring new life to
                  places we have long known.
                </p>
              </div>
              <Sidebar title="Stay in Crescent Mills">
                <OptionalLink href={links.hotel}>
                  Book a Room at The Crescent Hotel ↗
                </OptionalLink>
              </Sidebar>
            </div>
          </section>

          <section className="editorial-row journal-width">
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
                Chamber members interested in a vendor space are invited
                to contact Alyssa.
              </p>
              {links.alyssaEmail && (
                <a
                  className="journal-link"
                  href={`mailto:${links.alyssaEmail}`}
                >
                  Email Alyssa ↗
                </a>
              )}
            </Sidebar>
          </section>

          <div className="article-copy opening">
            <p>
              Other traditions need little introduction. For many in
              Indian Valley, November 11 means heading to downtown
              Greenville, greeting familiar faces, and gathering to honor
              those who have served. This year’s Veterans Day Parade
              begins at 11 AM on Wednesday, November 11, 2026.
            </p>
          </div>

          <section className="editorial-row journal-width">
            <div className="editorial-row__copy">
              <p>
                Our community suppers have been a bright spot in the
                changing landscape of life since the Dixie Fire.
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
                at The Legion. The meal is free and open to everyone.
              </p>
            </div>
            <div className="sidebar-stack">
              <Sidebar title="A Thanksgiving Meal for Everyone">
                <p>
                  Meal delivery is available for people physically
                  unable to attend the Greenville dinner. Sign yourself
                  or someone you know up by November 15.
                </p>
                <p>
                  Volunteers and donations of baked goods are welcome.
                  A donation box is now available at The Crescent Store.
                </p>
                <OptionalLink href={links.thanksgiving}>
                  Meal Delivery & Volunteer Signup ↗
                </OptionalLink>
              </Sidebar>

              <Sidebar title="Also at the Museum">
                <p>
                  Indian Valley Museum Holiday Dinner
                  <br />
                  November 9 · 5:30–8:30 PM
                </p>
                <p>
                  Turkey dinner and visiting in the museum’s Community
                  Room in Taylorsville.
                </p>
              </Sidebar>
            </div>
          </section>

          <section className="editorial-row journal-width">
            <div className="editorial-row__copy">
              <p>
                As November draws to a close, another familiar celebration
                will light up Taylorsville. The annual Taylorsville Light
                Parade returns on Saturday, November 28, at 6 PM,
                welcoming everyone to ring in the Christmas season.
              </p>
            </div>
            <Sidebar title="Join the Light Parade">
              <p>
                Bring your completed entry form and line up by 5:30 PM on
                Cemetery Road, single file on the museum side. Forms will
                be collected during lineup.
              </p>
              <p>
                Questions? Contact Laura Kearns at{" "}
                <a href="mailto:histayhall@gmail.com">
                  histayhall@gmail.com
                </a>{" "}
                or <a href="tel:+16198382420">(619) 838-2420</a>.
              </p>
              <OptionalLink href={links.paradeForm}>
                Print Entry Form ↗
              </OptionalLink>
            </Sidebar>
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
                <p>
                  Artisans can also request a spot at Christmas in
                  Crescent—a separate event with different dates and a
                  different location. Indicate your interest when applying.
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
              <div className="maker">
                <Media
                  src={media.allTheRage}
                  alt="Creations from All the Rage"
                  portrait
                />
                <h2>All the Rage</h2>
                <p>
                  A little woodland fantasy: illuminated mushroom fairy
                  crowns adorned with real crystals, clay moon jewelry,
                  hand-painted terracotta planters, and houseplants.
                </p>
              </div>

              <div className="maker">
                <Media
                  src={media.gemstoneGenie}
                  alt="Creations from Gemstone Genie"
                  portrait
                />
                <h2>Gemstone Genie</h2>
                <p>
                  Custom wire-wrapped jewelry and other oddities,
                  bringing crystals and materials from nature into
                  individually crafted pieces.
                </p>
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
    </>
  );
}