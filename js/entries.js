const addBtn = document.querySelector("#add-entry-btn");
addBtn.addEventListener("click", openForm);
const form = document.querySelector("#add-entry-form");
form.addEventListener("submit", addEntry);

let isFormOpen = false;

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

function deleteEntry(id) {
  const entries = getData();

  // delete entry with given id
  entries.forEach((entry) => {
    entry.id == id ? entries.splice(entries.indexOf(entry), 1) : null;
  });

  // save again
  localStorage.setItem("entries", JSON.stringify(entries));

  fetchEntries();
}

function fetchEntries() {
  // get data and where to display it
  const entries = getData(),
    entryList = document.querySelector("#the-entries");

  // clean html before
  entryList.innerHTML = "";

  let days = 0;

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
          <button class="edit-btn">E</button>
          <button class="delete-btn" onclick="deleteEntry('${id}')">D</button>
        </div>

        <div class="entry-title">${title}</div>

        <div class="entry-text">${text}</div>

        <div class="entry-infos">
          <div class="hour">${time}</div>

          <div class="number-in-the-day">${count}</div>
        </div>
     </div>`
    );
  }); // end of foreach
} // end of fetchEntries()

function getData() {
  return JSON.parse(localStorage.getItem("entries"));
}

// ``
