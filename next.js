
(() => {
  // ---------------------------
  // Helpers
  // ---------------------------
  const onReady = (cb) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb);
    else cb();
  };

  // ---------------------------
  // 1) POWER TABS (global, excluding .section-hardware-engineered) — FIXED
  // ---------------------------
  function initPowerTabsGlobal($) {
    const $containers = $(".power-container").filter(function () {
      return !$(this).closest(".section-hardware-engineered").length;
    });
    if (!$containers.length) return;

    $containers.each(function () {
      const $container = $(this);
      const $tabs = $container.find(".power-tab");
      const $states = $container.find(".power-state");
      if (!$tabs.length || !$states.length) return;

      const firstKey = $tabs.filter("#tab-1").length
        ? "tab-1"
        : ($tabs.first().attr("id") || "tab-1");

      let lastClickedKey = firstKey;
      let hoverRevertTimer = null;

      // Preload images
      $states.find("img, source").each(function () {
        const el = this;
        const src = el.currentSrc || el.src || el.getAttribute("srcset");
        if (!src) return;
        const url = typeof src === "string" ? src.split(" ")[0] : null;
        if (!url) return;
        const i = new Image();
        i.src = url;
      });

      const $state1 = $container.find(".power-state.is-1");
      const $state2 = $container.find(".power-state.is-2");

      function getTabByKey(key) {
        // strict scope: only inside this container
        try {
          return $tabs.filter("#" + CSS.escape(key)).first();
        } catch (e) {
          // fallback if CSS.escape not supported
          return $tabs.filter("#" + key.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g, "\\$1")).first();
        }
      }

      function showStateByKey(key) {
        const $tab = getTabByKey(key);
        if (!$tab.length) key = firstKey;

        // UI active
        $container.find(".power-tab, .power-title, .power-text").removeClass("active");
        const $activeTab = getTabByKey(key).addClass("active");
        $activeTab.find(".power-title, .power-text").addClass("active");

        // Visuals (no overlap)
        $states.stop(true, true).hide();
        if (key === "tab-1") $state1.stop(true, true).fadeIn(180);
        else $state2.stop(true, true).fadeIn(180);
      }

      // Click
      $tabs.off(".tabsGlobal").on("click.tabsGlobal", function () {
        const key = this.id || firstKey;
        lastClickedKey = key;
        clearTimeout(hoverRevertTimer);
        showStateByKey(key);
      });

      // Keyboard focus
      $tabs.off(".tabsGlobalFocus").on("focusin.tabsGlobalFocus", function () {
        clearTimeout(hoverRevertTimer);
        showStateByKey(this.id || firstKey);
      });

      // When leaving container via tabbing, revert to last clicked
      $container.off(".tabsGlobalOut").on("focusout.tabsGlobalOut", function (e) {
        if (!$container[0].contains(e.relatedTarget)) {
          clearTimeout(hoverRevertTimer);
          hoverRevertTimer = setTimeout(() => showStateByKey(lastClickedKey), 80);
        }
      });

      // Hover only desktop
      function bindHover(enable) {
        if (enable) {
          $tabs.off(".tabsGlobalHover").on("mouseenter.tabsGlobalHover", function () {
            clearTimeout(hoverRevertTimer);
            showStateByKey(this.id || firstKey);
          });
          $container.off(".tabsGlobalHoverLeave").on("mouseleave.tabsGlobalHoverLeave", function () {
            clearTimeout(hoverRevertTimer);
            hoverRevertTimer = setTimeout(() => showStateByKey(lastClickedKey), 80);
          });
        } else {
          $tabs.off(".tabsGlobalHover");
          $container.off(".tabsGlobalHoverLeave");
        }
      }

      const mq = window.matchMedia("(min-width: 992px)");
      bindHover(mq.matches);
      mq.addEventListener("change", (e) => bindHover(e.matches));

      // Init
      $states.hide();
      showStateByKey(lastClickedKey);
    });
  }

  // ---------------------------
  // 2) MARKET TABS TIMER
  // ---------------------------
  function initMarketTabsTimer() {
    const tabContainer = document.querySelector(".layout28_tabs");
    const tabLinks = Array.from(document.querySelectorAll(".layout28_tabs-link"));
    const panes = Array.from(document.querySelectorAll(".market-tab-pane"));
    if (!tabContainer || !tabLinks.length || !panes.length) return;

    const delay = 7000;
    let currentIndex = Math.max(0, tabLinks.findIndex((a) => a.classList.contains("w--current")));
    let autoplayTimer;
    let isActive = false;

    function resetTimerBars() {
      tabLinks.forEach((link) => {
        const bar = link.querySelector(".tab-timer-market");
        if (!bar) return;
        bar.style.transition = "none";
        bar.style.transform = "scaleY(0)";
        bar.offsetHeight; // reflow
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

    function switchTo(index) {
      if (!tabLinks[index] || !panes[index]) return;

      tabLinks.forEach((a, i) => {
        a.classList.toggle("w--current", i === index);
        a.setAttribute("aria-selected", i === index ? "true" : "false");
        a.tabIndex = i === index ? 0 : -1;
      });

      panes.forEach((p, i) => {
        const active = i === index;
        p.classList.toggle("w--tab-active", active);
        p.style.opacity = active ? "1" : "0";
        p.style.transition = "opacity 400ms";
        if (active) p.removeAttribute("hidden");
        else p.setAttribute("hidden", "hidden");
      });

      currentIndex = index;
      resetTimerBars();
      animateActiveTimer(index);
      updateActiveTextTab(index);
    }

    function nextTab() {
      switchTo((currentIndex + 1) % tabLinks.length);
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
        e.preventDefault();
        const { scrollX, scrollY } = window;
        switchTo(index);
        requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
        startAutoplay();
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isActive = true;
            switchTo(currentIndex || 0);
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
  // 3) SPLIDE SLIDER
  // ---------------------------
  function initSplide() {
    if (typeof window.Splide === "undefined") return;
    const el = document.querySelector(".splide.is-certif");
    if (!el) return;

    const splide = new window.Splide(".splide.is-certif", {
      type: "slider",
      perPage: 2,
      perMove: 1,
      focus: "left",
      speed: 500,
      drag: true,
      gap: "1.25rem",
      autoplay: false,
      interval: 2000,
      pauseOnHover: true,
      keyboard: true,
      rewind: false,
      pagination: false,
      reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: "pause" },
      breakpoints: {
        991: { gap: "1rem", perPage: 1 },
        767: { gap: "1rem", perPage: 1 },
      },
    });

    splide.mount();
  }

  // ---------------------------
  // 4) FAQ ACCESSIBILITY (needs jQuery)
  // ---------------------------
  function initFaqA11y($) {
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
  // 5) HARDWARE ENGINEERED (isolated tabs only)
  // ---------------------------
  function initHardwareEngineeredTabs($) {
    const $sections = $(".section-hardware-engineered");
    if (!$sections.length) return;

    $sections.each(function () {
      const $root = $(this);
      const $tabs = $root.find(".power-tab");
      const $container = $root.find(".power-container");
      const $states = $root.find(".power-state");
      const $state1 = $root.find(".power-state.is-1");
      const $state2 = $root.find(".power-state.is-2");

      if (!$tabs.length || !$container.length || !$states.length) return;

      const firstId = $tabs.filter("#tab-1").length ? "#tab-1" : "#" + ($tabs.first().attr("id") || "");
      let lastClickedTab = firstId || "#tab-1";
      let hoverRevertTimer = null;
      let hoverBound = false;

      function showStateById(id) {
        if (!id || !$root.find(id).length) id = firstId;

        $root.find(".power-tab, .power-title, .power-text").removeClass("active");
        const $tab = $root.find(id);
        $tab.addClass("active");
        $tab.find(".power-title, .power-text").addClass("active");

        $states.stop(true, true).fadeOut(220);
        if (id === "#tab-1") $state1.fadeIn(220);
        else $state2.fadeIn(220);
      }

      function ensureActive() {
        if (!$root.find(".power-tab.active").length) showStateById(lastClickedTab || firstId);
      }

      $tabs.off(".engineered").on("click.engineered", function () {
        const id = "#" + this.id;
        lastClickedTab = id;
        clearTimeout(hoverRevertTimer);
        showStateById(id);
      });

      $tabs.off(".engineeredFocus").on("focusin.engineeredFocus", function () {
        clearTimeout(hoverRevertTimer);
        showStateById("#" + this.id);
      });

      $container.off(".engineeredOut").on("focusout.engineeredOut", function (e) {
        if (!$container[0].contains(e.relatedTarget)) {
          clearTimeout(hoverRevertTimer);
          hoverRevertTimer = setTimeout(() => showStateById(lastClickedTab), 80);
        }
      });

      function toggleHoverBindings(enable) {
        if (enable && !hoverBound) {
          $tabs.on("mouseenter.engineeredHover", function () {
            clearTimeout(hoverRevertTimer);
            showStateById("#" + this.id);
          });
          $container.on("mouseleave.engineeredHover", function () {
            clearTimeout(hoverRevertTimer);
            hoverRevertTimer = setTimeout(() => showStateById(lastClickedTab), 80);
          });
          hoverBound = true;
        } else if (!enable && hoverBound) {
          $tabs.off(".engineeredHover");
          $container.off(".engineeredHover");
          hoverBound = false;
          ensureActive();
        }
      }

      const mq = window.matchMedia("(min-width: 992px)");
      toggleHoverBindings(mq.matches);
      mq.addEventListener("change", (e) => {
        toggleHoverBindings(e.matches);
        ensureActive();
      });

      showStateById(firstId);
    });
  }

  // ---------------------------
  // 6) HARDWARE VIDEO (autoplay muted + user Mute/Unmute)
  // ---------------------------
  function initHardwareVideos($) {
    const $wraps = $(".hardware-video_wrapper");
    if (!$wraps.length) return;

    $wraps.each(function (i) {
      const tag = `nv-video[${i + 1}]`;

      const $wrap = $(this);
      const $video = $wrap.find("video.nv-video");
      if (!$video.length) return;

      const video = $video[0];
      const $btn = $wrap.find(".controls-square");

      const $playUI = $wrap.find(".play-video, .play-text");
      const $pauseUI = $wrap.find(".pause-video, .pause-text");
      const $playText = $wrap.find(".play-text");
      const $pauseText = $wrap.find(".pause-text");
      const $playIcon = $wrap.find(".play-video");
      const $pauseIcon = $wrap.find(".pause-video");

      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.autoplay = false;

      // Start muted for reliable autoplay
      video.muted = true;
      video.setAttribute("muted", "");

      let userRequestedUnmute = false;

      $playText.text("Unmute");
      $pauseText.text("Mute");

      // Icons (optional)
      try {
        $playIcon.html(
          '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M4 10h3l5-4v12l-5-4H4z" fill="currentColor"></path>' +
            '<path d="M16 9c1 .8 1.5 1.8 1.5 3s-.5 2.2-1.5 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
            '<path d="M18.5 7c2 1.7 3 3.8 3 6s-1 4.3-3 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
          "</svg>"
        );
        $pauseIcon.html(
          '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M4 10h3l5-4v12l-5-4H4z" fill="currentColor"></path>' +
            '<path d="M16 8l6 6M22 8l-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
          "</svg>"
        );
      } catch (e) {}

      function setPlayStateUI(playing) {
        if (playing) $wrap.addClass("is-playing").removeClass("is-paused");
        else $wrap.removeClass("is-playing").addClass("is-paused");
      }

      function updateMuteUI(isMuted) {
        if (isMuted) {
          $pauseUI.hide();
          $playUI.css("display", "flex").show();
          $btn.attr("aria-label", "Unmute").attr("title", "Unmute");
        } else {
          $playUI.hide();
          $pauseUI.css("display", "flex").show();
          $btn.attr("aria-label", "Mute").attr("title", "Mute");
        }
      }

      video.addEventListener("volumechange", () => {
        console.log(`[NV] ${tag} volumechange → muted:`, video.muted);
        updateMuteUI(video.muted);
      });

      $btn.off(`click.nvMute${i}`).on(`click.nvMute${i}`, function () {
        try {
          video.muted = !video.muted;

          if (video.muted) {
            video.setAttribute("muted", "");
            userRequestedUnmute = false;
            console.log(`[NV] ${tag} MUTE (user)`);
          } else {
            video.removeAttribute("muted");
            userRequestedUnmute = true;
            console.log(`[NV] ${tag} UNMUTE (user)`);
          }

          updateMuteUI(video.muted);
          if (video.paused) video.play().catch(() => {});
        } catch (e) {
          console.warn(`[NV] ${tag} mute/unmute error`, e);
        }
      });

      video.addEventListener("play", () => setPlayStateUI(true));
      video.addEventListener("pause", () => setPlayStateUI(false));
      video.addEventListener("ended", () => setPlayStateUI(false));

      document.addEventListener("visibilitychange", () => {
        if (document.hidden && !video.paused) video.pause();
      });

      const tryPlayWithSound = async () => {
        video.muted = false;
        video.removeAttribute("muted");
        try {
          await video.play();
          console.log(`[NV] ${tag} play with sound`);
          return true;
        } catch (e) {
          console.warn(`[NV] ${tag} play with sound blocked`, e);
          return false;
        }
      };

      const tryPlayMuted = async () => {
        video.muted = true;
        video.setAttribute("muted", "");
        try {
          await video.play();
          console.log(`[NV] ${tag} autoplay muted`);
          return true;
        } catch (e) {
          console.warn(`[NV] ${tag} muted play failed`, e);
          return false;
        }
      };

      let firstAutoplayDone = false;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
              await new Promise((r) => setTimeout(r, 50));

              if (!firstAutoplayDone) {
                await tryPlayMuted();
                firstAutoplayDone = true;
                updateMuteUI(video.muted);
                return;
              }

              if (userRequestedUnmute) {
                const ok = await tryPlayWithSound();
                if (!ok) await tryPlayMuted();
              } else {
                await tryPlayMuted();
              }

              updateMuteUI(video.muted);
            } else {
              if (!video.paused) {
                video.pause();
                console.log(`[NV] ${tag} pause (out of view)`);
              }
            }
          });
        },
        { threshold: 0.25 }
      );

      io.observe($wrap[0]);

      setPlayStateUI(false);
      updateMuteUI(video.muted);
    });
  }

  // ---------------------------
  // Boot
  // ---------------------------
  onReady(() => {
    const hasJQ = typeof window.jQuery !== "undefined";
    const $ = hasJQ ? window.jQuery : null;

    if (hasJQ) {
      initPowerTabsGlobal($);
      initFaqA11y($);
      initHardwareEngineeredTabs($);
      initHardwareVideos($);
    }

    initMarketTabsTimer();
    initSplide();
  });
})();

