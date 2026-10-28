// One clip at a time. Starting another pauses the one that was playing,
// the same way a page of videos keeps a single soundtrack.
const clips = document.querySelectorAll('.clip video');

clips.forEach((clip) => {
  clip.addEventListener('play', () => {
    clips.forEach((other) => {
      if (other !== clip) other.pause();
    });
  });
});
