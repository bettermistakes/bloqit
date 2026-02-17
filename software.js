(() => {
  // ---------- Slider Script ----------
  try {
    if (window.Splide && document.querySelector(".splide.is-tablet")) {
      var splide = new Splide(".splide.is-tablet", {
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
        pagination: "slider", // "slider" or false

        reducedMotion: {
          speed: 0,
          rewindSpeed: 0,
          autoplay: "pause",
        },

        breakpoints: {
          991: { perPage: 1 },
          767: { perPage: 1 },
        },
      });

      splide.mount();
    }
  } catch (e) {}

  // ---------- FAQ Accessibility Script ----------
  try {
    if (!window.jQuery) return;

    var accordionToggleButton = jQuery(".faq-container_item");

    // jQuery toggle attribute helper (same logic)
    jQuery.fn.toggleAttrVal = function (attr, val1, val2) {
      var test = jQuery(this).attr(attr);
      if (test === val1) {
        jQuery(this).attr(attr, val2);
        return this;
      }
      if (test === val2) {
        jQuery(this).attr(attr, val1);
        return this;
      }
      jQuery(this).attr(attr, val1);
      return this;
    };

    accordionToggleButton.on("keydown", function (e) {
      // Activate on spacebar and enter
      if (e.type === "keydown" && e.which !== 13 && e.which !== 32) return;
      e.preventDefault();

      // Simulate a mouseclick to trigger Webflow's IX2/Interactions
      var evt = document.createEvent("MouseEvents");
      evt.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      jQuery(this).get(0).dispatchEvent(evt);
    });

    accordionToggleButton.on("click touchend", function () {
      jQuery(this).toggleAttrVal("aria-expanded", "false", "true");
      jQuery(this).parent().find(".faq-answer").toggleAttrVal("aria-hidden", "true", "false");
    });
  } catch (e) {}
})();
