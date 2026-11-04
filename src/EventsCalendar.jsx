import { useState } from "react";
import "./EventsCalendar.css";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const ivrpdClasses = [
  {
    id: "adult-yoga",
    days: [4, 11, 18],
    title: "Adult Yoga",
    time: "8:30–9:15 AM",
    flyer: "adult-yoga.png",
  },
  {
    id: "seniors-yoga",
    days: [4, 11, 18],
    title: "Serenity Seniors Yoga",
    time: "10–10:45 AM",
    flyer: "seniors-yoga.png",
  },
  {
    id: "daddy-daughter-dance",
    days: [5, 12, 19],
    title: "Daddy Daughter Dance",
    time: "11:15–11:45 AM",
    flyer: "daddy-daughter-dance.jpg",
  },
  {
    id: "cheerleading",
    days: [5, 12, 19],
    title: "Cheerleading Skills",
    time: "3:15–4 PM",
    flyer: "cheerleading.png",
  },
  {
    id: "fall-ceramic-painting",
    days: [11],
    title: "Fall Ceramic Painting",
    time: "1–2:30 PM",
    location: "Indian Valley Academy Makerspace, 117 Grand St., Greenville",
    flyer: "fall-ceramic-painting.png",
  },
].flatMap(({ id, days, location, ...details }) =>
  days.map((day) => ({
    ...details,
    id: `${id}-${day}`,
    day,
    location: location ?? "IVRPD Dance Studio, Room 401, 117 Grand St., Greenville",
  }))
);
const events = [
  {
    id: "museum-dinner",
    day: 9,
    title: "Indian Valley Museum Holiday Dinner",
    start: "20261109T173000",
    end: "20261109T203000",
    time: "5:30–8:30 PM",
    location: "Indian Valley Museum Community Room, Taylorsville, CA",
    description: "Turkey dinner and visiting in the museum’s Community Room.",
  },
  {
    id: "veterans-parade",
    day: 11,
    title: "Veterans Day Parade",
    start: "20261111T110000",
    time: "11 AM",
    location: "Downtown Greenville, CA",
    description: "Contact The Legion in Greenville for more information.",
  },
  {
    id: "community-supper",
    day: 16,
    title: "November Community Supper",
    start: "20261116T170000",
    end: "20261116T183000",
    time: "5–6:30 PM",
    location: "Historic Taylorsville Hall, Taylorsville, CA",
    description:
      "Thanksgiving dinner provided by the Indian Valley Riding and Roping Club. All are welcome.",
  },
  {
    id: "thanksgiving",
    day: 26,
    title: "Community Thanksgiving Dinner",
    start: "20261126T110000",
    end: "20261126T150000",
    time: "11 AM–3 PM",
    location: "The Legion, Greenville, CA",
    description:
      "Free and open to everyone. Home delivery signup is required by November 15. Volunteers and baked goods donations welcome. Donation box at The Crescent Store.",
  },
  {
    id: "artisan-shoppe",
    day: 26,
    title: "Artisan Shoppe begins",
    start: "20261126",
    end: "20261221",
    allDay: true,
    time: "November 26–December 20 · Hours to be announced",
    location: "Indian Valley Mercantile, 147 Crescent Street, Greenville, CA",
    description:
      "Seasonal shopping featuring local makers. Calendar entry marks the season, not daily opening hours.",
    url: "https://www.zeffy.com/en-US/ticketing/artisan-market-2",
    linkLabel: "Vendor overflow application",
  },
  {
    id: "light-parade",
    day: 28,
    title: "Taylorsville Light Parade",
    start: "20261128T180000",
    time: "6 PM · Participant lineup 5:30 PM",
    location: "Taylorsville, CA",
    description:
      "Participants: line up on Cemetery Road, single file on the museum side. Bring completed entry forms for collection during lineup. Questions: Laura Kearns, histayhall@gmail.com, (619) 838-2420.",
  },
  ...ivrpdClasses,
].sort((a, b) => a.day - b.day);

// Events without a confirmed ending are saved with their start time only.
function googleLink(event) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${event.start}/${event.end || event.start}`,
    details: event.description,
    location: event.location,
    ctz: "America/Los_Angeles",
  });

  return `https://calendar.google.com/calendar/render?${params}`;
}

function escapeICS(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function downloadEvent(event) {
  const dateField = event.allDay
    ? "VALUE=DATE"
    : "TZID=America/Los_Angeles";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Indian Valley Chamber//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VTIMEZONE",
    "TZID:America/Los_Angeles",
    "BEGIN:STANDARD",
    "DTSTART:20071104T020000",
    "TZOFFSETFROM:-0700",
    "TZOFFSETTO:-0800",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "END:STANDARD",
    "BEGIN:DAYLIGHT",
    "DTSTART:20070311T020000",
    "TZOFFSETFROM:-0800",
    "TZOFFSETTO:-0700",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "END:DAYLIGHT",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${event.id}-2026@indianvalleychamber.org`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART;${dateField}:${event.start}`,
    ...(event.end ? [`DTEND;${dateField}:${event.end}`] : []),
    `SUMMARY:${escapeICS(event.title)}`,
    `LOCATION:${escapeICS(event.location)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  // Fold long lines by UTF-8 byte length for calendar compatibility.
  const encoder = new TextEncoder();
  const folded = lines.map((line) => {
    let result = "";
    let count = 0;

    for (const char of line) {
      const size = encoder.encode(char).length;
      if (count + size > 73) {
        result += "\r\n ";
        count = 1;
      }
      result += char;
      count += size;
    }
    return result;
  });

  const blob = new Blob([folded.join("\r\n") + "\r\n"], {
    type: "text/calendar;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${event.id}.ics`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function EventDetails({ event }) {
  return (
    <details className="calendar-event">
      <summary>{event.title}</summary>

      <div className="calendar-event__body">
        <p>{event.time}</p>
        <p>{event.location}</p>
        {event.description && <p>{event.description}</p>}

        {event.flyer ? (
          <a
            href={asset(`images/${event.flyer}`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View the ${event.title} flyer in a new tab`}
          >
            View Flyer
          </a>
        ) : (
          <>
            {event.url && (
              <a href={event.url} target="_blank" rel="noopener noreferrer">
                {event.linkLabel}
              </a>
            )}

            <div className="calendar-event__actions">
              <a
                href={googleLink(event)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Calendar
              </a>

              <button type="button" onClick={() => downloadEvent(event)}>
                Apple / Outlook
              </button>
            </div>
          </>
        )}
      </div>
    </details>
  );
}

export default function EventsCalendar() {
  const [logoFailed, setLogoFailed] = useState(false);

  // November 1, 2026 is Sunday: five complete calendar rows.
  const days = Array.from({ length: 35 }, (_, index) =>
    index < 30 ? index + 1 : null
  );

  return (
    <>
      <header className="navbar">
        <a className="navbar__brand" href="https://indianvalleychamber.org/">
          <img
            className="navbar__heron"
            src={asset("images/Charcoal Heron Engraving in Flight.png")}
            alt=""
          />
          <span>
            Indian Valley
            <small>Chamber of Commerce</small>
          </span>
        </a>

        <a className="navbar__link" href="#newsletter">
          ← Back to Newsletter
        </a>
      </header>

      <main className="events-page">
     <div className="events-intro">
  <header className="events-heading">
    <p className="eyebrow">Around Indian Valley</p>
    <h1>November 2026</h1>
    <p>Community gatherings &amp; seasonal traditions.</p>
    <span className="events-hint">
      Select an event to see details, view a flyer, or add it to your
      calendar where available.
    </span>
  </header>

  <img
    className="events-intro__photo"
    src={asset("images/fall.jpg")}
    alt="Autumn in Indian Valley"
    width={180}
    height={220}
  />
</div>

        <div className="month-calendar">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div className="month-calendar__weekday" key={day}>
              {day}
            </div>
          ))}

          {days.map((day, index) => (
            <div
              className={`month-calendar__day ${!day ? "is-empty" : ""}`}
              key={index}
            >
              {day && (
                <>
                  <time dateTime={`2026-11-${String(day).padStart(2, "0")}`}>
                    {day}
                  </time>
                  {events
                    .filter((event) => event.day === day)
                    .map((event) => (
                      <EventDetails key={event.id} event={event} />
                    ))}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="events-mobile">
          {events.map((event) => (
            <section className="events-mobile__day" key={event.id}>
              <time dateTime={`2026-11-${String(event.day).padStart(2, "0")}`}>
                Nov {event.day}
              </time>
              <EventDetails event={event} />
            </section>
          ))}
        </div>

        <aside className="events-looking-ahead">
          <p className="eyebrow">Looking ahead</p>
          <h2>Christmas in Crescent</h2>
          <p>December 13, 2026 · 2–8 PM · Crescent Mills</p>
          <a href="sms:+15302498941">
            Vendor inquiries: text Alyssa Dobbins ↗
          </a>
        </aside>
      </main>

      <footer className="journal-footer">
        {!logoFailed ? (
          <img
            className="journal-footer__logo"
            src={asset("images/chamber_round_logo.png")}
            alt="Indian Valley Chamber of Commerce"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <p>Indian Valley Chamber of Commerce</p>
        )}

        <a href="mailto:chamberofcommerceiv@gmail.com">
          chamberofcommerceiv@gmail.com
        </a>
        <p>© 2026 Indian Valley Chamber of Commerce</p>
      </footer>
    </>
  );
}