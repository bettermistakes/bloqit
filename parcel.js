
(() => {
  "use strict";

  // -----------------------------
  // Helpers
  // -----------------------------
  const raf2 = (cb) => requestAnimationFrame(() => requestAnimationFrame(cb));

  function waitFor(condition, callback, tries = 200, interval = 50) {
    let count = 0;
    const timer = setInterval(() => {
      count++;
      if (condition()) {
        clearInterval(timer);
        callback();
      } else if (count >= tries) {
        clearInterval(timer);
        console.warn("[Splide Team] Init aborted (timeout)");
      }
    }, interval);
  }

  // -----------------------------
  // Init Splide
  // -----------------------------
  function initTeamSplide() {
    const root = document.querySelector(".splide.is-team");
    if (!root) return false;

    if (root.dataset.splideMounted === "1") return true;

    if (typeof window.Splide === "undefined") return false;

    const track  = root.querySelector(".splide__track");
    const slides = root.querySelectorAll(".splide__slide");
    if (!track || !slides.length) return false;

    const splide = new window.Splide(root, {
      type: "loop",
      perPage: 3,
      perMove: 1,
      focus: "left",
      speed: 500,
      drag: true,
      gap: "4rem",
      autoplay: false,
      arrows: false,        // we use custom arrows
      pagination: true,
      rewind: false,
      keyboard: true,

      breakpoints: {
        991: { perPage: 1, gap: "1rem" },
        767: { perPage: 1, gap: "1rem" }
      }
    });

    splide.mount();
    root.dataset.splideMounted = "1";

    // -----------------------------
    // Bind YOUR arrows
    // -----------------------------
    const prev = root.querySelector(".splide__arrow--prev");
    const next = root.querySelector(".splide__arrow--next");

    if (prev) {
      prev.addEventListener("click", (e) => {
        e.preventDefault();
        splide.go("<");
      });
    }

    if (next) {
      next.addEventListener("click", (e) => {
        e.preventDefault();
        splide.go(">");
      });
    }

    console.log("[Splide Team] Mounted ✔");
    return true;
  }

  // -----------------------------
  // Boot
  // -----------------------------
  waitFor(
    () =>
      document.querySelector(".splide.is-team") &&
      typeof window.Splide !== "undefined",
    () => raf2(() => initTeamSplide())
  );

})();

