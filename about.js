(() => {

  // =========================
  // Slider 1: Accomplish + Progress
  // =========================
  function initSplideAccomplishProgress() {
    if (!window.Splide) return;

    const root = document.querySelector(".splide.is-accomplish");
    const progressBar = document.querySelector(".slider-progress-bar");
    if (!root || !progressBar) return;

    const splide = new Splide(".splide.is-accomplish", {
      type: "slider",
      perPage: 1,
      perMove: 1,
      focus: "start",
      speed: 500,
      gap: "1.5rem",
      autoplay: false,
      pauseOnHover: true,
      keyboard: true,
      rewind: false,
      reducedMotion: { speed: 0, rewindSpeed: 0 }
    }).mount();

    const total = splide.length || 1;
    progressBar.style.width = `${100 / total}%`;

    splide.on("move", () => {
      const i = splide.index || 0;
      progressBar.style.width = `${((i + 1) / total) * 100}%`;
    });
  }

  // =========================
  // Slider 2: Badges
  // =========================
  function initSplideBadges() {
    if (!window.Splide) return;

    if (!document.querySelector(".splide.is-badges")) return;

    new Splide(".splide.is-badges", {
      type: "loop",
      perPage: 1,
      speed: 500,
      gap: "9.375rem",
      keyboard: true
    }).mount();
  }

  // =========================
  // CounterUp
  // =========================
  function initCounters() {
    if (!window.jQuery || !jQuery.fn.counterUp) return;

    jQuery(".counter").counterUp({ delay: 10, time: 3000 });
    jQuery(".counterfast").counterUp({ delay: 1, time: 3000 });
  }

  // =========================
  // FAQ Accessibility
  // =========================
  function initFaq() {
    if (!window.jQuery) return;

    const $ = jQuery;

    $.fn.toggleAttrVal = function (a, v1, v2) {
      const v = this.attr(a);
      this.attr(a, v === v1 ? v2 : v1);
      return this;
    };

    $(".faq-container_item")
      .on("keydown", function (e) {
        if (e.which !== 13 && e.which !== 32) return;
        e.preventDefault();
        this.click();
      })
      .on("click touchend", function () {
        $(this).toggleAttrVal("aria-expanded", "false", "true");
        $(this)
          .parent()
          .find(".faq-answer")
          .toggleAttrVal("aria-hidden", "true", "false");
      });
  }

  // =========================
  // INIT GLOBAL
  // =========================
  initSplideAccomplishProgress();
  initSplideBadges();
  initCounters();
  initFaq();

})();
