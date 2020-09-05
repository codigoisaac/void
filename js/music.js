const player = document.querySelector("#music-player");
const iframe = document.querySelector("#music-player iframe");
const title = document.querySelector("#music-title");
const music = document.querySelector("#sound-content");
music.addEventListener("click", toggleOpen);
let isMusicOpen = false;

function toggleOpen() {
  isMusicOpen = !isMusicOpen;
  player.style.height = isMusicOpen ? "42vh" : "0";
  iframe.style.height = isMusicOpen ? "42vh" : "0";
  title.innerHTML = isMusicOpen
    ? 'Música <i class="ri-toggle-fill"></i>'
    : 'Música <i class="ri-toggle-line"></i>';
}
