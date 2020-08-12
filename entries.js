const addBtn = document.querySelector("#add-entry-btn");
addBtn.addEventListener("click", openForm);
const form = document.querySelector("#add-entry-form");
form.addEventListener("submit", addEntry);

let isFormOpen = false;

function openForm() {
  isFormOpen = !isFormOpen;

  // display form
  form.style.display = isFormOpen ? "block" : "none";
  addBtn.textContent = isFormOpen ? "X" : "+";

  // if (isFormOpen) {
  //   form.style.display = "block";
  //   addBtn.textContent = "X";
  // } else {
  //   form.style.display = "none";
  //   addBtn.textContent = "+";
  // }
}

function addEntry(e) {
  // get values from form
  const entryTitle = document.querySelector("#add-entry-title").value,
    entryText = document.querySelector("#add-entry-text").value;

  // create entry obj
  let entry = {
    title: entryTitle,
    text: entryText,
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
      text = entry.text;

    entryList.innerHTML += "";
  });
}

function getData() {
  return JSON.parse(localStorage.getItem("entries"));
}
