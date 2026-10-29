// Play each homepage heading once the reader has scrolled it into view.
// The typewriter and cursor stay paused until then. whoami and
// git fetch origin are already on screen when the page loads, so they
// type right away.

// A heading in the bottom half is not "this part" yet. The last
// sections cannot scroll up to the midline, so the bottom of the page
// counts once the reader has reached it.
const reached = (target) => {
  const rect = target.getBoundingClientRect();
  if (rect.height === 0) return false;

  const viewHeight = window.innerHeight;
  const onScreen = rect.bottom > 24 && rect.top < viewHeight - 24;
  if (!onScreen) return false;

  const inReadingBand = rect.top < viewHeight * 0.5;
  const atPageEnd =
    window.scrollY + viewHeight >= document.documentElement.scrollHeight - 2;
  return inReadingBand || atPageEnd;
};

const onScreen = (target, play) => {
  if (!target) return;

  let played = false;
  const tick = () => {
    if (played || !reached(target)) return;
    played = true;
    window.removeEventListener("scroll", tick);
    window.removeEventListener("resize", tick);
    play();
  };

  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick);
  tick();
};

const playHeading = (heading) => {
  if (!heading) return;

  onScreen(heading.closest(".type-line") || heading, () => {
    heading.classList.add("is-visible");
  });
};

// The cursor blink lives on the heading. When it finishes, the pin or
// bucket takes that spot.
const swapCursor = (heading) => {
  if (!heading) return;

  heading.addEventListener("animationend", (event) => {
    if (event.animationName === "blink") heading.classList.add("typed");
  });
};

const whoami = document.querySelector("main > .type-line h1");
const envHeading = document.querySelector(".env-section h1");
const sandboxHeading = document.querySelector(".sandbox-heading");
const fetchHeading = document.querySelector(".fetch-heading");

playHeading(whoami);
if (fetchHeading) fetchHeading.classList.add("is-visible");
swapCursor(fetchHeading);
swapCursor(sandboxHeading);

// The ASCII tree loads after first paint and pushes these two down.
// Wait for the visible tree so a heading does not type, then get pushed
// off screen before the reader reaches it.
const armLowerHeadings = () => {
  playHeading(envHeading);
  playHeading(sandboxHeading);
};

const trees = [...document.querySelectorAll(".ascii-tree")];
const visibleTree = () =>
  trees.find((tree) => getComputedStyle(tree).display !== "none");
const treeReady = () => {
  const shown = visibleTree();
  return shown && shown.textContent.trim().length > 0;
};

if ((envHeading || sandboxHeading) && (trees.length === 0 || treeReady())) {
  armLowerHeadings();
} else if (envHeading || sandboxHeading) {
  let armed = false;
  const start = () => {
    if (armed) return;
    armed = true;
    treeWatcher.disconnect();
    armLowerHeadings();
  };

  const treeWatcher = new MutationObserver(() => {
    if (treeReady()) start();
  });

  trees.forEach((tree) => {
    treeWatcher.observe(tree, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  });

  setTimeout(start, 3000);
}
