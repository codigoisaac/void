const addBtn = document.querySelector("#open-form-btn");
addBtn.addEventListener("click", toggleFormOpen);
const form = document.querySelector("#add-entry-form");
form.addEventListener("submit", () => {
  // adding new / editing entry
  editingEntry == "" ? addEntry() : editEntry();
});

const titleInput = document.querySelector("#add-entry-title"),
  notesInput = document.querySelector("#add-entry-text");

let isFormOpen = false,
  editingEntry = "";

function fetchEntries() {
  // get data and where to display it
  const entries = getData();
  theEntries.innerHTML = "";

  if (entries.length > 0) {
    prepareAndDisplay(entries);
    insertOmTooltip();
    setHabitStats();
    setOmTooltip();
  }

  checkNoEntriesMessage();
}

function prepareAndDisplay(entries) {
  let totalDays = 0; // number of days in which entries were made

  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i],
      otherEntriesWSameDate = getOtherEntriesWSameDate(entry, entries),
      isOm = otherEntriesWSameDate.length > 1;

    // add header only before last entry in a day
    if (entry.count == otherEntriesWSameDate.length) {
      // if it is the last entry in it's day
      addDayHeader(entry, isOm, totalDays);
      totalDays++;
    }

    injectEntryHTML(entry);

    // set buttons
    setDelete(entry);
    setEdit(entry);
  }
}

function insertOmTooltip() {
  theEntries.insertAdjacentHTML(
    "beforeend",
    `<div id="om-tooltip">
        O símbolo Om é adquirido nos dias em que você medita 2 vezes ou mais.
    </div>`
  );
}

function getOtherEntriesWSameDate(entry, arrayOfEntries) {
  // todo: check year too

  return arrayOfEntries.filter(
    (otherEntry) => otherEntry.dayNMonth == entry.dayNMonth
  );
}

function addDayHeader(entry, isOm, totalDays) {
  theEntries.innerHTML += '<div class="day-info"></div>';
  const dayInfo = theEntries.querySelectorAll(".day-info")[totalDays];
  dayInfo.innerHTML += `
    <div class="date">${entry.dayNMonth}<span class="year">/${entry.year}</span></div>`;

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
        <div class="hour">${entry.hourNMinute}</div>

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
      (titleInput.value == "" && notesInput.value == "") ||
      (titleInput.value == entry.title && notesInput.value == entry.text)
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

function addEntry() {
  const entryText = getFormValues(),
    entryTime = getCurrentDateTime(),
    entryCount = setEntrysCountInDay(entryTime.totalDate);

  // add entry id
  let entryId = chance.guid();

  // create entry obj
  let entry = {
    title: entryText.title,
    note: entryText.note,
    day: entryTime.day,
    month: entryTime.month,
    dayNMonth: entryTime.dayNMonth,
    year: entryTime.year,
    totalDate: entryTime.totalDate,
    hour: entryTime.hour,
    minute: entryTime.minute,
    hourNMinute: entryTime.hourNMinute,
    count: entryCount,
    id: entryId,
  };

  saveEntry(entry);
  form.reset();
  toggleFormOpen();
  fetchEntries();
}

function getFormValues() {
  const formValues = {
    title: titleInput.value,
    note: notesInput.value,
  };

  return formValues;
}

function getCurrentDateTime() {
  const currentDate = new Date();

  const dateTime = {
    day: realDay(currentDate),
    month: realMonth(currentDate),
    year: currentDate.getFullYear(),
    hour: realHour(currentDate),
    minute: realMinute(currentDate),
  };
  dateTime.dayNMonth = dateTime.day + "/" + dateTime.month;
  dateTime.totalDate =
    dateTime.day + "/" + dateTime.month + "/" + dateTime.year;
  dateTime.hourNMinute = dateTime.hour + ":" + dateTime.minute;

  return dateTime;
}

function setEntrysCountInDay(totalDate) {
  let numberInDay = 1;

  const entries = getData();
  if (entries.length > 0) {
    entries.forEach((entry) => {
      if (entry.totalDate == totalDate) {
        numberInDay++;
      }
    });
  }

  return numberInDay;
}

function saveEntry(entry) {
  if (entry.title != "" || entry.note != "") {
    // if at least one of the form fields are not empty
    entries = getData();
    entries.push(entry);
    localStorage.setItem("entries", JSON.stringify(entries));
  } else {
    // if both form fields are empty
    alert("Por favor insira alguma informação. O vazio não pode ser gravado.");
  }
}

function toggleFormOpen() {
  isFormOpen = !isFormOpen;

  // display form
  if (isFormOpen) {
    addBtn.innerHTML = '<i class="ri-close-line"></i>';
    form.classList.add("shown");
    titleInput.focus();
  } else {
    addBtn.innerHTML = '<i class="ri-add-line"></i>';
    form.classList.remove("shown");
  }
}

function realDay(date) {
  // get day number and add 0 in front if less than 10
  return date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
}

function realMonth(date) {
  // get month number and add 0 in front if less than 10
  // the +1 is because getMonth() is zero-based
  return date.getMonth() + 1 < 10
    ? "0" + (date.getMonth() + 1)
    : date.getMonth() + 1;
}

function realHour(date) {
  // get hour number and add 0 in front if less than 10
  return date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
}

function realMinute(date) {
  // get minute number and add 0 in front if less than 10
  return date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
}

function editEntry() {
  // copy data and modify given entry
  const entries = getData();
  entries.forEach((entry) => {
    if (entry.id == editingEntry.id) {
      entry.title = titleInput.value;
      entry.text = notesInput.value;
    }
  });
  // overwrite data
  localStorage.setItem("entries", JSON.stringify(entries));

  fetchEntries();
  editingEntry = "";
}

function overwriteForm(entry) {
  titleInput.value = entry.title;
  notesInput.value = entry.text;
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
