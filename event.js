(() => {
  try {
    const el = document.querySelector(".splide.is-team");
    if (!window.Splide || !el) return;

    new Splide(el, {
      type: "loop",
      perPage: 3,
      perMove: 1,
      focus: "center",
      speed: 500,
      drag: false,
      gap: "4rem",
      autoplay: false,
      interval: 2000,
      arrows: true,
      pauseOnHover: true,
      keyboard: true,
      rewind: false,
      pagination: false,
      reducedMotion: { speed: 0, rewindSpeed: 0 },
      breakpoints: {
        991: { perPage: 1, gap: "1rem" },
        767: { perPage: 1, gap: "1rem" },
      },
    }).mount();
  } catch (e) {}
})();