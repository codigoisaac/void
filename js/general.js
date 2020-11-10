// this script goes here for accessibility
function getData() {
  if (localStorage.getItem("entries") != null) {
    return JSON.parse(localStorage.getItem("entries"));
  } else {
    return [];
  }
}

// entries and music can't be open at the same time in mobile.
// this functions and variables are here because
// they are used in each other's script.
let isMusicOpen = false,
  isEntriesOpen = false;
const theEntries = document.querySelector("#the-entries");

function toggleMusicOpen() {
  isMusicOpen = !isMusicOpen;

  if (isMusicOpen) {
    // show music section
    player.classList.add("shown");
    iframe.classList.add("shown");
    title.innerHTML = 'Música <i class="ri-toggle-fill"></i>';
    sound.classList.add("open");
    contribute.classList.add("shown");

    if (screen.width < 1024) {
      // close entries
      if (isEntriesOpen) {
        toggleEntriesOpen();
      }

      toggleShowLogo();
    }
  } else {
    // hide music section
    player.classList.remove("shown");
    iframe.classList.remove("shown");
    title.innerHTML = 'Música <i class="ri-toggle-line"></i>';
    sound.classList.remove("open");
    contribute.classList.remove("shown");

    if (screen.width < 1024) {
      if (!isEntriesOpen) {
        toggleShowLogo();
      }
    }
  }

  hideAllElse();
}

function toggleEntriesOpen() {
  if (screen.width < 1024) {
    isEntriesOpen = !isEntriesOpen;

    if (isEntriesOpen) {
      // show entries section
      theEntries.classList.add("shown");
      entryControls.classList.add("entries-shown");
      entriesHeader.innerHTML = 'Meditações <i class="ri-toggle-fill"></i>';

      // close music
      if (isMusicOpen) {
        toggleMusicOpen();
      }

      toggleShowLogo();
    } else {
      // hide entries section
      theEntries.classList.remove("shown");
      entryControls.classList.remove("entries-shown");
      entriesHeader.innerHTML = 'Meditações <i class="ri-toggle-line"></i>';

      if (!isMusicOpen) {
        toggleShowLogo();
      }
    }

    checkNoEntriesMessage();
    hideAllElse();
  }
}

// display logo only when music and entries are closed
const logoArea = document.querySelector("#logo"),
  timeDiv = document.querySelector("#time-div");

function toggleShowLogo() {
  if (!isMusicOpen && !isEntriesOpen) {
    logoArea.classList.remove("hide");
    timeDiv.classList.remove("logo-hidden");
  } else {
    logoArea.classList.add("hide");
    timeDiv.classList.add("logo-hidden");
  }
}

// logo transition when load the page
function animateLogo() {
  logoArea.classList.add("loaded");
}

// hide not important
function hideAllElse() {
  if (screen.width < 1024) {
    // elements not important
    const habitStats = document.querySelector("#habit-stats"),
      musicArea = document.querySelector("#sound"),
      entriesArea = document.querySelector("#entries"),
      footer = document.querySelector("footer");

    // show/hide all
    if (isMusicOpen || isEntriesOpen) {
      timeDiv.classList.add("not-important");
      habitStats.classList.add("not-important");
      footer.classList.add("not-important");
    } else {
      timeDiv.classList.remove("not-important");
      habitStats.classList.remove("not-important");
      footer.classList.remove("not-important");
    }

    // show/hide entries
    if (isMusicOpen) {
      entriesArea.classList.add("not-important");
    } else {
      entriesArea.classList.remove("not-important");
    }

    // show/hide music
    if (isEntriesOpen) {
      musicArea.classList.add("not-important");
    } else {
      musicArea.classList.remove("not-important");
    }
  }
}
