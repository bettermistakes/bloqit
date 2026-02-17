(() => {
  const onReady = (cb) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb);
    else cb();
  };

  // ---------------------------
  // 1) CounterUp (.counterfast)
  // ---------------------------
  function initCounterFast() {
    if (!window.jQuery) return;
    const $ = window.jQuery;
    if (typeof $.fn.counterUp !== "function") return;

    $(".counterfast").counterUp({ delay: 5, time: 2000 });
    $(".counterfast").addClass("animated fadeInDownBig");
    $("h3").addClass("animated fadeIn");
  }

  // ---------------------------
  // 2) Splide Slider: .splide.is-tablet
  // ---------------------------
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
      pagination: true, // FIX: was "slider"
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

  // ---------------------------
  // 4) Tabs 1 (partner--tabs) + timer (.timer-tab)
  // ---------------------------
  function initPartnerTabsTimer() {
    const tabContainer = document.querySelector(".partner--tabs");
    const tabMenu = document.querySelector(".tabs-menu-partner");
    const tabLinks = Array.from(document.querySelectorAll(".partner-tab-lik"));
    if (!tabContainer || !tabLinks.length) return;

    const delay = 10000;
    let currentIndex = Math.max(0, tabLinks.findIndex((t) => t.classList.contains("w--current")));
    let autoplayTimer = null;
    let isActive = false;
    let isInternalSwitch = false;

    function startTimer(tab) {
      const timer = tab.querySelector(".timer-tab");
      if (!timer) return;
      timer.style.transition = "none";
      timer.style.width = "0%";
      // reflow
      void timer.offsetWidth;
      timer.style.transition = `width ${delay}ms linear`;
      timer.style.width = "100%";
    }

    function stopAllTimers() {
      tabLinks.forEach((link) => {
        const timer = link.querySelector(".timer-tab");
        if (!timer) return;
        timer.style.transition = "none";
        timer.style.width = "0%";
      });
    }

    function goToTab(index) {
      if (!tabLinks[index]) return;
      isInternalSwitch = true;

      // click Webflow tab
      tabLinks[index].click();

      stopAllTimers();
      startTimer(tabLinks[index]);
      currentIndex = index;

      // release guard next tick
      setTimeout(() => {
        isInternalSwitch = false;
      }, 0);
    }

    function nextTab() {
      const nextIndex = (currentIndex + 1) % tabLinks.length;
      goToTab(nextIndex);
    }

    function startAutoplay() {
      if (!isActive) return;
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(nextTab, delay);
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    // Manual click
    tabLinks.forEach((tab, index) => {
      tab.addEventListener("click", (e) => {
        if (!isInternalSwitch) e.preventDefault();
        goToTab(index);
        startAutoplay();
      });
    });

    // Autoplay only when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isActive = true;
            goToTab(currentIndex);
            startAutoplay();
          } else {
            isActive = false;
            stopAutoplay();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(tabContainer);

    // ---------------------------
    // 4b) Scroll active tab into view (mobile)
    // ---------------------------
    if (!tabMenu) return;

    function scrollActiveTabIntoView() {
      const activeTab = tabMenu.querySelector(".partner-tab-lik.w--current");
      if (activeTab && window.innerWidth < 992) {
        activeTab.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
      }
    }

    const mo = new MutationObserver((mutationsList) => {
      for (const m of mutationsList) {
        if (
          m.type === "attributes" &&
          m.attributeName === "class" &&
          m.target.classList.contains("w--current")
        ) {
          scrollActiveTabIntoView();
        }
      }
    });

    tabLinks.forEach((tab) => mo.observe(tab, { attributes: true }));
    scrollActiveTabIntoView();
  }

  // ---------------------------
  // 5) Tabs 2 (layout28_tabs) + timer (.tab-timer-market)
  // ---------------------------
  function initMarketTabsTimer_SIMPLE() {
    const tabContainer = document.querySelector(".layout28_tabs");
    const tabLinks = Array.from(document.querySelectorAll(".layout28_tabs-link"));
    if (!tabContainer || !tabLinks.length) return;

    const delay = 7000;
    let currentIndex = Math.max(0, tabLinks.findIndex((t) => t.classList.contains("w--current")));
    let autoplayTimer = null;
    let isActive = false;
    let isInternalSwitch = false;

    function resetTimerBars() {
      tabLinks.forEach((link) => {
        const bar = link.querySelector(".tab-timer-market");
        if (!bar) return;
        bar.style.transition = "none";
        bar.style.transform = "scaleY(0)";
        // reflow so transition re-applies next time
        void bar.offsetHeight;
      });
    }

    function animateActiveTimer(index) {
      const bar = tabLinks[index]?.querySelector(".tab-timer-market");
      if (!bar) return;
      bar.style.transition = `transform ${delay}ms linear`;
      bar.style.transform = "scaleY(1)";
    }

    function updateActiveTextTab(index) {
      tabLinks.forEach((link, i) => {
        const textTab = link.querySelector(".text-tab");
        if (textTab) textTab.classList.toggle("is-active", i === index);
      });
    }

    function goToTab(index) {
      if (!tabLinks[index]) return;
      isInternalSwitch = true;

      tabLinks[index].click();
      currentIndex = index;

      resetTimerBars();
      animateActiveTimer(index);
      updateActiveTextTab(index);

      setTimeout(() => {
        isInternalSwitch = false;
      }, 0);
    }

    function nextTab() {
      goToTab((currentIndex + 1) % tabLinks.length);
    }

    function startAutoplay() {
      if (!isActive) return;
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(nextTab, delay);
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    tabLinks.forEach((tab, index) => {
      tab.addEventListener("click", (e) => {
        if (!isInternalSwitch) e.preventDefault();
        goToTab(index);
        startAutoplay();
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isActive = true;
            goToTab(currentIndex || 0);
            startAutoplay();
          } else {
            isActive = false;
            stopAutoplay();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(tabContainer);
  }

  // ---------------------------
  // Boot
  // ---------------------------
  onReady(() => {
    initCounterFast();
    initSplideTablet();
    initFaqA11y();
    initPartnerTabsTimer();
    initMarketTabsTimer_SIMPLE();
  });
})();
