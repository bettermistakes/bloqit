
(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Helpers (no DOMContentLoaded)
  // ---------------------------------------------------------------------------
  function raf2(cb) {
    requestAnimationFrame(() => requestAnimationFrame(cb));
  }

  function mountWhenReady(fn, opts) {
    const tries = (opts && opts.tries) || 120;  // ~12s
    const every = (opts && opts.every) || 100;  // 100ms
    let n = 0;

    const t = setInterval(() => {
      n++;
      const ok = fn();
      if (ok || n >= tries) clearInterval(t);
    }, every);
  }

  // ---------------------------------------------------------------------------
  // 1) Splide Slider (.splide.is-team)
  // ---------------------------------------------------------------------------
  function initSplideTeam() {
    const root = document.querySelector(".splide.is-team");
    if (!root) return false;

    // avoid double init
    if (root.dataset.splideMounted === "1") return true;

    // wait until Splide is available + markup exists
    const hasSplide = typeof window.Splide !== "undefined";
    const hasMarkup =
      !!root.querySelector(".splide__track") &&
      !!root.querySelector(".splide__list") &&
      !!root.querySelector(".splide__slide");

    if (!hasSplide || !hasMarkup) return false;

    // Custom arrows in your HTML (divs)
    const prev = root.querySelector(".splide__arrow--prev");
    const next = root.querySelector(".splide__arrow--next");

    const splide = new window.Splide(root, {
      type: "loop",
      perPage: 3,
      perMove: 1,
      focus: "left",
      speed: 500,
      drag: true,          // you can switch back to false if you want
      gap: "4rem",
      autoplay: false,
      interval: 2000,

      // IMPORTANT: don't rely on Splide's default arrows (HTML doesn't match)
      arrows: false,
      pagination: true,

      pauseOnHover: true,
      keyboard: true,
      rewind: false,

      reducedMotion: {
        speed: 0,
        rewindSpeed: 0,
      },

      breakpoints: {
        991: { perPage: 1, gap: "1rem" },
        767: { perPage: 1, gap: "1rem" },
      },
    });

    splide.mount();
    root.dataset.splideMounted = "1";

    // Bind your custom arrows (no HTML changes)
    if (prev && !prev.dataset.bound) {
      prev.addEventListener("click", (e) => {
        e.preventDefault();
        splide.go("<");
      });
      prev.dataset.bound = "1";
    }

    if (next && !next.dataset.bound) {
      next.addEventListener("click", (e) => {
        e.preventDefault();
        splide.go(">");
      });
      next.dataset.bound = "1";
    }

    return true;
  }

  // ---------------------------------------------------------------------------
  // 2) Pane-arrow → next tab (kept from your pattern)
  // ---------------------------------------------------------------------------
  function initPaneArrows() {
    const paneArrows = document.querySelectorAll(".pane-arrow");
    if (!paneArrows.length) return;

    paneArrows.forEach((arrow) => {
      if (arrow.dataset.bound === "1") return;

      arrow.addEventListener("click", () => {
        const currentTab = document.querySelector(".rotation-tabs-menu .w--current");
        if (!currentTab) return;

        const nextTab = currentTab.nextElementSibling;
        if (nextTab && typeof nextTab.click === "function") nextTab.click();
      });

      arrow.dataset.bound = "1";
    });
  }

  // ---------------------------------------------------------------------------
  // 3) Rotating tabs → scroll active tab into view (mobile) (kept)
  // ---------------------------------------------------------------------------
  function initRotatingTabsScroll() {
    const rotatingTabs = document.querySelector(".rotation-tabs");
    const menu = document.querySelector(".rotation-tabs-menu");
    if (!rotatingTabs || !menu) return;

    if (rotatingTabs.dataset.bound === "1") return;

    function scrollToActiveTab() {
      const activeTabLink = document.querySelector(".rotating-tab-link.w--current");
      if (!activeTabLink) return;

      const activeTabRect = activeTabLink.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const scrollAmount = activeTabRect.left - menuRect.left + menu.scrollLeft;

      menu.scrollTo({
        left: Math.max(0, scrollAmount),
        behavior: "smooth",
      });
    }

    rotatingTabs.addEventListener("click", () => raf2(scrollToActiveTab));
    raf2(scrollToActiveTab);

    rotatingTabs.dataset.bound = "1";
  }

  // ---------------------------------------------------------------------------
  // Boot (no DOMContentLoaded)
  // ---------------------------------------------------------------------------
  mountWhenReady(initSplideTeam, { tries: 160, every: 100 });
  initPaneArrows();
  initRotatingTabsScroll();
})();

