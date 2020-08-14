const addBtn = document.querySelector("#add-entry-btn");
addBtn.addEventListener("click", openForm);
const formDiv = document.querySelector("#add-entry");
const form = document.querySelector("#add-entry-form");
form.addEventListener("submit", addEntry);

let isFormOpen = false;

function openForm() {
  isFormOpen = !isFormOpen;

  // display form
  formDiv.style.display = isFormOpen ? "block" : "none";
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
    console.log("entries found");
    const entries = getData();
    entries.forEach((entry) => {
      if (entry.date == entryDate) {
        entryDayCount++;
      }
    });
  }

  // create entry obj
  let entry = {
    title: entryTitle,
    text: entryText,
    date: entryDate,
    year: entryYear,
    time: entryTime,
    count: entryDayCount,
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
  const entries = getData(),
    entryList = document.querySelector("#the-entries");

  // clean html before
  entryList.innerHTML = "";

  // insert html
  entries.forEach((entry) => {
    // save values from storage
    let title = entry.title,
      text = entry.text,
      date = entry.date,
      year = entry.year,
      time = entry.time,
      count = entry.count;

    // add day info only before first entry in the day
    if (count == 1) {
      entryList.innerHTML += `
        <div class="day">
          <div class="info-day">
            <div class="date">${date}<span class="year">/${year}</span></div>
          </div>
        </div>`;
    }

    entryList.innerHTML += `
      <div class="entry">
        <div class="entry-title">${title}</div>

        <div class="entry-text">${text}</div>

        <div class="entry-infos">
          <div class="hour">${time}</div>

          <div class="number-in-the-day">${count}</div>
        </div>
      </div>`;
  });
}

function getData() {
  return JSON.parse(localStorage.getItem("entries"));
}

// ``
