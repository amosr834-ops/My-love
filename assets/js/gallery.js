"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const photos = Array.isArray(window.ourPhotos) ? window.ourPhotos : [];
  const emptyState = document.querySelector("#gallery-empty");
  const stage = document.querySelector(".slideshow-stage");
  const image = document.querySelector("#slideshow-image");
  const note = document.querySelector("#slideshow-note");
  const slideCount = document.querySelector("#slideshow-count");
  const toggleButton = document.querySelector("#slide-toggle");
  const slideshowHint = document.querySelector("#slideshow-hint");
  const previousButton = document.querySelector("#slide-prev");
  const nextButton = document.querySelector("#slide-next");
  const songPlayerMount = document.querySelector("#song-player");
  const toggleLabel = toggleButton?.querySelector(".slide-toggle-label");
  const toggleIcon = toggleButton?.querySelector("[aria-hidden='true']");

  if (!emptyState || !stage || !(image instanceof HTMLImageElement) ||
      !note || !slideCount || !(toggleButton instanceof HTMLButtonElement) ||
      !slideshowHint || !(toggleLabel instanceof HTMLElement) || !(toggleIcon instanceof HTMLElement) ||
      !(previousButton instanceof HTMLButtonElement) || !(nextButton instanceof HTMLButtonElement) ||
      !(songPlayerMount instanceof HTMLElement)) return;

  const messages = [
    "My favorite moments always have you in them.",
    "Thank you for making ordinary days feel special.",
    "My favorite place is right beside you.",
    "Life feels a little brighter with you in it.",
    "Still crushing on you, by the way.",
    "Here's to every laugh we haven't laughed yet.",
    "You make my heart feel at home.",
    "Everything is better when we share it.",
    "I'm so glad our paths found each other.",
    "A whole heart full of little moments.",
    "You are one of my favorite reasons to smile.",
    "More little adventures with you, please.",
    "My heart feels lucky to know yours.",
    "The best memories are the ones we make together.",
    "You make the simplest days shine.",
    "There's no one I'd rather share this with.",
    "Thank you for being exactly you.",
    "Here's to all the memories still waiting for us.",
    "You make my world a softer place.",
    "Every day with you is a favorite.",
    "I would choose you, every time.",
    "You turn little things into lovely memories.",
    "I love the way we make life ours.",
    "My favorite hello is yours.",
    "I hope you know how special you are to me.",
    "A little moment, a lot of love.",
    "The story keeps getting sweeter with you.",
    "There's nowhere else I'd rather be.",
    "My favorite person. My favorite memories.",
    "This is just the beginning of our story."
  ];

  let currentIndex = 0;
  let slideshowTimer = 0;
  let imageChangeTimer = 0;
  let spotifyController = null;
  let spotifyReady = false;

  const showSlide = (index) => {
    currentIndex = (index + photos.length) % photos.length;
    const photo = photos[currentIndex];
    image.classList.add("is-changing");
    window.clearTimeout(imageChangeTimer);
    imageChangeTimer = window.setTimeout(() => {
      image.src = photo.src;
      image.alt = photo.alt;
      note.textContent = messages[currentIndex % messages.length];
      slideCount.textContent = `${currentIndex + 1} / ${photos.length}`;
      image.classList.remove("is-changing");
    }, 180);

    const nextPhoto = new Image();
    nextPhoto.src = photos[(currentIndex + 1) % photos.length].src;
  };

  const pauseSlideshow = () => {
    window.clearInterval(slideshowTimer);
    slideshowTimer = 0;
    toggleButton.setAttribute("aria-pressed", "false");
    toggleLabel.textContent = "Play slideshow + song";
    toggleIcon.textContent = "▶";
  };

  const startSlideshow = () => {
    if (photos.length < 2 || slideshowTimer) return;
    toggleButton.setAttribute("aria-pressed", "true");
    toggleLabel.textContent = "Pause slideshow + song";
    toggleIcon.textContent = "Ⅱ";
    slideshowTimer = window.setInterval(() => showSlide(currentIndex + 1), 5200);
  };

  const setButtonReadyState = () => {
    const canStart = photos.length > 1;
    toggleButton.disabled = !canStart;
    toggleLabel.textContent = canStart ? "Play slideshow + song" : "Add at least 2 photos";
    toggleIcon.textContent = canStart ? "▶" : "♫";
  };

  if (photos.length === 0) {
    emptyState.hidden = false;
    stage.hidden = true;
    pauseSlideshow();
    setButtonReadyState();
  } else {
    emptyState.hidden = true;
    showSlide(0);

    toggleButton.addEventListener("click", () => {
      if (slideshowTimer) {
        pauseSlideshow();
        try {
          spotifyController?.pause();
          slideshowHint.textContent = "Both the slideshow and song are paused.";
        } catch {
          slideshowHint.textContent = "The slideshow is paused. Use the Open in Spotify link to control the song.";
        }
        return;
      }

      startSlideshow();
      try {
        if (spotifyController) {
          if (typeof spotifyController.restart === "function") {
            spotifyController.restart();
          } else if (typeof spotifyController.seek === "function") {
            spotifyController.seek(0);
          }
          spotifyController.play();
          slideshowHint.textContent = "The slideshow and Spotify preview are playing from the beginning. Open in Spotify for the full track.";
        } else {
          slideshowHint.textContent = "The slideshow is playing. If the song does not start, use the Open in Spotify link below.";
        }
      } catch {
        slideshowHint.textContent = "The slideshow is playing. If the song does not start, use the Open in Spotify link below.";
      }
    });
    previousButton.addEventListener("click", () => showSlide(currentIndex - 1));
    nextButton.addEventListener("click", () => showSlide(currentIndex + 1));
  }

  const setPlayerUnavailable = () => {
    setButtonReadyState();
    slideshowHint.textContent = photos.length < 2
      ? "Add at least two photos to start the slideshow. You can still use the Open in Spotify link below."
      : "Spotify could not connect. You can still start the slideshow and use the Spotify player below.";
  };

  window.onSpotifyIframeApiReady = (IFrameAPI) => {
    try {
      IFrameAPI.createController(songPlayerMount, {
        width: "100%",
        height: "152",
        url: "https://open.spotify.com/track/0XABI8auwTM81wyVovqNBK?utm_source=generator&theme=0"
      }, (controller) => {
        spotifyController = controller;
        controller.addListener("ready", () => {
          spotifyReady = true;
          setButtonReadyState();
          slideshowHint.textContent = photos.length < 2
            ? "Add at least two photos to start the slideshow. You can still play the song below."
            : "Press play to start the slideshow and Spotify preview from the beginning. Open in Spotify for the full track.";
        });
      });
    } catch {
      setPlayerUnavailable();
    }
  };

  const spotifyApiScript = document.createElement("script");
  spotifyApiScript.src = "https://open.spotify.com/embed/iframe-api/v1";
  spotifyApiScript.async = true;
  spotifyApiScript.onerror = setPlayerUnavailable;
  document.head.append(spotifyApiScript);

  window.setTimeout(() => {
    if (!spotifyReady) setPlayerUnavailable();
  }, 10000);
});
