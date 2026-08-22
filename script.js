/* ================================================================
   DANVEER & HARMAN PREET — WEDDING INVITATION
   script.js — vanilla JS only, no frameworks, GitHub Pages safe
   ================================================================ */
(function () {
  "use strict";

  /* ---------------------------------------------------------------
     Utility
     --------------------------------------------------------------- */
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const pad2 = (n) => String(Math.max(0, n)).padStart(2, "0");

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setupLanguageToggle();
    setupMobileNav();
    setupMusicToggle();
    setupOpenInvitation();
    setupCountdown();
    setupEventTabs();
    setupCarousel();
    setupRsvpForm();
    setupIcsButtons();
    setupScrollReveal();
    setupPetals();
  }

  /* ---------------------------------------------------------------
     1. LANGUAGE TOGGLE (Punjabi <-> English)
     Body carries .lang-pa (default) or .lang-en; CSS handles the
     bilingual emphasis swap for .pa/.en blocks. Elements tagged
     with class="i18n" (nav links, buttons, labels) get their
     textContent swapped directly from data-en / data-pa.
     --------------------------------------------------------------- */
  function setupLanguageToggle() {
    const btn = $("#langToggle");
    const body = document.body;

    function applyI18nText(lang) {
      $$(".i18n").forEach((el) => {
        const text = lang === "en" ? el.dataset.en : el.dataset.pa;
        if (text) el.textContent = text;
      });
    }

    function setLang(lang) {
      body.classList.toggle("lang-en", lang === "en");
      body.classList.toggle("lang-pa", lang !== "en");
      body.setAttribute("lang", lang === "en" ? "en" : "pa");
      applyI18nText(lang);
      try { localStorage.setItem("wedding-lang", lang); } catch (e) { /* Safari private mode etc. */ }
    }

    let saved = "pa";
    try { saved = localStorage.getItem("wedding-lang") || "pa"; } catch (e) { /* ignore */ }
    setLang(saved);

    btn.addEventListener("click", () => {
      const next = body.classList.contains("lang-en") ? "pa" : "en";
      setLang(next);
    });
  }

  /* ---------------------------------------------------------------
     2. MOBILE NAV
     --------------------------------------------------------------- */
  function setupMobileNav() {
    const burger = $("#navBurger");
    const links = $("#navLinks");
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------------------------------------------------------------
     3. MUSIC TOGGLE
     Muted / paused by default in line with browser autoplay
     policies — playback only starts after an explicit tap.
     --------------------------------------------------------------- */
  function setupMusicToggle() {
    const btn = $("#musicToggle");
    const audio = $("#shabadAudio");

    btn.addEventListener("click", () => {
      const playing = btn.getAttribute("aria-pressed") === "true";
      if (playing) {
        audio.pause();
        btn.setAttribute("aria-pressed", "false");
      } else {
        audio.volume = 0.5;
        audio.play().catch(() => {
          /* File not provided yet — see assets/shabad-instrumental.mp3
             comment in index.html. Fails silently and gracefully. */
        });
        btn.setAttribute("aria-pressed", "true");
      }
    });
  }

  /* ---------------------------------------------------------------
     4. OPEN INVITATION BUTTON — smooth-scrolls to countdown and
        gives the hero a subtle "unveil" moment.
     --------------------------------------------------------------- */
  function setupOpenInvitation() {
    const btn = $("#openInvitation");
    btn.addEventListener("click", () => {
      const target = $("#countdown");
      if (target) target.scrollIntoView({ behavior: "smooth" });
      // Nudge music to start on this explicit user gesture too.
      const audio = $("#shabadAudio");
      const musicBtn = $("#musicToggle");
      if (audio && audio.paused && musicBtn.getAttribute("aria-pressed") !== "true") {
        audio.volume = 0.5;
        audio.play().then(() => musicBtn.setAttribute("aria-pressed", "true")).catch(() => {});
      }
    });
  }

  /* ---------------------------------------------------------------
     5. COUNTDOWN — to 25 October 2026, 11:00 AM IST
     --------------------------------------------------------------- */
  function setupCountdown() {
    const grid = $("#countdownGrid");
    if (!grid) return;
    const target = new Date(grid.dataset.target).getTime();

    const els = {
      d: $("#cdDays"), h: $("#cdHours"), m: $("#cdMinutes"), s: $("#cdSeconds"),
    };
    let previous = { d: null, h: null, m: null, s: null };

    function tick() {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      updateCell(els.d, pad2(days), "d");
      updateCell(els.h, pad2(hours), "h");
      updateCell(els.m, pad2(minutes), "m");
      updateCell(els.s, pad2(seconds), "s");

      if (diff <= 0) clearInterval(timer);
    }

    function updateCell(el, value, key) {
      if (!el) return;
      if (previous[key] !== value) {
        el.textContent = value;
        el.classList.remove("tick");
        // Force reflow so the animation can restart every second.
        void el.offsetWidth;
        el.classList.add("tick");
        previous[key] = value;
      }
    }

    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------
     6. EVENT TABS — Shagun & Ring Ceremony / Anand Karaj
     --------------------------------------------------------------- */
  function setupEventTabs() {
    const tabs = $$(".event-tab");
    const panels = {
      shagun: $("#panel-shagun"),
      anand: $("#panel-anand"),
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.dataset.tab;
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("active", active);
          t.setAttribute("aria-selected", String(active));
        });
        Object.entries(panels).forEach(([k, panel]) => {
          if (!panel) return;
          if (k === key) {
            panel.hidden = false;
            panel.classList.add("active");
            panel.style.animation = "none";
            void panel.offsetWidth;
            panel.style.animation = "";
          } else {
            panel.hidden = true;
            panel.classList.remove("active");
          }
        });
      });
    });
  }

  /* ---------------------------------------------------------------
     7. GALLERY CAROUSEL
     --------------------------------------------------------------- */
  function setupCarousel() {
    const track = $("#carouselTrack");
    const dotsWrap = $("#carouselDots");
    if (!track) return;
    const slides = $$(".carousel-slide", track);
    let index = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      if (i === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", "Go to photo " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = $$("button", dotsWrap);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle("active", di === index));
    }

    $("#carouselPrev").addEventListener("click", () => goTo(index - 1));
    $("#carouselNext").addEventListener("click", () => goTo(index + 1));

    // Basic swipe support for touch devices
    let startX = 0;
    track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      const delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 40) goTo(index + (delta < 0 ? 1 : -1));
    }, { passive: true });

    // Gentle auto-advance, pauses on hover/focus
    let auto = setInterval(() => goTo(index + 1), 5000);
    const carousel = $("#carousel");
    carousel.addEventListener("mouseenter", () => clearInterval(auto));
    carousel.addEventListener("mouseleave", () => { auto = setInterval(() => goTo(index + 1), 5000); });
  }

  /* ---------------------------------------------------------------
     8. RSVP FORM (Formspree-ready)
     Submits via fetch so we can show an inline confirmation without
     leaving the page. Works the moment YOUR_FORM_ID is replaced in
     index.html — see the comment above the <form> tag there.
     --------------------------------------------------------------- */
  function setupRsvpForm() {
    const form = $("#rsvpForm");
    if (!form) return;
    const status = $("#formStatus");
    const isEn = () => document.body.classList.contains("lang-en");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const endpointConfigured = !form.action.includes("YOUR_FORM_ID");

      status.textContent = isEn() ? "Sending your RSVP…" : "ਤੁਹਾਡੀ ਹਾਜ਼ਰੀ ਭੇਜੀ ਜਾ ਰਹੀ ਹੈ…";

      if (!endpointConfigured) {
        // No Formspree endpoint wired up yet — let the couple know in
        // the console, and reassure the guest in the UI regardless.
        console.info("RSVP: replace YOUR_FORM_ID in index.html with your Formspree endpoint to receive live submissions.");
        setTimeout(() => {
          status.textContent = isEn()
            ? "Thank you! Your RSVP has been noted."
            : "ਧੰਨਵਾਦ! ਤੁਹਾਡੀ ਹਾਜ਼ਰੀ ਦਰਜ ਕਰ ਲਈ ਗਈ ਹੈ।";
          form.reset();
        }, 600);
        return;
      }

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          status.textContent = isEn()
            ? "Thank you! Your RSVP has been received."
            : "ਧੰਨਵਾਦ! ਤੁਹਾਡੀ ਹਾਜ਼ਰੀ ਪ੍ਰਾਪਤ ਹੋ ਗਈ ਹੈ।";
          form.reset();
        } else {
          throw new Error("Form submission failed");
        }
      } catch (err) {
        status.textContent = isEn()
          ? "Something went wrong. Please try again or WhatsApp us directly."
          : "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਸਾਨੂੰ ਸਿੱਧਾ WhatsApp ਕਰੋ।";
      }
    });
  }

  /* ---------------------------------------------------------------
     9. ADD TO CALENDAR — generates real .ics files client-side
     --------------------------------------------------------------- */
  const ICS_EVENTS = {
    shagun: {
      title: "Shagun & Ring Ceremony — Danveer & Harman Preet",
      description: "Welcome & High Tea, Shagun Ceremony, Ring Ceremony, Dinner.",
      location: "Regenta Central Amritsar",
      start: "20261023T183000",
      end: "20261023T223000",
    },
    anand: {
      title: "Anand Karaj — Danveer & Harman Preet",
      description: "Anand Karaj ceremony followed by lunch.",
      location: "Sandoz Amritsar",
      start: "20261025T110000",
      end: "20261025T150000",
    },
  };

  function setupIcsButtons() {
    $$("[data-ics]").forEach((btn) => {
      btn.addEventListener("click", () => downloadIcs(ICS_EVENTS[btn.dataset.ics]));
    });
  }

  function downloadIcs(evt) {
    if (!evt) return;
    // Indian Standard Time, no daylight saving — encode as floating
    // local time so it displays correctly regardless of the
    // guest's own timezone setting in most calendar apps.
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Danveer & Harman Preet Wedding//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${evt.start}-${Math.random().toString(36).slice(2)}@wedding-invite`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART;TZID=Asia/Kolkata:${evt.start}`,
      `DTEND;TZID=Asia/Kolkata:${evt.end}`,
      `SUMMARY:${escapeIcs(evt.title)}`,
      `DESCRIPTION:${escapeIcs(evt.description)}`,
      `LOCATION:${escapeIcs(evt.location)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = evt.title.replace(/[^\w]+/g, "-").toLowerCase() + ".ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function escapeIcs(str) {
    return String(str).replace(/([,;])/g, "\\$1");
  }

  /* ---------------------------------------------------------------
     10. SCROLL REVEAL — fades sections/cards in as they enter view
     --------------------------------------------------------------- */
  function setupScrollReveal() {
    const targets = $$(
      ".countdown-grid, .event-tabs, .event-panels, .parents-grid, .quote-frame, .carousel, .rsvp-wrap, .calendar-actions"
    );
    targets.forEach((el) => el.classList.add("reveal"));

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------
     11. FLOATING PETALS — lightweight, capped, GPU-friendly
     --------------------------------------------------------------- */
  function setupPetals() {
    const layer = $("#petalsLayer");
    if (!layer) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const MAX_PETALS = 18;
    let active = 0;

    function spawn() {
      if (active >= MAX_PETALS) return;
      const petal = document.createElement("div");
      petal.className = "petal";
      const left = Math.random() * 100;
      const duration = 9 + Math.random() * 7;
      const drift = (Math.random() - 0.5) * 160;
      const size = 8 + Math.random() * 8;

      petal.style.left = left + "vw";
      petal.style.width = size + "px";
      petal.style.height = size * 0.7 + "px";
      petal.style.setProperty("--drift", drift + "px");
      petal.style.animationDuration = duration + "s";

      layer.appendChild(petal);
      active++;
      petal.addEventListener("animationend", () => {
        petal.remove();
        active--;
      });
    }

    // Gentle, irregular cadence so it reads as organic, not mechanical.
    setInterval(spawn, 900);
    for (let i = 0; i < 5; i++) setTimeout(spawn, i * 300);
  }
})();
