const addBtn = document.querySelector("#open-form-btn");
addBtn.addEventListener("click", openForm);
const form = document.querySelector("#add-entry-form");
form.addEventListener("submit", () => {
  // adding new / editing entry
  editingEntry == "" ? addEntry() : editEntry();
});

const titleInput = document.querySelector("#add-entry-title");
const notesInput = document.querySelector("#add-entry-text");

let isFormOpen = false;
let editingEntry = "";

function openForm() {
  isFormOpen = !isFormOpen;

  // display form
  form.style.display = isFormOpen ? "flex" : "none";
  addBtn.textContent = isFormOpen ? "X" : "+";

  // focus when open
  isFormOpen ? titleInput.focus() : null;
}

function addEntry(e) {
  // get values from form
  const entryTitle = titleInput.value,
    entryText = notesInput.value;
  // get date info
  const date = new Date(),
    // add '0' in front of day
    entryDay = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
    // add '0' in front of month
    entryMonth =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1,
    entryDate = entryDay + "/" + entryMonth,
    entryYear = date.getFullYear(),
    // get time info // add '0's
    entryHour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
    entryMinute =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
    entryTime = entryHour + ":" + entryMinute;
  // count in the day
  let entryDayCount = 1;
  if (localStorage.getItem("entries") != null) {
    const entries = getData();
    entries.forEach((entry) => {
      if (entry.date == entryDate) {
        entryDayCount++;
      }
    });
  }
  // add entry id
  let entryId = chance.guid();

  // create entry obj
  let entry = {
    title: entryTitle,
    text: entryText,
    date: entryDate,
    year: entryYear,
    time: entryTime,
    count: entryDayCount,
    id: entryId,
  };

  // save
  // if form is not empty
  if (entryTitle != "" || entryText != "") {
    // if storage has no entries
    if (localStorage.getItem("entries") == null) {
      let entries = [];
      entries.push(entry);
      localStorage.setItem("entries", JSON.stringify(entries));
    } else {
      let entries = JSON.parse(localStorage.getItem("entries"));
      entries.push(entry);
      localStorage.setItem("entries", JSON.stringify(entries));
    }
  } else {
    alert("Por favor insira informação. Silêncio não pode ser gravado.");
  }

  e.preventDefault();

  form.reset();

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
  const entryList = document.querySelector("#the-entries");

  entryList.innerHTML = "";

  let totalDays = 0; // number of days in which entries were made

  // Display entries
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i];
    // get values from storage
    let title = entry.title,
      text = entry.text,
      date = entry.date,
      year = entry.year,
      time = entry.time,
      count = entry.count,
      id = entry.id;

    // get other entries with same date
    let entriesInDay = entries.filter(
      (otherEntry) => otherEntry.date == entry.date
    );

    const isOm = entriesInDay.length > 1;

    // add date only before last entry in the day
    if (count == entriesInDay.length) {
      entryList.innerHTML += '<div class="day-info"></div>';
      // select the last day-info and add it to the totalDays count
      const dayInfo = entryList.querySelectorAll(".day-info")[totalDays];
      totalDays++;

      dayInfo.innerHTML += `
        <div class="date">${date}<span class="year">/${year}</span></div>`;

      // add om symbol when there is more than one entry in this day
      if (isOm) {
        dayInfo.innerHTML += '<div class="om"><i class="fas fa-om"></i></div>';
      }
    }

    // inject HTML
    entryList.insertAdjacentHTML(
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
        
        <div class="entry-text">${text}</div>

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

  // insert tooltip for Om buttons
  entryList.insertAdjacentHTML(
    "beforeend",
    `<div id="om-tooltip">
        O símbolo Om é adquirido nos dias em que você medita 2 vezes ou mais.
    </div>`
  );

  setHabitStats();
  setOmTooltip();
}

function setDelete(entry) {
  const docEntries = [...document.querySelectorAll(".entry")];
  const docEntry = docEntries[docEntries.length - 1]; // last item
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
      entries = resetEntriesDayCount(entries);

      // save again
      localStorage.setItem("entries", JSON.stringify(entries));
      fetchEntries();
    }
  });
}

function setEdit(entry) {
  const docEntries = [...document.querySelectorAll(".entry")];
  const docEntry = docEntries[docEntries.length - 1]; // last item
  // handle form
  const editBtn = docEntry.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    isFormOpen ? null : openForm();
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

function resetEntriesDayCount(entries) {
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
const theEntries = document.querySelector("#the-entries");
const entryControls = document.querySelector("#entry-controls");
const entriesHeader = document.querySelector("#entries-header");
entriesHeader.addEventListener("click", () => {
  if (screen.width < 1024) {
    // entries hideable only for mobile
    toggleShowEntries();
  }
});
let isEntriesShown = true;

function toggleShowEntries() {
  isEntriesShown = !isEntriesShown;
  if (isEntriesShown) {
    theEntries.classList.remove("hide");
    entryControls.classList.remove("entries-hidden");
  } else {
    theEntries.classList.add("hide");
    entryControls.classList.add("entries-hidden");
  }
}

// erase "tap to minimize" tip
function eraseTip() {
  const tip = document.querySelector("#entries-header span");
  tip.style.opacity = 0;
}

// show/hide Om tooltip
let showOmTooltip = false;
function setOmTooltip() {
  const oms = document.querySelectorAll(".om");
  const omTooltip = document.querySelector("#om-tooltip");
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

// ``
