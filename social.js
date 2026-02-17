// =========================
// SociableKit Widgets Loader
// =========================

function loadYouTubeScript() {
  if (document.querySelector('script[src*="youtube-channel-videos"]')) return;

  const script = document.createElement("script");
  script.src = "https://widgets.sociablekit.com/youtube-channel-videos/widget.js";
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

function loadLinkedInScript() {
  if (document.querySelector('script[src*="linkedin-page-posts"]')) return;

  const script = document.createElement("script");
  script.src = "https://widgets.sociablekit.com/linkedin-page-posts/widget.js";
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}
