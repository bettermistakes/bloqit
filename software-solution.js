(() => {
  const onReady = (cb) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb);
    else cb();
  };

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
      return $(this).attr(attr, val1);
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
  // CounterUp (.counterfast)
  // =========================
  function initCounterFast() {
    if (!window.jQuery) return;
    const $ = window.jQuery;
    if (typeof $.fn.counterUp !== "function") return;

    // FIX: tes options "delai/duree" => counterUp attend delay/time
    $(".counterfast").counterUp({ delay: 5, time: 2000 });
    $(".counterfast").addClass("anime animated fadeInDownBig");
    $("h3").addClass("anime animated fadeIn");
  }

  // =========================
  // Splide Slider: .splide.is-eco
  // =========================
  function initSplideEco() {
    if (typeof window.Splide === "undefined") return;
    const el = document.querySelector(".splide.is-eco");
    if (!el) return;

    const splide = new window.Splide(".splide.is-eco", {
      type: "slider",
      perPage: 2,
      perMove: 4,
      focus: "left",
      speed: 500,
      drag: true,
      gap: "1.5rem",
      autoplay: false,
      interval: 2000,
      arrows: true,
      pauseOnHover: true,
      keyboard: true,
      rewind: false,
      pagination: false,
      reducedMotion: { speed: 0, rewindSpeed: 0 },
      breakpoints: {
        991: { perPage: 1, perMove: 1, gap: "1.5rem" },
        767: { perPage: 1, perMove: 1, gap: "1.5rem" },
      },
    });

    splide.mount();
  }

  // =====================================================
  // Buttons -> Webflow slider dots (core / adv)
  // =====================================================
  function initCoreAdvButtonsToDots() {
    const coreButton = document.querySelector(".core-button");
    const advButton = document.querySelector(".adv-button");
    if (!coreButton && !advButton) return;

    const maxTries = 50; // ~10s (50*200ms)
    let tries = 0;

    const t = setInterval(() => {
      tries++;
      const dots = document.querySelectorAll(".software_slides-wrapper .w-slider-dot");

      if (dots.length >= 6) {
        clearInterval(t);

        coreButton?.addEventListener("click", (e) => {
          e.preventDefault();
          dots[0].click();
        });

        advButton?.addEventListener("click", (e) => {
          e.preventDefault();
          dots[5].click();
        });
      }

      if (tries >= maxTries) clearInterval(t);
    }, 200);
  }

  // =========================
  // Toggle checkboxes -> add .checked on .toggle
  // =========================
  function initToggleCheckedClass() {
    const checkboxes = document.querySelectorAll('.toggle input[type="checkbox"]');
    if (!checkboxes.length) return;

    checkboxes.forEach((checkbox) => {
      const toggle = checkbox.closest(".toggle");
      if (!toggle) return;

      const sync = () => toggle.classList.toggle("checked", checkbox.checked);
      sync();
      checkbox.addEventListener("change", sync);
    });
  }

  // =========================
  // Toggle images visibility based on number of checked toggles
  // =========================
  function initToggleImagesByCount() {
    const checkboxes = document.querySelectorAll('.toggle input[type="checkbox"]');
    const images = document.querySelectorAll(".image-toogle");
    if (!checkboxes.length || !images.length) return;

    function updateImageVisibility() {
      const activeCount = Array.from(checkboxes).filter((cb) => cb.checked).length;
      let targetToggle = "";

      if (activeCount === 0 || activeCount === 1) targetToggle = "0-1";
      else if (activeCount === 2) targetToggle = "2";
      else if (activeCount === 3 || activeCount === 4) targetToggle = "3-4";
      else if (activeCount === 5 || activeCount === 7) targetToggle = "5";
      else if (activeCount === 6) targetToggle = "6";

      images.forEach((img) => {
        img.style.opacity = img.getAttribute("toggle") === targetToggle ? "1" : "0";
      });
    }

    checkboxes.forEach((cb) => cb.addEventListener("change", updateImageVisibility));
    updateImageVisibility();
  }

  // =========================
  // Hover expand: .card-eco .wrapper
  // =========================
  function initEcoCardHoverExpand() {
    const cards = document.querySelectorAll(".card-eco");
    if (!cards.length) return;

    cards.forEach((card) => {
      const wrapper = card.querySelector(".wrapper");
      if (!wrapper) return;

      wrapper.style.overflow = "hidden";
      wrapper.style.height = "0px";
      wrapper.style.opacity = "0";
      wrapper.style.transition = "height 0.6s ease, opacity 0.6s ease";

      card.addEventListener("mouseenter", () => {
        const scrollHeight = wrapper.scrollHeight;
        wrapper.style.height = scrollHeight + "px";
        wrapper.style.opacity = "1";
      });

      card.addEventListener("mouseleave", () => {
        wrapper.style.height = "0px";
        wrapper.style.opacity = "0";
      });
    });
  }

  // =========================
  // Click to toggle "clicked" on eco slides
  // =========================
  function initEcoSlidesClickToggle() {
    const slides = document.querySelectorAll(".splide__slide.is-eco");
    if (!slides.length) return;

    slides.forEach((slide) => {
      slide.addEventListener("click", () => {
        const isClicked = slide.classList.contains("clicked");

        slides.forEach((s) => {
          s.classList.remove("clicked");
          s.querySelector(".card-eco")?.classList.remove("clicked");
          s.querySelector(".card-eco-back")?.classList.remove("clicked");
        });

        if (!isClicked) {
          slide.classList.add("clicked");
          slide.querySelector(".card-eco")?.classList.add("clicked");
          slide.querySelector(".card-eco-back")?.classList.add("clicked");
        }
      });
    });
  }

  // =========================
  // BOOT
  // =========================
  onReady(() => {
    initSplideEco();
    initFaqA11y();
    initCoreAdvButtonsToDots();
    initCounterFast();
    initToggleCheckedClass();
    initToggleImagesByCount();
    initEcoCardHoverExpand();
    initEcoSlidesClickToggle();
  });
})();
