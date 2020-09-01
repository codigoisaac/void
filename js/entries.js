const addBtn = document.querySelector("#add-entry-btn");
addBtn.addEventListener("click", openForm);
const form = document.querySelector("#add-entry-form");
form.addEventListener("submit", addEntry);

const titleInput = document.querySelector("#add-entry-title");
const notesInput = document.querySelector("#add-entry-text");

let isFormOpen = false;
let editingEntry = "";

function openForm() {
  isFormOpen = !isFormOpen;

  // display form
  form.style.display = isFormOpen ? "flex" : "none";
  addBtn.textContent = isFormOpen ? "X" : "+";
}

function addEntry(e) {
  // get values from form
  const entryTitle = document.querySelector("#add-entry-title").value,
    entryText = document.querySelector("#add-entry-text").value;
  // get date info
  const date = new Date(),
    entryDay = date.getDate(),
    entryMonth = // add '0' in front of month
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
  // if not empty
  if (entryTitle != "" || entryText != "") {
    // check storage
    if (localStorage.getItem("entries") == null) {
      // create item
      let entries = [];
      entries.push(entry);
      localStorage.setItem("entries", JSON.stringify(entries));
    } else {
      let entries = JSON.parse(localStorage.getItem("entries"));
      entries.push(entry);
      localStorage.setItem("entries", JSON.stringify(entries));
    }
  } else {
    alert("silence can not be recorded.");
  }

  e.preventDefault();

  form.reset();

  fetchEntries();
}

function fetchEntries() {
  // get data and where to display it
  const entries = getData();
  const entryList = document.querySelector("#the-entries");

  entryList.innerHTML = "";

  // insert html
  entries.forEach((entry) => {
    // save values from storage
    let title = entry.title,
      text = entry.text,
      date = entry.date,
      year = entry.year,
      time = entry.time,
      count = entry.count,
      id = entry.id;

    // test if there is other entries with same date
    let entriesInDay = entries.filter(
      (otherEntry) => otherEntry.date == entry.date
    );

    let days = 0;
    const isOm = entriesInDay.length >= 2;

    // add date only before first entry in the day
    if (count == 1) {
      entryList.innerHTML += '<div class="day-info"></div>';
      const dayInfo = entryList.querySelectorAll(".day-info")[days];
      days++;

      dayInfo.innerHTML += `
        <div class="date">${date}<span class="year">/${year}</span></div>`;

      // add om symbol when more than one entry in this day
      if (isOm) {
        dayInfo.innerHTML += '<div class="om"><i class="fas fa-om"></i></div>';
      }
    }

    // inject HTML
    entryList.insertAdjacentHTML(
      "beforeend",
      `<div class="entry">
        <div class="entry-buttons">
          <button class="edit-btn">
            <i class="ri-pencil-line"></i>
          </button>
          <button class="delete-btn">
            <i class="ri-close-line"></i>
          </button>
        </div>

        <div class="entry-title">${title}</div>

        <div class="entry-text">${text}</div>

        <div class="entry-infos">
          <div class="hour">${time}</div>

          <div class="number-in-the-day">${count}</div>
        </div>
     </div>`
    );

    // set buttons
    setDeleteButton(entry);
    setEditButton(entry);
  });
}

function setDeleteButton(entry) {
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
      const entries = getData();
      entries.forEach((thisEntry) => {
        if (thisEntry.id == entry.id) {
          entries.splice(entries.indexOf(thisEntry), 1);
        }
      });
      // save again
      localStorage.setItem("entries", JSON.stringify(entries));
      fetchEntries();
    }
  });
}

function setEditButton(entry) {
  const pageEntries = [...document.querySelectorAll(".entry")];
  const thisEntry = pageEntries[pageEntries.length - 1]; // last item
  // handle form
  const editBtn = thisEntry.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    isFormOpen ? null : openForm();
    if (
      (titleInput.value == "" && notesInput.value == "") ||
      (titleInput.value == entry.title && notesInput.value == entry.text)
    ) {
      // overwrite values if form is empty or equal to entry
      overwriteForm(entry);
    } else {
      if (
        confirm(
          `Para editar você precisa usar o formulário.\nSobrescrever dados do formulário?`
        )
      ) {
        // overwrite values if user accepts to
        overwriteForm(entry);
      }
    }
  });
}

function overwriteForm(entry) {
  titleInput.value = entry.title;
  notesInput.value = entry.text;
  editingEntry = entry.id;
}

function getData() {
  return JSON.parse(localStorage.getItem("entries"));
}

// ``
