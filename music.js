const musicStation = document.querySelector("#music-player");
let isMusicOpen = false;
const musicButton = document.querySelector("#music-btn");
musicButton.addEventListener("click", toggleOpen);

function toggleOpen() {
  isMusicOpen = !isMusicOpen;
  musicStation.display = isMusicOpen ? "block" : "none";
}
