const addBtn = document.querySelector("#open-form-btn");
addBtn.addEventListener("click", toggleFormOpen);
const form = document.querySelector("#add-entry-form");
form.addEventListener("submit", () => {
  // adding new / editing entry
  editingEntry == "" ? addEntry(event) : editEntry();
});

const titleInput = document.querySelector("#add-entry-title"),
  notesInput = document.querySelector("#add-entry-text");

let isFormOpen = false,
  editingEntry = "";

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

function getCurrentDateTime() {
  const currentDate = new Date();

  const dateTime = {
    day: realDay(currentDate),
    month: realMonth(currentDate),
    dayNMonth: day + "/" + month,
    year: currentDate.getFullYear(),
    hour: realHour(currentDate),
    minute: realMinute(currentDate),
    hourNMinute: hour + ":" + minute,
  };

  return dateTime;
}

function getFormValues() {
  const formValues = {
    title: titleInput.value,
    note: notesInput.value,
  };

  return formValues;
}

function setEntrysCountInDay(dayAndMonth) {
  let numberInDay = 1;

  if (localStorage.getItem("entries") != null) {
    const entries = getData();
    entries.forEach((entry) => {
      if (entry.dayAndMonth == dayAndMonth) {
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
    alert("Por favor insira informação. O vazio não pode ser gravado.");
  }
}

function addEntry(e) {
  const entryText = getFormValues(),
    entryTime = getCurrentDateTime(),
    entryCount = setEntrysCountInDay(entryTime.dayNMonth);

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
    hour: entryTime.hour,
    minute: entryTime.minute,
    hourNMinute: entryTime.hourNMinute,
    count: entryCount,
    id: entryId,
  };

  saveEntry(entry);

  // console.log("addEntry - entry: " + entry);

  e.preventDefault();
  form.reset();
  toggleFormOpen();
  fetchEntries();
}

function editEntry(e) {
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

function fetchEntries() {
  // get data and where to display it
  const entries = getData();
  theEntries.innerHTML = "";

  let totalDays = 0; // number of days in which entries were made

  // prepare and display entries
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i];
    // get values from storage
    let title = entry.title,
      note = entry.note,
      date = entry.dayNMonth,
      year = entry.year,
      time = entry.hourNMinute,
      count = entry.count,
      id = entry.id;

    // get other entries with same date
    let otherEntriesWSameDate = entries.filter(
      // todo: check year too
      (otherEntry) => otherEntry.date == entry.date
    );

    const isOm = otherEntriesWSameDate.length > 1;

    // add date only before last entry in the day
    if (count == otherEntriesWSameDate.length) {
      theEntries.innerHTML += '<div class="day-info"></div>';
      // select the last day-info and add it to the totalDays count
      const dayInfo = theEntries.querySelectorAll(".day-info")[totalDays];
      totalDays++;

      dayInfo.innerHTML += `
        <div class="date">${date}<span class="year">/${year}</span></div>`;

      // add om symbol when there is more than one entry in this day
      if (isOm) {
        dayInfo.innerHTML += '<div class="om"><i class="fas fa-om"></i></div>';
      }
    }

    // inject HTML
    theEntries.insertAdjacentHTML(
      "beforeend",
      `<div class="entry">
        <div class="entry-header">
          <div class="entry-title">${title}</div>

          <div class="entry-buttons">
            <button class="edit-btn">
              <i class="ri-pencil-line"></i>
            </button>
            <button class="delete-btn">
              <i class="ri-close-line"></i>
            </button>
          </div>
        </div>
        
        <div class="entry-text">${note}</div>

        <div class="entry-infos">
          <div class="hour">${time}</div>

          <div class="number-in-the-day">${count}</div>
        </div>
     </div>`
    );

    // set buttons
    setDelete(entry);
    setEdit(entry);
  }

  // insert Om tooltip
  theEntries.insertAdjacentHTML(
    "beforeend",
    `<div id="om-tooltip">
        O símbolo Om é adquirido nos dias em que você medita 2 vezes ou mais.
    </div>`
  );

  setHabitStats();
  setOmTooltip();
  checkNoEntriesMessage();
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
