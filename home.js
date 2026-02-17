(() => {
  // -------------------------------
  // 1) Slider (Splide)
  // -------------------------------
  try {
    if (window.Splide && document.querySelector(".splide.is-team")) {
      var splide = new Splide(".splide.is-team", {
        type: "loop",
        perPage: 3,
        perMove: 1,
        focus: "left",
        speed: 500,
        drag: false,
        gap: "4rem",
        autoplay: false,
        interval: 2000,
        arrows: true,
        pauseOnHover: true,
        keyboard: true,
        rewind: false,
        pagination: true,

        reducedMotion: { speed: 0, rewindSpeed: 0 },

        breakpoints: {
          991: { perPage: 1, gap: "1rem" },
          767: { perPage: 1, gap: "1rem" },
        },
      });

      splide.mount();
    }
  } catch (e) {}

  // -------------------------------
  // 2) Play video on hover
  // -------------------------------
  try {
    const multimediaWrappers = document.querySelectorAll(".multimedia-wrapper");

    function playVideo(event) {
      const video = event.currentTarget.querySelector(".hardware-video video");
      if (!video) return;
      video.currentTime = 0;
      video.play();
    }

    function pauseVideo(event) {
      const video = event.currentTarget.querySelector(".hardware-video video");
      if (!video) return;
      video.pause();
      video.currentTime = 0;
    }

    multimediaWrappers.forEach((wrapper) => {
      wrapper.addEventListener("mouseover", playVideo);
      wrapper.addEventListener("mouseout", pauseVideo);
    });
  } catch (e) {}

  // -------------------------------
  // 3) Pane-arrow => next tab
  // -------------------------------
  try {
    const paneArrows = document.querySelectorAll(".pane-arrow");

    paneArrows.forEach((arrow) => {
      arrow.addEventListener("click", () => {
        const currentTab = document.querySelector(".rotation-tabs-menu .w--current");
        if (!currentTab) return;
        const nextTab = currentTab.nextElementSibling;
        if (nextTab) nextTab.click();
      });
    });
  } catch (e) {}

  // -------------------------------
  // 4) Rotating tabs: scroll active tab on click
  // -------------------------------
  try {
    const rotatingTabs = document.querySelector(".rotation-tabs");
    const menu = document.querySelector(".rotation-tabs-menu");

    if (rotatingTabs && menu) {
      const scrollToActiveTab = () => {
        const activeTabLink = document.querySelector(".rotating-tab-link.w--current");
        if (!activeTabLink) return;

        const activeTabRect = activeTabLink.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const scrollAmount = activeTabRect.left - menuRect.left + menu.scrollLeft;

        menu.scrollTo({ left: scrollAmount, behavior: "smooth" });
      };

      rotatingTabs.addEventListener("click", scrollToActiveTab);
    }
  } catch (e) {}

  // -------------------------------
  // 5) Percentage counters (.stats30_number-1) via IntersectionObserver
  // -------------------------------
  try {
    const counters = document.querySelectorAll(".stats30_number-1");

    counters.forEach((counter) => {
      const updateCounter = () => {
        const target = parseFloat(counter.getAttribute("data-count"));
        if (Number.isNaN(target)) return;

        let current = target * 0.5;
        const duration = 750;
        const stepDuration = 10;
        const totalSteps = duration / stepDuration;
        const increment = (target - current) / totalSteps;

        const step = () => {
          if (current < target) {
            current += increment;
            current = Math.min(current, target);
            counter.innerText = current.toFixed(1) + "%";

            setTimeout(() => {
              requestAnimationFrame(step);
            }, stepDuration);
          }
        };

        step();
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              updateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(counter);
    });
  } catch (e) {}

  // -------------------------------
  // 6) CounterUp (jQuery plugin)
  // -------------------------------
  try {
    if (window.jQuery && jQuery.fn && jQuery.fn.counterUp) {
      jQuery(".counter").counterUp({ delay: 10, time: 3000 });
      jQuery(".counter").addClass("animated fadeInDownBig");
      jQuery("h3").addClass("animated fadeIn");

      // Fast version (je garde tes keys telles qu'elles sont)
      jQuery(".counterfast").counterUp({ delai: 1, duree: 3000 });
      jQuery(".counterfast").addClass("anime fadeInDownBig");
      jQuery("h3").addClass("anime fadeIn");
    }
  } catch (e) {}

  // -------------------------------
  // 7) Infinite counter (.stats30_counter-infinite)
  // -------------------------------
  try {
    const counters = document.querySelectorAll(".stats30_counter-infinite");
    if (!counters.length) return;

    const BASE_AT_EPOCH = 101495448;
    const EPOCH_ISO = "2025-09-01T00:00:00Z";
    const INCREMENT_PER_DAY = 200000;
    const ANIM_MS = 1200;
    const RESPECT_RM = true;

    const epoch = new Date(EPOCH_ISO);
    const perSecond = INCREMENT_PER_DAY / 86400;

    const prefersReduced =
      RESPECT_RM &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const nowValue = () => {
      const elapsed = Math.max(0, (Date.now() - epoch.getTime()) / 1000);
      return Math.floor(BASE_AT_EPOCH + elapsed * perSecond);
    };

    function startLive(counter) {
      function update() {
        counter.innerText = fmt(nowValue());
      }
      update();
      setInterval(update, 5000);
    }

    function animateTo(counter, from, to, dur) {
      let start = null;
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      function frame(ts) {
        if (start === null) start = ts;
        const t = Math.min(1, (ts - start) / dur);
        const val = Math.floor(from + (to - from) * easeOutCubic(t));
        counter.innerText = fmt(val);

        if (t < 1) requestAnimationFrame(frame);
        else startLive(counter);
      }

      requestAnimationFrame(frame);
    }

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const el = entry.target;
              io.unobserve(el);

              const current = nowValue();

              if (prefersReduced) {
                el.innerText = fmt(current);
                startLive(el);
                return;
              }

              const approxBackfill = Math.floor((perSecond * ANIM_MS) / 1000 * 12);
              const from = Math.max(BASE_AT_EPOCH, current - approxBackfill);

              void el.offsetWidth;
              animateTo(el, from, current, ANIM_MS);
            });
          })
        : null;

    counters.forEach((el) => {
      if (io) io.observe(el);
      else {
        const current = nowValue();
        if (prefersReduced) {
          el.innerText = fmt(current);
          startLive(el);
        } else {
          void el.offsetWidth;
          animateTo(el, Math.max(BASE_AT_EPOCH, current - 5000), current, ANIM_MS);
        }
      }
    });
  } catch (e) {}
})();
