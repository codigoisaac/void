const player = document.querySelector("#music-player"),
  iframe = document.querySelector("#music-player iframe"),
  title = document.querySelector("#music-title"),
  music = document.querySelector("#sound-content"),
  contribute = document.querySelector("#playlist-contribution"),
  sound = document.querySelector("#sound");
music.addEventListener("click", toggleMusicOpen);
