const player = document.querySelector("#music-player"),
  iframe = document.querySelector("#music-player iframe"),
  title = document.querySelector("#music-title"),
  music = document.querySelector("#sound-content"),
  contribute = document.querySelector("#playlist-contribution"),
  sound = document.querySelector("#sound");
music.addEventListener("click", toggleOpen);
let isMusicOpen = false;
console.log(home);

function toggleOpen() {
  isMusicOpen = !isMusicOpen;

  if (isMusicOpen) {
    player.classList.add("shown");
    iframe.classList.add("shown");
    title.innerHTML = 'Música <i class="ri-toggle-fill"></i>';
    contribute.classList.add("shown");
    sound.classList.add("open");
    home.classList.add("music-open");
  } else {
    player.classList.remove("shown");
    iframe.classList.remove("shown");
    title.innerHTML = 'Música <i class="ri-toggle-line"></i>';
    contribute.classList.remove("shown");
    sound.classList.remove("open");
    home.classList.remove("music-open");
  }
}
