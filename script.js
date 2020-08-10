document.querySelector("#play-button").addEventListener("click", play);
document.querySelector("#the-logo").addEventListener("click", voidit);
const times = [...document.querySelectorAll(".time")];

let timerIntervalId = 0;
let selectedTime = times[Math.floor(Math.random() * times.length)];

// can't access object property on object initialization.
// const time = {
//   minutes: parseInt(selectedTime.dataset.time),
//   // seconds: this.minutes * 60,
//   seconds: 5,
//   milliseconds: this.seconds * 1000,
// };

const time = new (function () {
  this.minutes = parseInt(selectedTime.dataset.time);
  // this.seconds = this.minutes * 60;
  this.seconds = 3;
  this.milliseconds = this.seconds * 1000;
})();

// what if i want to create multiple 'time' objects?
// const time = new Object();
// time.minutes = parseInt(selectedTime.dataset.time);
// time.seconds = time.minutes * 60;
// time.milliseconds = time.seconds * 1000;

// how will i reference a property of it?
// function Time() {
//   this.minutes = selectedTime.dataset.time;
//   this.seconds = this.minutes * 60;
//   this.milliseconds = this.seconds * 1000;
// }

function play() {
  /* When I press the play button
  without selecting any time, it chooses
  randomly one of the time options */
  // Select a random time / unselect all first
  times.forEach((time) => time.classList.remove("selected"));
  selectedTime = times[Math.floor(Math.random() * times.length)];
  selectedTime.classList.add("selected");
  /* And the timer starts */
  // timerIntervalId = setInterval("displayTime()", 1000);
  setTimeout("timeEnd()", time.milliseconds);
  console.log(time.milliseconds);
}

function displayTime() {
  console.log("one second passed");
}

function timeEnd() {
  console.log("time ended");
}

function voidit() {
  console.log("voidit");
}
