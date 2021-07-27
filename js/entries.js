document
  .querySelector("body")
  .addEventListener("load", fetchEntries(), eraseTip());

const addBtn = document.querySelector("#open-form-btn");
addBtn.addEventListener("click", toggleFormOpen);
const form = document.querySelector("#add-entry-form");
form.addEventListener("submit", () => {
  // adding new / editing entry
  editingEntry == "" ? addEntry() : editEntry();
});

const inputs = {
  title: document.querySelector("#add-entry-title"),
  note: document.querySelector("#add-entry-text"),
  day: document.querySelector("#day-input"),
  month: document.querySelector("#month-input"),
  year: document.querySelector("#year-input"),
  hour: document.querySelector("#hour-input"),
  minute: document.querySelector("#minute-input"),
};

let isFormOpen = false,
  editingEntry = "";

import { setHabitStats } from "./habit-stats.js";
function fetchEntries() {
  // get data and where to display it
  let entries = getData();
  theEntries.innerHTML = "";

  if (entries.length > 0) {
    prepareAndDisplayEntries(entries);
    insertOmTooltip();
    setHabitStats();
    setOmTooltip();
  }

  checkNoEntriesMessage();
}

function prepareAndDisplayEntries(entries) {
  entries.forEach((entry) => {
    const otherEntriesWSameDate = getOtherEntriesWSameDate(entry, entries),
      isOm = otherEntriesWSameDate.length > 1;

    // add header only before last entry in a day
    if (entry.count == otherEntriesWSameDate.length) {
      // if it is the last entry in it's day
      addDayHeader(entry, isOm);
    }

    injectEntryHTML(entry);

    // set buttons
    setDelete(entry);
    setEdit(entry);
  });
}

function getOtherEntriesWSameDate(entry, arrayOfEntries) {
  return arrayOfEntries.filter(
    (otherEntry) => otherEntry.totalDate == entry.totalDate
  );
}

function insertOmTooltip() {
  theEntries.insertAdjacentHTML(
    "beforeend",
    `<div id="om-tooltip">
        O símbolo Om é adquirido nos dias em que você medita 2 vezes ou mais.
    </div>`
  );
}

function addDayHeader(entry, isOm) {
  theEntries.innerHTML += '<div class="day-info"></div>';
  const allDayInfos = theEntries.querySelectorAll(".day-info"),
    dayInfo = allDayInfos[allDayInfos.length - 1];
  dayInfo.innerHTML += `
    <div class="date">${entry.dayAndMonth}<span class="year">/${entry.year}</span></div>`;

  // add om symbol when there is more than one entry in this day
  if (isOm) {
    dayInfo.innerHTML += '<div class="om"><i class="fas fa-om"></i></div>';
  }
}

function injectEntryHTML(entry) {
  theEntries.insertAdjacentHTML(
    "beforeend",
    `<div class="entry">
      <div class="entry-header">
        <div class="entry-title">${entry.title}</div>

        <div class="entry-buttons">
          <button class="edit-btn">
            <i class="ri-pencil-line"></i>
          </button>
          <button class="delete-btn">
            <i class="ri-close-line"></i>
          </button>
        </div>
      </div>
      
      <div class="entry-text">${entry.note}</div>

      <div class="entry-infos">
        <div class="hour">${entry.hourAndMinute}</div>

        <div class="number-in-the-day">${entry.count}</div>
      </div>
   </div>`
  );
}

function setDelete(entry) {
  const docEntries = [...document.querySelectorAll(".entry")],
    docEntry = docEntries[docEntries.length - 1]; // last item
  // delete
  const delBtn = docEntry.querySelector(".delete-btn");
  delBtn.addEventListener("click", () => {
    if (!delBtn.classList.contains("selected")) {
      // if not selected - insert trash icon
      delBtn.classList.add("selected");
      delBtn.innerHTML = '<i class="ri-delete-bin-line"></i>';
      // unselect after some seconds
      setTimeout(() => {
        delBtn.classList.remove("selected");
        delBtn.innerHTML = '<i class="ri-close-line"></i>';
      }, 2000);
    } else {
      // if previously selected
      let entries = getData();
      entries.forEach((thisEntry) => {
        if (thisEntry.id == entry.id) {
          entries.splice(entries.indexOf(thisEntry), 1);
        }
      });

      // reset count in the day
      entries = resetEntriesCountInDays(entries);

      // save again
      localStorage.setItem("entries", JSON.stringify(entries));
      fetchEntries();
    }
  });
}

function setEdit(entry) {
  const docEntries = [...document.querySelectorAll(".entry")],
    docEntry = docEntries[docEntries.length - 1]; // last item
  // handle form
  const editBtn = docEntry.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    isFormOpen ? null : toggleFormOpen();
    // overwrite values only if form is empty or equal to entry
    if (
      (inputs.title.value == "" && inputs.note.value == "") ||
      (inputs.title.value == entry.title && inputs.note.value == entry.note)
    ) {
      overwriteForm(entry);
    }
    // otherwise ask confirmation to overwrite
    else {
      if (
        confirm(
          `Para editar você precisa usar o formulário.\nSobrescrever dados do formulário?`
        )
      ) {
        overwriteForm(entry);
      }
    }
  });
}

//* Add Entry
function addEntry() {
  const formValues = getFormValues(),
    extraValues = setExtraEntryValues(formValues);

  // add entry id
  let entryId = chance.guid();

  // create entry obj
  let entry = {
    title: formValues.title,
    note: formValues.note,
    day: formValues.day,
    month: formValues.month,
    dayAndMonth: extraValues.dayAndMonth,
    year: formValues.year,
    totalDate: extraValues.totalDate,
    hour: formValues.hour,
    minute: formValues.minute,
    hourAndMinute: extraValues.hourAndMinute,
    count: null,
    id: entryId,
  };

  saveEntry(entry);
  form.reset();
  toggleFormOpen();
  fetchEntries();
}

function getFormValues() {
  return {
    title: inputs.title.value,
    note: inputs.note.value,
    day: inputs.day.value,
    month: inputs.month.value,
    year: inputs.year.value,
    hour: inputs.hour.value,
    minute: inputs.minute.value,
  };
}

function setExtraEntryValues(values) {
  return {
    dayAndMonth: values.day + "/" + values.month,
    totalDate: values.day + "/" + values.month + "/" + values.year,
    hourAndMinute: values.hour + ":" + values.minute,
  };
}

//* Save entry
function saveEntry(entry) {
  if (entry.title != "" || entry.note != "") {
    // if at least one of the form fields are filled
    let entries = getData();
    entries.unshift(entry);
    entries = sortEntries(entries);
    entries = setEntriesCount(entries);
    localStorage.setItem("entries", JSON.stringify(entries));
  } else {
    // if both form fields are empty
    alert("Por favor insira alguma informação. O vazio não pode ser gravado.");
  }
}

function sortEntries(entries) {
  return entries.sort((a, b) => {
    const aDate = new Date(a.year, a.month, a.day, a.hour, a.minute),
      bDate = new Date(b.year, b.month, b.day, b.hour, b.minute);
    if (aDate > bDate) return -1;
    if (aDate < bDate) return 1;
    return 0;
  });
}

function setEntriesCount(entries) {
  let previousEntryDate = null,
    sameDayStrike = 1;
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i];
    if (entry.totalDate == previousEntryDate) {
      sameDayStrike++;
      entry.count = sameDayStrike;
    } else {
      previousEntryDate = entry.totalDate;
      sameDayStrike = 1;
      entry.count = 1;
    }
  }

  return entries;
}

export function toggleFormOpen() {
  isFormOpen = !isFormOpen;

  // display form
  if (isFormOpen) {
    addBtn.innerHTML = '<i class="ri-close-line"></i>';
    form.classList.add("shown");
    inputs.title.focus();

    getDateTimeIntoInputs();
  } else {
    addBtn.innerHTML = '<i class="ri-add-line"></i>';
    form.classList.remove("shown");
  }
}

function getDateTimeIntoInputs() {
  const dateTime = getCurrentDateTime();
  document.querySelector("#day-input").value = dateTime.day;
  document.querySelector("#month-input").value = dateTime.month;
  document.querySelector("#year-input").value = dateTime.year;
  document.querySelector("#hour-input").value = dateTime.hour;
  document.querySelector("#minute-input").value = dateTime.minute;
}

function getCurrentDateTime() {
  const currentDate = new Date();

  // Add Zeros in front of numbers less than 10
  const dateTime = {
    day:
      currentDate.getDate() < 10
        ? "0" + currentDate.getDate()
        : currentDate.getDate(),
    month:
      currentDate.getMonth() + 1 < 10
        ? "0" + (currentDate.getMonth() + 1)
        : currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    hour:
      currentDate.getHours() < 10
        ? "0" + currentDate.getHours()
        : currentDate.getHours(),
    minute:
      currentDate.getMinutes() < 10
        ? "0" + currentDate.getMinutes()
        : currentDate.getMinutes(),
  };

  return dateTime;
}

//* Date inputs
inputs.day.addEventListener("change", handleDayChange);
inputs.month.addEventListener("change", handleMonthChange);
inputs.year.addEventListener("change", handleYearChange);

import { daysInMonth } from "./habit-stats.js";

// day
function handleDayChange() {
  let date = new Date(),
    day = inputs.day.value,
    month = inputs.month.value,
    year = inputs.year.value;
  // too far in the future
  if (
    parseInt(day) > date.getDate() &&
    year == date.getFullYear() &&
    month == date.getMonth() + 1
  ) {
    // if you select a day in the future
    timeMessage("future");
    inputs.day.value = date.getDate();
  }
  // add zero
  if (parseInt(day) < 10) {
    inputs.day.value = "0" + parseInt(day);
  }

  checkMaxDay();
}

// month
function handleMonthChange() {
  let date = new Date(),
    month = inputs.month.value,
    year = inputs.year.value;
  // too far in the future
  if (month > date.getMonth() + 1 && year == date.getFullYear()) {
    timeMessage("future");
    inputs.month.value = date.getMonth() + 1;
  }
  // add zero
  if (parseInt(inputs.month.value) < 10) {
    inputs.month.value = "0" + parseInt(inputs.month.value);
  }

  checkMaxDay();
}

// year
function handleYearChange() {
  let date = new Date(),
    value = inputs.year.value;
  // too far in the future
  if (parseInt(value) > date.getFullYear()) {
    timeMessage("future");
    inputs.year.value = date.getFullYear();
  }
  // too far in the past
  let minYear = 1985;
  if (parseInt(value) < minYear) {
    timeMessage("past");
    inputs.year.value = minYear;
  }

  checkMaxDay();
}

function timeMessage(time) {
  switch (time) {
    case "future":
      alert(
        "Oh, você é um viajante do tempo! Por favor me ensine suas técnicas e eu desbloquearei para você a funcionalidade de adicionar meditações futuras. \n - códigoisaac"
      );
      break;

    case "past":
      alert(
        "Uau. Eu não sabia que as pessoas podiam viver mais de 125 anos! Você é um viajante do tempo? Um imortal? Alguém que se lembra de vidas passadas? Ou apenas muito velho? Ensine-me suas técnicas e vou desbloquear para você a funcionalidade de inserir meditações muito antigas. \n - códigoisaac"
      );
      break;
  }
}

// check max day
function checkMaxDay() {
  // check if the selected day fits in the selected month
  // of the selected year
  let daysInSelectedMonth = daysInMonth(inputs.month.value, inputs.year.value);
  if (parseInt(inputs.day.value) > daysInSelectedMonth) {
    inputs.day.value = daysInSelectedMonth;
  }
}

//* Edit Entry
function editEntry() {
  // copy data and modify given entry
  const entries = getData();
  entries.forEach((entry) => {
    if (entry.id == editingEntry.id) {
      entry.title = inputs.title.value;
      entry.note = inputs.note.value;
    }
  });
  // overwrite data
  localStorage.setItem("entries", JSON.stringify(entries));

  fetchEntries();
  editingEntry = "";
}

function overwriteForm(entry) {
  inputs.title.value = entry.title;
  inputs.note.value = entry.note;
  editingEntry = entry;
}

function resetEntriesCountInDays(entries) {
  // reset the entry count in the day
  entries.forEach((entry) => {
    let countInDay = 0;
    entries.forEach((otherEntry) => {
      if (otherEntry.date == entry.date) {
        countInDay++;
        otherEntry.count = countInDay;
      }
    });
  });

  return entries;
}

// show/hide entries
const entryControls = document.querySelector("#entry-controls"),
  entriesHeader = document.querySelector("#entries-header");
entriesHeader.addEventListener("click", () => {
  // entries hideable only for mobile
  if (screen.width < 1024) {
    toggleEntriesOpen();
  }
});

// erase "tap to minimize" tip
function eraseTip() {
  const tip = document.querySelector("#entries-header #tip");
  tip.style.opacity = 0;
}

// show/hide Om tooltip
let showOmTooltip = false;
function setOmTooltip() {
  const oms = document.querySelectorAll(".om"),
    omTooltip = document.querySelector("#om-tooltip");
  oms.forEach((om) => {
    // show tooltip
    om.addEventListener("mouseover", () => {
      omTooltip.classList.add("shown");
    });
    // hide tooltip
    om.addEventListener("mouseout", () => {
      omTooltip.classList.remove("shown");
    });
  });
}

// show/hide no-entries-message
function checkNoEntriesMessage() {
  const noEntriesMessage = document.querySelector("#no-entries-message");

  let entries = getData();

  if (entries.length == 0) {
    // if in mobile
    if (screen.width < 1024) {
      if (isEntriesOpen) {
        noEntriesMessage.classList.add("shown");
      } else {
        noEntriesMessage.classList.remove("shown");
      }
      // if not in mobile
    } else {
      noEntriesMessage.classList.add("shown");
    }
  } else {
    noEntriesMessage.classList.remove("shown");
  }
}
