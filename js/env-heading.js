// Play the env variables heading once its section is on screen,
// using the same typewriter animation as whoami.
const envSection = document.querySelector('.env-section');
const envHeading = envSection?.querySelector('h1');

// Type "ls sandbox" once it is on screen, then swap the blinking
// cursor for the bucket. Same handoff as git fetch origin.
const sandboxSection = document.querySelector('.sandbox-section');
const sandboxHeading = sandboxSection?.querySelector('.sandbox-heading');

const onScreen = (target, play) => {
  if (!('IntersectionObserver' in window)) {
    play();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      play();
      observer.disconnect();
    }
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0 });

  observer.observe(target);
};

if (sandboxHeading) {
  sandboxHeading.addEventListener('animationend', (event) => {
    if (event.animationName === 'blink') {
      sandboxHeading.classList.add('typed');
    }
  });
}

if (envHeading || sandboxHeading) {
  const arm = () => {
    if (envHeading) onScreen(envSection, () => envHeading.classList.add('is-visible'));
    if (sandboxHeading) onScreen(sandboxSection, () => sandboxHeading.classList.add('is-visible'));
  };

  // The ASCII tree loads after first paint and pushes this section
  // down. Wait for the visible tree so the typewriter does not finish off screen.
  const trees = [...document.querySelectorAll('.ascii-tree')];
  const visibleTree = () => trees.find((tree) => getComputedStyle(tree).display !== 'none');
  const treeReady = () => {
    const shown = visibleTree();
    return shown && shown.textContent.trim().length > 0;
  };

  if (trees.length === 0 || treeReady()) {
    arm();
  } else {
    let armed = false;
    const start = () => {
      if (armed) return;
      armed = true;
      treeWatcher.disconnect();
      arm();
    };

    const treeWatcher = new MutationObserver(() => {
      if (treeReady()) start();
    });

    trees.forEach((tree) => {
      treeWatcher.observe(tree, { childList: true, characterData: true, subtree: true });
    });

    setTimeout(start, 3000);
  }
}

// Type "git fetch origin" once it is on screen, then swap the blinking
// cursor for the location pin. Same handoff as torischuyler.github.io.
const fetchHeading = document.querySelector('.fetch-heading');

if (fetchHeading) {
  const play = () => fetchHeading.classList.add('is-visible');

  fetchHeading.addEventListener('animationend', (event) => {
    if (event.animationName === 'blink') {
      fetchHeading.classList.add('typed');
    }
  });

  if (!('IntersectionObserver' in window)) {
    play();
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        play();
        observer.disconnect();
      }
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0 });

    observer.observe(fetchHeading.closest('.type-line') || fetchHeading);
  }
}
