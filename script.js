/* ============================================================
   DANVEER & HARMAN PREET — WEDDING INVITATION
   script.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================
     1. ELEMENTS
     ========================================================== */

  const opening = document.getElementById("weddingOpening");
  const openButton = document.getElementById("openInvitation");
  const scratchScreen = document.getElementById("scratchScreen");
  const scratchCanvas = document.getElementById("scratchCanvas");
  const continueButton = document.getElementById("continueInvitation");
  const petalsLayer = document.getElementById("openingPetals");


  /* ==========================================================
     2. OPENING SCREEN
     ========================================================== */

  if (opening && openButton) {

    openButton.addEventListener("click", () => {

      /*
       * Prevent double clicking
       */
      if (opening.classList.contains("is-open")) {
        return;
      }

      /*
       * Open the gates
       */
      opening.classList.add("is-open");

      /*
       * Create romantic petal animation
       */
      createPetals(45);

      /*
       * Show scratch card after gates finish opening
       */
      setTimeout(() => {

        opening.classList.add("show-scratch");

        /*
         * Wait until scratch screen has rendered
         */
        setTimeout(() => {
          initialiseScratchCard();
        }, 200);

      }, 1800);

    });

  }


  /* ==========================================================
     3. FLOATING PETALS
     ========================================================== */

  function createPetals(number = 30) {

    if (!petalsLayer) return;

    for (let i = 0; i < number; i++) {

      const petal = document.createElement("span");

      petal.className = "petal";

      /*
       * Random horizontal starting position
       */
      petal.style.left =
        Math.random() * 100 + "%";

      /*
       * Random falling speed
       */
      petal.style.animationDuration =
        (5 + Math.random() * 7) + "s";

      /*
       * Random delay
       */
      petal.style.animationDelay =
        Math.random() * 2 + "s";

      /*
       * Random horizontal movement
       */
      petal.style.setProperty(
        "--drift",
        (Math.random() * 300 - 150) + "px"
      );

      /*
       * Random size
       */
      const size =
        8 + Math.random() * 10;

      petal.style.width =
        size + "px";

      petal.style.height =
        (size * 1.45) + "px";

      /*
       * Random rotation
       */
      petal.style.transform =
        `rotate(${Math.random() * 360}deg)`;

      petalsLayer.appendChild(petal);

      /*
       * Remove after animation
       */
      setTimeout(() => {

        if (petal.parentNode) {
          petal.remove();
        }

      }, 15000);

    }

  }


  /* ==========================================================
     4. SCRATCH HEART
     ========================================================== */

  let scratchInitialised = false;

  function initialiseScratchCard() {

    /*
     * Prevent initializing canvas more than once
     */
    if (scratchInitialised) return;

    if (!scratchCanvas) return;

    scratchInitialised = true;

    const container =
      scratchCanvas.parentElement;

    if (!container) return;

    const rect =
      container.getBoundingClientRect();

    const width =
      Math.max(1, Math.floor(rect.width));

    const height =
      Math.max(1, Math.floor(rect.height));

    const dpr =
      Math.min(window.devicePixelRatio || 1, 2);

    /*
     * High-resolution canvas
     */
    scratchCanvas.width =
      width * dpr;

    scratchCanvas.height =
      height * dpr;

    scratchCanvas.style.width =
      width + "px";

    scratchCanvas.style.height =
      height + "px";

    const ctx =
      scratchCanvas.getContext("2d", {
        willReadFrequently: true
      });

    /*
     * Draw in CSS-pixel coordinates
     */
    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );


    /* ========================================================
       GOLD SCRATCH SURFACE
       ======================================================== */

    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        width,
        height
      );

    gradient.addColorStop(
      0,
      "#b98232"
    );

    gradient.addColorStop(
      0.25,
      "#e4bd6d"
    );

    gradient.addColorStop(
      0.5,
      "#f4d995"
    );

    gradient.addColorStop(
      0.75,
      "#d3a052"
    );

    gradient.addColorStop(
      1,
      "#a86e28"
    );

    ctx.globalCompositeOperation =
      "source-over";

    ctx.fillStyle =
      gradient;

    ctx.fillRect(
      0,
      0,
      width,
      height
    );


    /* ========================================================
       GOLD TEXTURE
       ======================================================== */

    for (let i = 0; i < 700; i++) {

      const x =
        Math.random() * width;

      const y =
        Math.random() * height;

      const r =
        Math.random() * 1.8;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        r,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        Math.random() > .5
          ? "rgba(255,255,255,.15)"
          : "rgba(90,40,10,.10)";

      ctx.fill();

    }


    /* ========================================================
       SCRATCH INSTRUCTION
       ======================================================== */

    ctx.textAlign =
      "center";

    ctx.textBaseline =
      "middle";

    ctx.fillStyle =
      "#64101b";

    ctx.font =
      '600 24px "Cormorant Garamond", serif';

    ctx.fillText(
      "SCRATCH TO REVEAL",
      width / 2,
      height / 2 - 12
    );

    ctx.font =
      '18px "Poppins", sans-serif';

    ctx.fillText(
      "♡",
      width / 2,
      height / 2 + 25
    );


    /* ========================================================
       SCRATCH INTERACTION
       ======================================================== */

    let scratching = false;

    let lastX = 0;
    let lastY = 0;

    let lastCheck = 0;


    function getPointerPosition(event) {

      const bounds =
        scratchCanvas.getBoundingClientRect();

      return {
        x:
          event.clientX -
          bounds.left,

        y:
          event.clientY -
          bounds.top
      };

    }


    function scratchAt(x, y) {

      ctx.globalCompositeOperation =
        "destination-out";

      /*
       * Large brush makes mobile scratching
       * much easier.
       */
      ctx.lineWidth =
        Math.max(42, width * .13);

      ctx.lineCap =
        "round";

      ctx.lineJoin =
        "round";

      ctx.beginPath();

      ctx.moveTo(
        lastX,
        lastY
      );

      ctx.lineTo(
        x,
        y
      );

      ctx.stroke();

      /*
       * Also remove a circular area at
       * the current pointer position.
       */
      ctx.beginPath();

      ctx.arc(
        x,
        y,
        ctx.lineWidth / 2,
        0,
        Math.PI * 2
      );

      ctx.fill();

      lastX = x;
      lastY = y;

      /*
       * Don't calculate thousands of pixels
       * on every pointer movement.
       */
      const now =
        Date.now();

      if (now - lastCheck > 250) {

        lastCheck = now;

        checkScratchProgress();

      }

    }


    /* ========================================================
       POINTER DOWN
       ======================================================== */

    scratchCanvas.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();

        scratching = true;

        scratchCanvas.setPointerCapture(
          event.pointerId
        );

        const pos =
          getPointerPosition(event);

        lastX = pos.x;
        lastY = pos.y;

        scratchAt(
          pos.x,
          pos.y
        );

      }
    );


    /* ========================================================
       POINTER MOVE
       ======================================================== */

    scratchCanvas.addEventListener(
      "pointermove",
      event => {

        if (!scratching) return;

        event.preventDefault();

        const pos =
          getPointerPosition(event);

        scratchAt(
          pos.x,
          pos.y
        );

      }
    );


    /* ========================================================
       POINTER UP
       ======================================================== */

    function stopScratching(event) {

      scratching = false;

      try {

        if (
          event &&
          scratchCanvas.hasPointerCapture(
            event.pointerId
          )
        ) {

          scratchCanvas.releasePointerCapture(
            event.pointerId
          );

        }

      } catch (error) {
        /* Ignore pointer release errors */
      }

      checkScratchProgress();

    }


    scratchCanvas.addEventListener(
      "pointerup",
      stopScratching
    );

    scratchCanvas.addEventListener(
      "pointercancel",
      stopScratching
    );


    /* ========================================================
       CHECK SCRATCH %
       ======================================================== */

    function checkScratchProgress() {

      /*
       * Once revealed, don't keep checking.
       */
      if (
        scratchCanvas.dataset.revealed === "true"
      ) {
        return;
      }

      /*
       * Use a smaller sampling canvas for
       * better performance on mobile.
       */

      const sampleSize = 80;

      const tempCanvas =
        document.createElement("canvas");

      tempCanvas.width =
        sampleSize;

      tempCanvas.height =
        sampleSize;

      const tempCtx =
        tempCanvas.getContext("2d");

      tempCtx.drawImage(
        scratchCanvas,
        0,
        0,
        sampleSize,
        sampleSize
      );

      const imageData =
        tempCtx.getImageData(
          0,
          0,
          sampleSize,
          sampleSize
        ).data;

      let transparentPixels = 0;

      const totalPixels =
        sampleSize *
        sampleSize;


      for (
        let i = 3;
        i < imageData.length;
        i += 4
      ) {

        if (
          imageData[i] < 70
        ) {

          transparentPixels++;

        }

      }


      const percentage =
        transparentPixels /
        totalPixels;


      /*
       * Reveal at 42%.
       */
      if (percentage >= .42) {

        revealHeart();

      }

    }


    /* ========================================================
       REVEAL HEART
       ======================================================== */

    function revealHeart() {

      if (
        scratchCanvas.dataset.revealed === "true"
      ) {
        return;
      }

      scratchCanvas.dataset.revealed =
        "true";

      scratchCanvas.style.transition =
        "opacity .8s ease";

      scratchCanvas.style.opacity =
        "0";

      scratchCanvas.style.pointerEvents =
        "none";


      /*
       * Reveal button
       */
      if (continueButton) {

        setTimeout(() => {

          continueButton.classList.add(
            "visible"
          );

        }, 500);

      }


      /*
       * Celebration petals
       */
      createPetals(35);


      /*
       * Small heart celebration
       */
      createHeartParticles();

    }

  }


  /* ==========================================================
     5. HEART PARTICLES
     ========================================================== */

  function createHeartParticles() {

    const heart =
      document.getElementById(
        "scratchHeart"
      );

    if (!heart) return;

    for (let i = 0; i < 18; i++) {

      const particle =
        document.createElement("span");

      particle.textContent =
        "♥";

      particle.style.position =
        "absolute";

      particle.style.left =
        "50%";

      particle.style.top =
        "50%";

      particle.style.color =
        "#8c182c";

      particle.style.fontSize =
        (10 + Math.random() * 14) + "px";

      particle.style.pointerEvents =
        "none";

      particle.style.zIndex =
        "10";

      particle.style.transition =
        "all 1.4s ease";

      heart.appendChild(
        particle
      );


      requestAnimationFrame(() => {

        particle.style.transform =
          `translate(
            ${(Math.random() * 240) - 120}px,
            ${(Math.random() * 240) - 120}px
          ) scale(.3)`;

        particle.style.opacity =
          "0";

      });


      setTimeout(() => {

        particle.remove();

      }, 1500);

    }

  }


  /* ==========================================================
     6. ENTER MAIN INVITATION
     ========================================================== */

  if (continueButton) {

    continueButton.addEventListener(
      "click",
      () => {

        if (!opening) return;

        /*
         * Fade the entire opening away
         */
        opening.classList.add(
          "opening-complete"
        );

        opening.style.transition =
          "opacity 1s ease";

        opening.style.opacity =
          "0";

        opening.style.pointerEvents =
          "none";


        /*
         * Remove opening screen
         */
        setTimeout(() => {

          opening.remove();

          document.body.classList.add(
            "invitation-revealed"
          );

          /*
           * Start at top of invitation
           */
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

        }, 1000);

      }
    );

  }


  /* ==========================================================
     7. LANGUAGE TOGGLE
     ========================================================== */

  const langToggle =
    document.getElementById(
      "langToggle"
    );

  if (langToggle) {

    langToggle.addEventListener(
      "click",
      () => {

        const body =
          document.body;

        const isPunjabi =
          body.classList.contains(
            "lang-pa"
          );

        body.classList.toggle(
          "lang-pa",
          !isPunjabi
        );

        body.classList.toggle(
          "lang-en",
          isPunjabi
        );


        /*
         * Update all i18n elements
         */
        document
          .querySelectorAll(".i18n")
          .forEach(element => {

            if (
              isPunjabi
            ) {

              if (
                element.dataset.en
              ) {

                element.textContent =
                  element.dataset.en;

              }

            } else {

              if (
                element.dataset.pa
              ) {

                element.textContent =
                  element.dataset.pa;

              }

            }

          });

      }
    );

  }


  /* ==========================================================
     8. MUSIC
     ========================================================== */

  const musicToggle =
    document.getElementById(
      "musicToggle"
    );

  const shabadAudio =
    document.getElementById(
      "shabadAudio"
    );


  if (
    musicToggle &&
    shabadAudio
  ) {

    musicToggle.addEventListener(
      "click",
      async () => {

        try {

          if (
            shabadAudio.paused
          ) {

            await shabadAudio.play();

            musicToggle.dataset.playing =
              "true";

            musicToggle.setAttribute(
              "aria-pressed",
              "true"
            );

          } else {

            shabadAudio.pause();

            musicToggle.dataset.playing =
              "false";

            musicToggle.setAttribute(
              "aria-pressed",
              "false"
            );

          }

        } catch (error) {

          console.log(
            "Audio could not be played:",
            error
          );

        }

      }
    );

  }


  /* ==========================================================
     9. EVENT TABS
     ========================================================== */

  const eventTabs =
    document.querySelectorAll(
      ".event-tab"
    );

  const eventPanels =
    document.querySelectorAll(
      ".event-panel"
    );


  eventTabs.forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        const target =
          tab.dataset.tab;

        /*
         * Update buttons
         */
        eventTabs.forEach(
          item => {

            item.classList.toggle(
              "active",
              item === tab
            );

            item.setAttribute(
              "aria-selected",
              item === tab
                ? "true"
                : "false"
            );

          }
        );


        /*
         * Update panels
         */
        eventPanels.forEach(
          panel => {

            const active =
              panel.id ===
              `panel-${target}`;

            panel.classList.toggle(
              "active",
              active
            );

            panel.hidden =
              !active;

          }
        );

      }
    );

  });


  /* ==========================================================
     10. COUNTDOWN
     ========================================================== */

  const countdownGrid =
    document.getElementById(
      "countdownGrid"
    );


  if (countdownGrid) {

    const target =
      new Date(
        countdownGrid.dataset.target
      );


    const daysElement =
      document.getElementById(
        "cdDays"
      );

    const hoursElement =
      document.getElementById(
        "cdHours"
      );

    const minutesElement =
      document.getElementById(
        "cdMinutes"
      );

    const secondsElement =
      document.getElementById(
        "cdSeconds"
      );


    function updateCountdown() {

      const now =
        new Date();

      let difference =
        target.getTime() -
        now.getTime();


      if (difference < 0) {

        difference = 0;

      }


      const second =
        1000;

      const minute =
        second * 60;

      const hour =
        minute * 60;

      const day =
        hour * 24;


      const days =
        Math.floor(
          difference / day
        );

      const hours =
        Math.floor(
          (difference % day) / hour
        );

      const minutes =
        Math.floor(
          (difference % hour) / minute
        );

      const seconds =
        Math.floor(
          (difference % minute) / second
        );


      if (daysElement) {

        daysElement.textContent =
          String(days).padStart(
            2,
            "0"
          );

      }

      if (hoursElement) {

        hoursElement.textContent =
          String(hours).padStart(
            2,
            "0"
          );

      }

      if (minutesElement) {

        minutesElement.textContent =
          String(minutes).padStart(
            2,
            "0"
          );

      }

      if (secondsElement) {

        secondsElement.textContent =
          String(seconds).padStart(
            2,
            "0"
          );

      }

    }


    updateCountdown();

    setInterval(
      updateCountdown,
      1000
    );

  }


  /* ==========================================================
     11. MOBILE MENU
     ========================================================== */

  const navBurger =
    document.getElementById(
      "navBurger"
    );

  const navLinks =
    document.getElementById(
      "navLinks"
    );


  if (
    navBurger &&
    navLinks
  ) {

    navBurger.addEventListener(
      "click",
      () => {

        const open =
          navLinks.classList.toggle(
            "is-open"
          );

        navBurger.setAttribute(
          "aria-expanded",
          open
            ? "true"
            : "false"
        );

      }
    );


    navLinks
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener(
          "click",
          () => {

            navLinks.classList.remove(
              "is-open"
            );

            navBurger.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      });

  }


  /* ==========================================================
     12. CALENDAR FILE GENERATOR
     ========================================================== */

  document
    .querySelectorAll(
      "[data-ics]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const type =
            button.dataset.ics;

          let eventData;


          if (
            type === "shagun"
          ) {

            eventData = {

              title:
                "Danveer & Harman Preet — Shagun & Ring Ceremony",

              start:
                "20261023T183000",

              end:
                "20261023T213000",

              location:
                "Regenta Central Amritsar"

            };

          } else {

            eventData = {

              title:
                "Danveer & Harman Preet — Anand Karaj",

              start:
                "20261025T110000",

              end:
                "20261025T140000",

              location:
                "Sandoz Amritsar"

            };

          }


          const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Danveer & Harman Preet//Wedding Invitation//EN
BEGIN:VEVENT
UID:${Date.now()}@wedding-invite
DTSTAMP:${getICSDate(new Date())}
DTSTART:${eventData.start}
DTEND:${eventData.end}
SUMMARY:${eventData.title}
LOCATION:${eventData.location}
END:VEVENT
END:VCALENDAR`;


          const blob =
            new Blob(
              [ics],
              {
                type:
                  "text/calendar;charset=utf-8"
              }
            );


          const url =
            URL.createObjectURL(blob);

          const link =
            document.createElement(
              "a"
            );

          link.href =
            url;

          link.download =
            type === "shagun"
              ? "Shagun-Ceremony.ics"
              : "Anand-Karaj.ics";

          document.body.appendChild(
            link
          );

          link.click();

          link.remove();

          URL.revokeObjectURL(
            url
          );

        }
      );

    });


  /* ==========================================================
     13. ICS DATE FORMAT
     ========================================================== */

  function getICSDate(date) {

    return date
      .toISOString()
      .replace(
        /[-:]/g,
        ""
      )
      .replace(
        /\.\d{3}/,
        ""
      );

  }


  /* ==========================================================
     14. SCROLL REVEAL ANIMATIONS
     ========================================================== */

  const revealElements =
    document.querySelectorAll(
      ".glass-card, .section-title, .section-eyebrow"
    );


  if (
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "revealed"
                );

                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: .12
        }
      );


    revealElements.forEach(
      element => {

        observer.observe(
          element
        );

      }
    );

  }


  /* ==========================================================
     15. INITIAL LANGUAGE
     ========================================================== */

  if (
    !document.body.classList.contains(
      "lang-pa"
    ) &&
    !document.body.classList.contains(
      "lang-en"
    )
  ) {

    document.body.classList.add(
      "lang-pa"
    );

  }

});
