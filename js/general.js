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

function toggleMusicOpen() {
  isMusicOpen = !isMusicOpen;

  if (isMusicOpen) {
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
}

function toggleEntriesOpen() {
  if (screen.width < 1024) {
    isEntriesOpen = !isEntriesOpen;

    if (isEntriesOpen) {
      theEntries.classList.add("shown");
      entryControls.classList.add("entries-shown");
      entriesHeader.innerHTML = 'Meditações <i class="ri-toggle-fill"></i>';

      // close music
      if (isMusicOpen) {
        toggleMusicOpen();
      }

      toggleShowLogo();
    } else {
      theEntries.classList.remove("shown");
      entryControls.classList.remove("entries-shown");
      entriesHeader.innerHTML = 'Meditações <i class="ri-toggle-line"></i>';

      if (!isMusicOpen) {
        toggleShowLogo();
      }
    }
  }
}

// only when music and entries are closed we see the Void logo.
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
