(() => {
  const onReady = (cb) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb);
    else cb();
  };

  // =========================
  // CounterUp (.counterfast)
  // =========================
  function initCounterFast() {
    if (!window.jQuery) return;
    const $ = window.jQuery;
    if (typeof $.fn.counterUp !== "function") return;

    $(".counterfast").counterUp({ delay: 5, time: 2000 });
    $(".counterfast").addClass("animated fadeInDownBig");
    $("h3").addClass("animated fadeIn");
  }

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
  // BOOT
  // =========================
  onReady(() => {
    initCounterFast();
    initSplideTablet();
    initFaqA11y();
  });
})();
