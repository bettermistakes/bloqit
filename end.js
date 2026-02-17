(() => {
  const onReady = (cb) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb);
    else cb();
  };

  // ---------------------------
  // 1) Splide Slider 1: .splide.is-accomplish + progress bar
  // ---------------------------
  function initSplideAccomplish() {
    if (typeof window.Splide === "undefined") return;

    const root = document.querySelector(".splide.is-accomplish");
    if (!root) return;

    const progressBar = document.querySelector(".slider-progress-bar");

    // NOTE: fixes from your code:
    // - focus "loope" => invalid, replaced by "center" (safe default)
    // - totalSlides => use splide.length or splide.Components.Slides.getLength()
    const splide = new window.Splide(".splide.is-accomplish", {
      type: "slider",
      perPage: 1,
      perMove: 1,
      focus: "center",
      speed: 500,
      gap: "1.5rem",
      rewind: false,
      autoplay: false,
      interval: 2000,
      pauseOnHover: true,
      keyboard: true,
      reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: "pause" },
      breakpoints: {
        991: { perPage: 1 },
        767: { perPage: 1 },
      },
    });

    splide.mount();

    if (!progressBar) return;

    const totalSlides =
      typeof splide.length === "number"
        ? splide.length
        : splide?.Components?.Slides?.getLength?.() || 0;

    if (!totalSlides) return;

    const setProgress = (index) => {
      const width = ((index + 1) / totalSlides) * 100;
      progressBar.style.width = `${width}%`;
    };

    // Init
    setProgress(splide.index || 0);

    // Update on move
    splide.on("move", () => setProgress(splide.index || 0));
  }

  // ---------------------------
  // 2) Splide Slider 2: .splide.is-badges
  // ---------------------------
  function initSplideBadges() {
    if (typeof window.Splide === "undefined") return;

    const root = document.querySelector(".splide.is-badges");
    if (!root) return;

    const splide = new window.Splide(".splide.is-badges", {
      type: "loop",
      perPage: 1,
      perMove: 1,
      focus: "start",
      speed: 500,
      gap: "9.375rem",
      autoplay: false,
      interval: 2000,
      pauseOnHover: true,
      keyboard: true,
      rewind: false,
      pagination: true, // your code had "slider" (invalid). Use true/false.
      reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: "pause" },
      breakpoints: {
        991: { perPage: 1 },
        767: { perPage: 1 },
      },
    });

    splide.mount();
  }

  // ---------------------------
  // 3) FAQ Accessibility (jQuery)
  // ---------------------------
  function initFaqA11y($) {
    const $items = $(".faq-container_item");
    if (!$items.length) return;

    // toggle attr helper
    $.fn.toggleAttrVal = function (attr, val1, val2) {
      const test = $(this).attr(attr);
      if (test === val1) return $(this).attr(attr, val2);
      if (test === val2) return $(this).attr(attr, val1);
      return $(this).attr(attr, val1);
    };

    $items.off(".faqA11y").on("keydown.faqA11y", function (e) {
      if (e.which !== 13 && e.which !== 32) return;
      e.preventDefault();

      // Simulate click (Webflow IX2)
      const evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      $(this).get(0).dispatchEvent(evt);
    });

    $items.off(".faqAria").on("click.faqAria touchend.faqAria", function () {
      $(this).toggleAttrVal("aria-expanded", "false", "true");
      $(this).parent().find(".faq-answer").toggleAttrVal("aria-hidden", "true", "false");
    });
  }

  // ---------------------------
  // 4) CounterUp (jQuery)
  // ---------------------------
  function initCounters($) {
    // Requires counterUp plugin loaded
    if (typeof $.fn.counterUp !== "function") return;

    // Normal speed
    $(".counter").counterUp({
      delay: 10,
      time: 3000,
    });

    // Your original classes (kept)
    $(".counter").addClass("animated fadeInDownBig");
    $("h3").addClass("animated fadeIn");

    // Fast speed (your original keys were misspelled: delai/duree)
    $(".counterfast").counterUp({
      delay: 1,
      time: 3000,
    });

    $(".counterfast").addClass("anime fadeInDownBig");
    $("h3").addClass("anime fadeIn");
  }

  // ---------------------------
  // Boot
  // ---------------------------
  onReady(() => {
    initSplideAccomplish();
    initSplideBadges();

    const hasJQ = typeof window.jQuery !== "undefined";
    if (hasJQ) {
      const $ = window.jQuery;
      initFaqA11y($);
      initCounters($);
    }
  });
})();
