let countdown;
const timerDisplay = document.querySelector("#timer-display");
const timeOptions = [...document.querySelectorAll(".time")];

// play by clicking on time options
timeOptions.forEach((option) => {
  option.addEventListener("click", startTimer);
});

function startTimer(e) {
  unselectTime();

  // initialize timer
  timer(e.target.dataset.time);

  // change background of selected time option
  e.target.classList.add("selected");
}

function timer(minutes) {
  // clear any active timers
  clearInterval(countdown);

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
      return;
    }
    // display
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  timerDisplay.textContent =
    minutes + ":" + (remainderSeconds < 10 ? "0" : "") + remainderSeconds;
}

// accept custom time input
document.timeForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const mins = this.minutesInput.value;
  timer(mins);
  this.reset();
  this.minutesInput.blur(); // unfocus from input

  unselectTime();
});

function unselectTime() {
  // unselect any previously selected time option
  timeOptions.forEach((option) => {
    option.classList.remove("selected");
  });
}
