let countdown, countup;
const timerDisplay = document.querySelector("#timer"),
  predefinedTimeOptions = [...document.querySelectorAll(".predefined-option")],
  timerMsg = document.querySelector("#time-message");

console.log(predefinedTimeOptions);

// play by clicking on time options
predefinedTimeOptions.forEach((btn) => {
  btn.addEventListener("click", prepareNewTimer);
});

function prepareNewTimer(e) {
  disableTimelessMeditation();

  // initialize timer
  startTimer(e.target.dataset.time);

  setTimerMsg('predefined');
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
  // unselect timeless meditation
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
  setTimerMsg('predefined');
});

// meditate the time you want
const timeless = document.querySelector("#timeless");
timeless.addEventListener("click", timelessMeditation);
let isTimelessMeditating = false;

function timelessMeditation() {
  clearAllTimers();

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

function setTimerMsg(timeless) {
  switch (timeless) {
    case 'predefined': timerMsg.textContent = "Tempo restante:";
    break;

    case 'timeless': timerMsg.textContent = "Tempo em meditação:";
    break;
    
    case 'end': timerMsg.textContent = "Escreva sobre sua meditação";
    break;
  }
}

function clearAllTimers() {
  // clear any active timers
  clearInterval(countdown);
  clearInterval(countup);
}