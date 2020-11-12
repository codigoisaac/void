let countdown, countup;
const timerDisplay = document.querySelector("#timer"),
  predefTimeOptions = [...document.querySelectorAll(".predefined-option")],
  timerMsg = document.querySelector("#time-message");

// play by clicking on time options
predefTimeOptions.forEach((btn) => {
  btn.addEventListener("click", startTimer);
});

function startTimer(e) {
  unselectTime();
  unselectTimeless();

  // initialize timer
  timer(e.target.dataset.time);

  // change background of selected time option
  e.target.classList.add("selected");

  setTimerMsg();

  const timeInput = document.querySelector("#time-input");
}

function unselectTime() {
  // unselect any previously selected time option
  predefTimeOptions.forEach((option) => {
    option.classList.remove("selected");
  });
}

function unselectTimeless() {
  // unselect timeless meditation
  if (isTimelessMeditating) {
    isTimelessMeditating = false;
    timeless.textContent = ">";
  }
}

function timer(minutes) {
  // clear any active timers
  clearInterval(countdown);
  clearInterval(countup);

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

function encourageEntry() {
  setTimerMsg("write about");
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
  timer(mins);
  this.reset();
  this.minutesInput.blur(); // unfocus from input

  unselectTime();
  unselectTimeless();
  setTimerMsg();
});

// meditate the time you want
const timeless = document.querySelector("#timeless");
timeless.addEventListener("click", timelessMeditation);
let isTimelessMeditating = false;

function timelessMeditation() {
  unselectTime();

  // clear any active timers
  clearInterval(countdown);
  clearInterval(countup);

  // change the text in the button
  isTimelessMeditating = !isTimelessMeditating;
  timeless.textContent = isTimelessMeditating ? "| |" : ">";

  const now = Date.now(); // get moment

  // set display interval
  if (isTimelessMeditating) {
    countup = setInterval(() => {
      displayTimeMeditated(now);
    }, 1000);
  }

  // change timer description
  setTimerMsg("timeless");

  // encourage to add entry
  !isTimelessMeditating ? encourageEntry() : null;
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

function setTimerMsg(timeless = "") {
  if (timeless == "timeless") {
    timerMsg.textContent = "Tempo meditado:";
  } else if (timeless == "write about") {
    timerMsg.textContent = "Escreva sobre sua meditação";
  } else {
    timerMsg.textContent = "Tempo restante:";
  }
}
