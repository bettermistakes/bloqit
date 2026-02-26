(() => {
  try {
    const el = document.querySelector(".splide.is-team");
    if (!window.Splide || !el) return;

    new Splide(el, {
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
      pagination: false,
      reducedMotion: { speed: 0, rewindSpeed: 0 },
      breakpoints: {
        991: { perPage: 1, gap: "1rem" },
        767: { perPage: 1, gap: "1rem" },
      },
    }).mount();
  } catch (e) {}
})();



// Target date: March 17, 2026 at 09:10 AM CET (UTC+1)
// CET = UTC+1 → so 09:10 CET = 08:10 UTC

const countdownDate = new Date(Date.UTC(2026, 2, 17, 8, 10, 0)).getTime();

const elDays  = document.getElementById("timer-days");
const elHours = document.getElementById("timer-hours");
const elMin   = document.getElementById("timer-min");
const elSec   = document.getElementById("timer-seconds");

const heading     = document.getElementById("heading-timer");
const timerParent = document.getElementById("timer-parent");

function updateTimer() {
  const now = Date.now();
  const distance = countdownDate - now;

  if (distance < 0) {
    if (heading) heading.textContent = "The event has started!";
    if (timerParent) timerParent.style.display = "none";
    if (elDays)  elDays.textContent  = "00";
    if (elHours) elHours.textContent = "00";
    if (elMin)   elMin.textContent   = "00";
    if (elSec)   elSec.textContent   = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  if (elDays)  elDays.textContent  = String(days).padStart(2, "0");
  if (elHours) elHours.textContent = String(hours).padStart(2, "0");
  if (elMin)   elMin.textContent   = String(minutes).padStart(2, "0");
  if (elSec)   elSec.textContent   = String(seconds).padStart(2, "0");
}

updateTimer();
setInterval(updateTimer, 1000);
