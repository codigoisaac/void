import { toggleFormOpen } from "./entries.js";

let countdown, countup;

///
const timerDisplay = document.querySelector("#timer"),
  predefinedTimeOptions = [...document.querySelectorAll(".predefined-option")],
  timerMsg = document.querySelector("#time-message");
///

//* timeless meditation
let isTimelessMeditating = false;
// timeless input
const timelessTimerInput = document.querySelector("#timeless-input");
timelessTimerInput.addEventListener("click", startTimelessMeditation);
// timeless message
const timelessTimerMessage = document.querySelector(
  "#timeless-meditation-div h1"
);

function startTimelessMeditation() {
  clearAllTimers();

  isTimelessMeditating = !isTimelessMeditating;

  setTextsWhenMeditating("timeless");

  // encourage to add entry
  !isTimelessMeditating ? encourageEntry() : null;
}

function setTextsWhenMeditating(timeOption) {
  if (timeOption == "timeless") {
    //
    // set message texts
    if (isTimelessMeditating) {
      timelessTimerInput.textContent = "| |";
      timelessTimerMessage.textContent = "Tempo no vazio:";
    } else {
      timelessTimerInput.textContent = ">";
      timelessTimerMessage.textContent = "Dê o play e entre no vazio:";
    }

    // set timer text
    document.querySelector("#timeless-meditation-timer").textContent = "00:00";
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

  document.querySelector("#timeless-meditation-timer").textContent =
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
      encourageEntry();
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

function encourageEntry() {
  setTimerMsg("end");
  toggleFormOpen();
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

function setTimerMsg(timeless) {
  switch (timeless) {
    case "predefined":
      timerMsg.textContent = "Tempo restante:";
      break;

    case "timeless":
      timerMsg.textContent = "Tempo em meditação:";
      break;

    case "end":
      timerMsg.textContent = "Escreva sobre sua meditação";
      break;
  }
}

function clearAllTimers() {
  // clear any active timers
  clearInterval(countdown);
  clearInterval(countup);
}
