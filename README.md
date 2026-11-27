# For My Favorite Person

A responsive static website with a home page, story, slideshow gallery, Spotify player, and letter. On the gallery page, press the slideshow button to start or pause the photos and song together. No build step or package installation is required.

## Gallery photos

The photos from the shared Google Photos album are already in `assets/photos/` and listed in `assets/js/photos.js`. One photo has been left out of the slideshow at the user's request. The slideshow messages are in `assets/js/gallery.js`. To add more photos, copy image files into `assets/photos/` and add entries to the manifest. Each entry uses the actual filename:

```js
window.ourPhotos = [
  { src: "assets/photos/our-day.jpg", alt: "The two of us together", caption: "One of my favorite days" },
  { src: "assets/photos/laughing.jpg", alt: "Us laughing together", caption: "A little moment I love" },
];
```

Use descriptive alt text for accessibility. JPG, PNG, and WebP images work in modern browsers. Keep the filenames and letter casing the same as the files you add. Edit the existing captions in `assets/js/photos.js` to personalize the gallery.

## Preview and publish

Open `index.html` in a browser to preview the site. To publish it, upload `index.html`, all four other HTML pages, `assets/`, and this README to any static website host. Keep the folder structure unchanged so the navigation, styles, scripts, and photos continue to work.

The song is embedded from Spotify and needs an internet connection. The gallery uses Spotify’s iFrame API to connect playback to the slideshow button; if the browser blocks playback, use the Spotify link on the page. The photo page also links to the original shared Google Photos album.
