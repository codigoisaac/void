const player = document.querySelector("#music-player"),
  iframe = document.querySelector("#music-player iframe"),
  title = document.querySelector("#music-title"),
  music = document.querySelector("#sound-content"),
  contribute = document.querySelector("#playlist-contribution"),
  sound = document.querySelector("#sound");
music.addEventListener("click", toggleOpen);
let isMusicOpen = false;

async function toggleOpen() {
  isMusicOpen = !isMusicOpen;

  if (isMusicOpen) {
    player.classList.add("shown");
    iframe.classList.add("shown");
    // home.classList.add("music-open");
    title.innerHTML = 'Música <i class="ri-toggle-fill"></i>';
    sound.classList.add("open");
    contribute.classList.add("shown");
  } else {
    player.classList.remove("shown");
    iframe.classList.remove("shown");
    // home.classList.remove("music-open");
    title.innerHTML = 'Música <i class="ri-toggle-line"></i>';
    sound.classList.remove("open");
    contribute.classList.remove("shown");
  }
}
