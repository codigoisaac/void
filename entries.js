const addBtn = document.querySelector("#add-entry-btn");
addBtn.addEventListener("click", openForm);
const form = document.querySelector("#add-entry-form");

let isFormOpen = false;

function openForm() {
  isFormOpen = !isFormOpen;

  // display form
  // form.style.display = isFormOpen ? "block" : "none";
  // addBtn.textContent = isFormOpen ? "X" : "+";

  if (isFormOpen) {
    form.style.display = "block";
    addBtn.textContent = "X";
  } else {
    form.style.display = "none";
    addBtn.textContent = "+";
  }
}
