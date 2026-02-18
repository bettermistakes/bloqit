// =========================
// Splide: Team slider (.splide.is-team)
// =========================
function initSplideTeam() {
  if (typeof window.Splide === "undefined") return;

  const el = document.querySelector(".splide.is-team");
  if (!el) return;

  const splide = new window.Splide(".splide.is-team", {
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
}
