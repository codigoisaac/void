import { toggleFormOpen } from "./entries.js";

let countdown, countup;

// displayers
const timerDisplay = document.querySelector("#meditation-timer"),
  timerMessage = document.querySelector("#timer-message");

//* timeless meditation
let isTimelessMeditating = false;
// timeless input
const timelessInput = document.querySelector("#timeless-input");
timelessInput.addEventListener("click", startTimelessMeditation);

function startTimelessMeditation() {
  clearAllTimers();

  isTimelessMeditating = !isTimelessMeditating;

  setTextsWhenMeditating("timeless");
}

function setTextsWhenMeditating(timeOption) {
  if (timeOption == "timeless") {
    //
    // set message texts
    if (isTimelessMeditating) {
      timerDisplay.textContent = "00:00";
      timelessInput.textContent = "| |";
      timerMessage.textContent = "Tempo no vazio:";
    } else {
      timelessInput.textContent = ">";
      timerMessage.textContent = "Escreva sobre sua meditação";
      toggleFormOpen();
    }

    // set timer text
    const now = Date.now();
    if (isTimelessMeditating) {
      countup = setInterval(() => {
        displayTimeMeditated(now);
      }, 1000);
    }

    //
  } else if (timeOption == "timed") {
  }
}

function displayTimeMeditated(start) {
  const passed = Date.now() - start,
    hoursPassed = Math.floor(passed / 3600000),
    minsPassed = Math.floor((passed / 60000) % 60),
    secsPassed = Math.floor((passed / 1000) % 60);

  timerDisplay.textContent =
    (minsPassed < 10 ? "0" : "") +
    minsPassed +
    ":" +
    (secsPassed < 10 ? "0" : "") +
    secsPassed;
}

///
// play by clicking on time options
predefinedTimeOptions.forEach((btn) => {
  btn.addEventListener("click", prepareNewTimer);
});
///

function prepareNewTimer(e) {
  disableTimelessMeditation();

  // initialize timer
  startTimer(e.target.dataset.time);

  setTimerMsg("predefined");
}

function startTimer(minutes) {
  clearAllTimers();

  // get now
  const now = Date.now(); // value in milliseconds
  // calculate when it will stop
  const then = now + minutes * 60000; // converted to milliseconds

  displayTimeLeft(minutes * 60); // converted to seconds

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // stop if reached zero
    if (secondsLeft < 0) {
      clearInterval(countdown);
      encourageToAddEntry();
      new Audio("audio/tibetan-bell.wav").play(); // end of timer alert
      return;
    }
    // display
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function disableTimelessMeditation() {
  if (isTimelessMeditating) {
    isTimelessMeditating = false;
    timeless.textContent = ">";
  }
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60),
    remainderSeconds = seconds % 60;

  timerDisplay.textContent =
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (remainderSeconds < 10 ? "0" : "") +
    remainderSeconds;
}

// accept custom time input
document.timeForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const mins = this.minutesInput.value;
  startTimer(mins);
  this.reset();
  this.minutesInput.blur(); // unfocus from input

  disableTimelessMeditation();
  setTimerMsg("predefined");
});

// meditate the time you want
const timeless = document.querySelector("#timeless");
timeless.addEventListener("click", timelessMeditation);

function clearAllTimers() {
  // clear any active timers
  clearInterval(countdown);
  clearInterval(countup);
}
