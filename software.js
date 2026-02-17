(() => {
  // ----------------------------------------
  // Counter up animation (counterfast) #1
  // ----------------------------------------
  try {
    if (window.jQuery && jQuery.fn && jQuery.fn.counterUp) {
      jQuery(".counterfast").counterUp({
        delay: 5,
        time: 2000,
      });
      jQuery(".counterfast").addClass("animated fadeInDownBig");
      jQuery("h3").addClass("animated fadeIn");
    }
  } catch (e) {}

  // ----------------------------------------
  // Counter up animation (Fast) #2 (kept as-is)
  // ----------------------------------------
  try {
    if (window.jQuery && jQuery.fn && jQuery.fn.counterUp) {
      jQuery(".counterfast").counterUp({
        delai: 1,
        duree: 3000,
      });
      jQuery(".counterfast").addClass("anime fadeInDownBig");
      jQuery("h3").addClass("anime fadeIn");
    }
  } catch (e) {}

  // ----------------------------------------
  // FAQ Accessibility Script (no $(document).ready)
  // ----------------------------------------
  try {
    if (!window.jQuery) return;

    var accordionToggleButton = jQuery(".faq-container_item");

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
      if (e.type === "keydown" && e.which !== 13 && e.which !== 32) return;
      e.preventDefault();

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

  // ----------------------------------------
  // Tab 1 Script (partner tabs autoplay)
  // ----------------------------------------
  try {
    const tabContainer = document.querySelector(".partner--tabs");
    const tabLinks = Array.from(document.querySelectorAll(".partner-tab-lik"));
    const delay = 10000;

    if (tabLinks.length) {
      let currentIndex = 0;
      let autoplayTimer;
      let isActive = false;

      function startTimer(tab) {
        const timer = tab.querySelector(".timer-tab");
        if (!timer) return;
        timer.style.transition = "none";
        timer.style.width = "0%";
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
        tabLinks[index].click();
        stopAllTimers();
        startTimer(tabLinks[index]);
        currentIndex = index;
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

      tabLinks.forEach((tab, index) => {
        tab.addEventListener("click", (e) => {
          e.preventDefault();
          goToTab(index);
          startAutoplay();
        });
      });

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

      if (tabContainer) observer.observe(tabContainer);
    }
  } catch (e) {}

  // ----------------------------------------
  // Tab 2 Script (layout28 tabs autoplay + gsap text open/close)
  // ----------------------------------------
  try {
    const tabContainer = document.querySelector(".layout28_tabs");
    const tabLinks = document.querySelectorAll(".layout28_tabs-link");
    const delay = 7000;

    if (tabLinks.length && window.gsap) {
      let currentIndex = 0;
      let autoplayTimer;
      let isActive = false;

      function resetTimerBars() {
        tabLinks.forEach((link) => {
          const bar = link.querySelector(".tab-timer-market");
          if (!bar) return;
          bar.style.transition = "none";
          bar.style.transform = "scaleY(0)";
        });
      }

      function animateActiveTimer(index) {
        const activeTab = tabLinks[index];
        if (!activeTab) return;
        const bar = activeTab.querySelector(".tab-timer-market");
        if (!bar) return;
        bar.style.transition = `transform ${delay}ms linear`;
        bar.style.transform = "scaleY(1)";
      }

      function updateActiveTextTab(index) {
        const tabsToClose = [];
        let tabToOpen = null;
        let openTabHeight = 0;

        tabLinks.forEach((link, i) => {
          const textTab = link.querySelector(".text-tab");
          if (!textTab) return;

          gsap.killTweensOf(textTab);

          if (i === index) {
            tabToOpen = textTab;

            gsap.set(textTab, { height: "auto", visibility: "hidden", position: "absolute" });
            openTabHeight = textTab.offsetHeight;
            gsap.set(textTab, { height: 0, visibility: "", position: "", overflow: "hidden" });
          } else {
            tabsToClose.push(textTab);
          }
        });

        const tl = gsap.timeline();

        tabsToClose.forEach((tab) => {
          tl.to(
            tab,
            {
              height: 0,
              duration: 0.35,
              ease: "power2.inOut",
              overwrite: true,
              onStart: () => gsap.set(tab, { overflow: "hidden" }),
            },
            0
          );
        });

        if (tabToOpen) {
          tl.to(
            tabToOpen,
            {
              height: openTabHeight,
              duration: 0.35,
              ease: "power2.inOut",
              overwrite: true,
              onComplete: () => gsap.set(tabToOpen, { height: "auto" }),
            },
            0
          );
        }
      }

      function goToTab(index) {
        if (!tabLinks[index]) return;
        tabLinks[index].click();
        currentIndex = index;
        resetTimerBars();
        animateActiveTimer(index);
        updateActiveTextTab(index);
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

      tabLinks.forEach((tab, index) => {
        tab.addEventListener("click", (e) => {
          e.preventDefault();
          goToTab(index);
          startAutoplay();
        });
      });

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

      if (tabContainer) observer.observe(tabContainer);
    }
  } catch (e) {}

  // ----------------------------------------
  // Scroll active tab into view (mobile)
  // ----------------------------------------
  try {
    const tabMenu = document.querySelector(".tabs-menu-partner");
    if (!tabMenu) return;

    function scrollActiveTabIntoView() {
      const activeTab = tabMenu.querySelector(".partner-tab-lik.w--current");
      if (activeTab && window.innerWidth < 992) {
        activeTab.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
      }
    }

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          mutation.target.classList.contains("w--current")
        ) {
          scrollActiveTabIntoView();
        }
      }
    });

    tabMenu.querySelectorAll(".partner-tab-lik").forEach((tab) => {
      observer.observe(tab, { attributes: true });
    });

    scrollActiveTabIntoView();
  } catch (e) {}

  // ----------------------------------------
  // Infinite counter (startDate/startValue)
  // ----------------------------------------
  try {
    const counters = document.querySelectorAll(".stats30_counter-infinite");
    if (!counters.length) return;

    const startDate = new Date("2025-06-30T00:00:00Z");
    const startValue = 35001613;
    const incrementPerDay = 200000;

    function formatNumber(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    counters.forEach((counter) => {
      function updateCounter() {
        const now = new Date();
        const secondsElapsed = Math.floor((now - startDate) / 1000);
        const dailyRatePerSecond = incrementPerDay / (24 * 60 * 60);
        const totalIncrement = Math.floor(secondsElapsed * dailyRatePerSecond);
        counter.innerText = formatNumber(startValue + totalIncrement);
      }

      updateCounter();
      setInterval(updateCounter, 5000);
    });
  } catch (e) {}

  // ----------------------------------------
  // Anchor wrapper tabs (remove onReady + DOMContentLoaded fallback)
  // ----------------------------------------
  try {
    const wrappers = document.querySelectorAll(".anchor-wrapper");
    if (!wrappers.length) return;

    wrappers.forEach((wrapper, wrapperIdx) => {
      const triggers = Array.from(wrapper.children).filter((el) =>
        el.classList.contains("anchor-link")
      );

      const explicitSel = wrapper.getAttribute("data-tabs");
      let tabsContainer = explicitSel ? document.querySelector(explicitSel) : null;

      if (!tabsContainer) {
        const allTabs = Array.from(document.querySelectorAll(".anchor--tabs"));
        tabsContainer = allTabs.find((el) => el.closest(".anchor-wrapper") === wrapper) || null;
      }
      if (!tabsContainer) tabsContainer = wrapper.querySelector(".anchor--tabs");
      if (!triggers.length || !tabsContainer) return;

      const panels = Array.from(tabsContainer.children).filter((el) =>
        el.classList.contains("anchor--tab")
      );

      const count = Math.min(triggers.length, panels.length);
      if (!count) return;

      const DEFAULTS = [80000, 10000, 10000];
      const durations = triggers.slice(0, count).map((t, i) => {
        const v = parseInt(t.getAttribute("data-dwell"), 10);
        return Number.isFinite(v) ? v : DEFAULTS[i] ?? 10000;
      });

      wrapper.setAttribute("role", "tablist");

      panels.slice(0, count).forEach((p, i) => {
        p.setAttribute("role", "tabpanel");
        if (!p.id) p.id = `anchor-panel-${wrapperIdx + 1}-${i + 1}`;
        p.classList.remove("is-active");
      });

      triggers.slice(0, count).forEach((t, i) => {
        t.setAttribute("role", "tab");
        t.setAttribute("aria-controls", panels[i].id);
        t.setAttribute("aria-selected", "false");
        t.setAttribute("tabindex", "-1");
        if (t.tagName.toLowerCase() === "a") t.addEventListener("click", (e) => e.preventDefault());
      });

      let timer = null;
      let current = 0;

      function setContainerHeightTo(index) {
        const activePanel = panels[index];

        if (!activePanel.classList.contains("is-active")) {
          activePanel.style.position = "relative";
          activePanel.style.visibility = "hidden";
          activePanel.style.opacity = "0";
          activePanel.style.pointerEvents = "none";
          activePanel.classList.add("is-measuring");
          activePanel.style.display = "";
        }

        const h = activePanel.offsetHeight;
        tabsContainer.style.height = h + "px";

        tabsContainer.addEventListener("transitionend", function handler(e) {
          if (e.propertyName === "height") {
            tabsContainer.style.height = "auto";
            tabsContainer.removeEventListener("transitionend", handler);
          }
        });

        if (activePanel.classList.contains("is-measuring")) {
          activePanel.classList.remove("is-measuring");
          activePanel.style.removeProperty("position");
          activePanel.style.removeProperty("visibility");
          activePanel.style.removeProperty("opacity");
          activePanel.style.removeProperty("pointer-events");
        }
      }

      function applyActive(index) {
        triggers.slice(0, count).forEach((t, i) => {
          const active = i === index;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", active ? "true" : "false");
          t.setAttribute("tabindex", active ? "0" : "-1");
        });

        panels.slice(0, count).forEach((p, i) => p.classList.toggle("is-active", i === index));

        setContainerHeightTo(index);
        current = index;
      }

      function scheduleFrom(index) {
        clearTimeout(timer);
        applyActive(index);
        const dwell = durations[index] ?? 10000;
        timer = setTimeout(() => scheduleFrom((index + 1) % count), dwell);
      }

      wrapper.addEventListener("click", (e) => {
        const trigger = e.target.closest(".anchor-link");
        if (!trigger || !wrapper.contains(trigger)) return;
        const i = triggers.slice(0, count).indexOf(trigger);
        if (i === -1) return;
        scheduleFrom(i);
      });

      wrapper.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next = (current + dir + count) % count;
        scheduleFrom(next);
        triggers[next].focus();
      });

      wrapper.addEventListener("mouseenter", () => clearTimeout(timer));
      wrapper.addEventListener("mouseleave", () => {
        clearTimeout(timer);
        timer = setTimeout(() => scheduleFrom((current + 1) % count), durations[current] ?? 10000);
      });

      setContainerHeightTo(0);
      scheduleFrom(0);
    });
  } catch (e) {}
})();
