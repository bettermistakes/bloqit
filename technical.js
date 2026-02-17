(() => {
  const onReady = (cb) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb);
    else cb();
  };

  // =========================
  // Splide: .splide.is-tablet
  // =========================
  function initSplideTablet() {
    if (typeof window.Splide === "undefined") return;
    const el = document.querySelector(".splide.is-tablet");
    if (!el) return;

    const splide = new window.Splide(".splide.is-tablet", {
      type: "loop",
      perPage: 1,
      perMove: 1,
      focus: "center",
      speed: 500,
      drag: true,
      gap: "1.5rem",
      autoplay: false,
      interval: 2000,
      pauseOnHover: true,
      keyboard: true,
      rewind: false,
      pagination: "slider",
      reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: "pause" },
      breakpoints: {
        991: { perPage: 1 },
        767: { perPage: 1 },
      },
    });

    splide.mount();
  }

  // =========================
  // CounterUp (.counterfast) - version "anime/delai/duree"
  // =========================
  function initCounterFastAnime() {
    if (!window.jQuery) return;
    const $ = window.jQuery;
    if (typeof $.fn.counterUp !== "function") return;

    // ⚠️ ton snippet utilisait delai/duree (typos) → counterUp attend delay/time
    // On garde ton intention: très rapide + 3s
    $(".counterfast").counterUp({ delay: 1, time: 3000 });
    $(".counterfast").addClass("anime fadeInDownBig");
    $("h3").addClass("anime fadeIn");
  }

  // =========================
  // FAQ Accessibility (jQuery)
  // =========================
  function initFaqA11y() {
    if (!window.jQuery) return;
    const $ = window.jQuery;

    const $items = $(".faq-container_item");
    if (!$items.length) return;

    $.fn.toggleAttrVal = function (attr, val1, val2) {
      const test = $(this).attr(attr);
      if (test === val1) return $(this).attr(attr, val2);
      if (test === val2) return $(this).attr(attr, val1);
      $(this).attr(attr, val1);
      return this;
    };

    $items.off(".faqA11y").on("keydown.faqA11y", function (e) {
      if (e.which !== 13 && e.which !== 32) return;
      e.preventDefault();

      const evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      $(this).get(0).dispatchEvent(evt);
    });

    $items.off(".faqAria").on("click.faqAria touchend.faqAria", function () {
      $(this).toggleAttrVal("aria-expanded", "false", "true");
      $(this).parent().find(".faq-answer").toggleAttrVal("aria-hidden", "true", "false");
    });
  }

  // =========================
  // Random numbers
  // =========================
  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function animateFloat(el, min, max, duration = 1500, decimals = 1, suffix = "") {
    const target = parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    const steps = Math.ceil(duration / 16);
    const start = min;
    let count = 0;

    const interval = setInterval(() => {
      count++;
      const progress = count / steps;
      const value = start + (target - start) * easeOutQuad(progress);
      el.textContent = `${value.toFixed(decimals).replace(".", ",")} ${suffix}`.trim();

      if (progress >= 1) {
        clearInterval(interval);
        el.textContent = `${target.toFixed(decimals).replace(".", ",")} ${suffix}`.trim();
      }
    }, 16);
  }

  function animateInt(el, min, max, duration = 1500, suffix = "") {
    const target = Math.floor(Math.random() * (max - min + 1)) + min;
    const steps = Math.ceil(duration / 16);
    const start = min;
    let count = 0;

    const interval = setInterval(() => {
      count++;
      const progress = count / steps;
      const value = Math.round(start + (target - start) * easeOutQuad(progress));
      el.textContent = `${value} ${suffix}`.trim();

      if (progress >= 1) {
        clearInterval(interval);
        el.textContent = `${target} ${suffix}`.trim();
      }
    }, 16);
  }

  function initRandomNumbers() {
    const el1 = document.querySelector(".random-number-1"); // ex: 13,8
    const el2 = document.querySelector(".random-number-2"); // ex: 99,0
    const el3 = document.querySelector(".random-number-3"); // ex: 28

    if (el1) animateFloat(el1, 10, 15, 1500, 1);
    if (el2) animateFloat(el2, 97, 99, 1500, 1);
    if (el3) animateInt(el3, 28, 30, 1500);
  }

  // =========================
  // BOOT
  // =========================
  onReady(() => {
    initSplideTablet();
    initCounterFastAnime();
    initFaqA11y();
    initRandomNumbers();
  });
})();
