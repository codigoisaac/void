document.querySelector("#play-button").addEventListener("click", play);
document.querySelector("#the-logo").addEventListener("click", voidit);
const times = [...document.querySelectorAll(".time")];

function play() {
  /* When I press the play button
  without selecting any time, it chooses
  randomly one of the time options */
  times.forEach((time) => time.classList.remove("selected"));
  const selectedTime = times[Math.floor(Math.random() * times.length)];
  selectedTime.classList.add("selected");
}

function playTime() {}

function voidit() {
  console.log("voidit");
}
