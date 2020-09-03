let countdown;
let countup;
const timerDisplay = document.querySelector("#timer");
const predefTimeOptions = [...document.querySelectorAll(".predefined-option")];
const timerDesc = document.querySelector("#timer-description");

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

  // change time description
  timerDesc.textContent = "Tempo restante";
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
      return;
    }
    // display
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function encourageEntry() {
  // encourage the user to add an entry at the end of a meditation
  timerDesc.innerHTML = `Parabéns! <br/>
  Você acabou de dar um passo em direção à sua melhor versão. <br/>
  Se quiser, escreva sobre a meditação. :)`;
  openForm();
  document.querySelector("#add-entry-title").focus();
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
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

  // change timer description
  timerDesc.textContent = "Tempo restante";
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
  timerDesc.textContent = "Tempo meditado";

  // encourage to add entry
  !isTimelessMeditating ? encourageEntry() : null;
}

function displayTimeMeditated(start) {
  const passed = Date.now() - start;
  const hoursPassed = Math.floor(passed / 3600000);
  const minsPassed = Math.floor((passed / 60000) % 60);
  const secsPassed = Math.floor((passed / 1000) % 60);
  timerDisplay.textContent =
    (minsPassed < 10 ? "0" : "") +
    minsPassed +
    ":" +
    (secsPassed < 10 ? "0" : "") +
    secsPassed;
}
