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
  const songHint = document.querySelector("#song-hint");
  const previousButton = document.querySelector("#slide-prev");
  const nextButton = document.querySelector("#slide-next");

  if (!emptyState || !stage || !(image instanceof HTMLImageElement) ||
      !note || !slideCount || !(toggleButton instanceof HTMLButtonElement) ||
      !slideshowHint || !songHint ||
      !(previousButton instanceof HTMLButtonElement) || !(nextButton instanceof HTMLButtonElement)) return;

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
  let youtubePlayer = null;

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
    toggleButton.innerHTML = 'Start slideshow <span aria-hidden="true">▶</span>';
    stage.classList.remove("is-playing");
  };

  const startSlideshow = () => {
    if (photos.length < 2 || slideshowTimer) return;
    toggleButton.setAttribute("aria-pressed", "true");
    toggleButton.innerHTML = 'Pause slideshow <span aria-hidden="true">Ⅱ</span>';
    stage.classList.add("is-playing");
    slideshowTimer = window.setInterval(() => showSlide(currentIndex + 1), 5200);
  };

  if (photos.length === 0) {
    emptyState.hidden = false;
    stage.hidden = true;
    toggleButton.disabled = true;
    pauseSlideshow();
    return;
  }

  emptyState.hidden = true;
  showSlide(0);

  toggleButton.addEventListener("click", () => {
    if (slideshowTimer) {
      pauseSlideshow();
      youtubePlayer?.pauseVideo();
      return;
    }

    startSlideshow();
    youtubePlayer?.playVideo();
  });
  previousButton.addEventListener("click", () => showSlide(currentIndex - 1));
  nextButton.addEventListener("click", () => showSlide(currentIndex + 1));

  const songFrame = document.querySelector("#song-player");
  if (songFrame instanceof HTMLIFrameElement) {
    if (window.location.origin !== "null") {
      const playerUrl = new URL(songFrame.src);
      playerUrl.searchParams.set("origin", window.location.origin);
      songFrame.src = playerUrl.toString();
    }

    window.onYouTubeIframeAPIReady = () => {
      youtubePlayer = new YT.Player(songFrame, {
        events: {
          onReady() {
            toggleButton.disabled = false;
            toggleButton.innerHTML = 'Start slideshow <span aria-hidden="true">▶</span>';
            slideshowHint.textContent = "Start the slideshow to play the song and photos together.";
            songHint.textContent = "Start the slideshow to play the song and photos together. The song repeats while you watch.";
          },
          onStateChange(event) {
            if (event.data === YT.PlayerState.PLAYING) startSlideshow();
            if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
              pauseSlideshow();
            }
          },
          onError() {
            toggleButton.disabled = false;
            slideshowHint.textContent = "The song player couldn't load. You can still start the photo slideshow.";
            songHint.textContent = "The song player couldn't load. Try opening the song on YouTube.";
          }
        }
      });
    };

    const apiScript = document.createElement("script");
    apiScript.src = "https://www.youtube.com/iframe_api";
    apiScript.async = true;
    apiScript.onerror = () => {
      toggleButton.disabled = false;
      toggleButton.innerHTML = 'Start slideshow <span aria-hidden="true">▶</span>';
      slideshowHint.textContent = "The song player couldn't load. You can still start the photo slideshow.";
      songHint.textContent = "The song player couldn't load. Try opening the song on YouTube.";
    };
    document.head.append(apiScript);
    window.setTimeout(() => {
      if (!toggleButton.disabled) return;
      toggleButton.disabled = false;
      toggleButton.innerHTML = 'Start slideshow <span aria-hidden="true">▶</span>';
      slideshowHint.textContent = "The song player is taking a while to load. You can still start the photo slideshow.";
    }, 8000);
  }
});
