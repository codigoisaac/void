const hours = document.querySelector("#hours-meditated > .stat"),
  entries = document.querySelector("#meditations-recorded > .stat"),
  days = document.querySelector("#days-meditated > .stat"),
  daysTwice = document.querySelector("#days-meditated-twice > .stat"),
  dayStrike = document.querySelector("#day-strike > .stat"),
  dayTwiceStrike = document.querySelector("#twice-day-strike > .stat");

function setHabitStats() {
  const savedEntries = getData();

  let stat = {
    time: "00:00",
    entries: 0,
    days: 0,
    daysTwice: 0,
    dayStrike: 0,
    dayTwiceStrike: 0,
  };

  savedEntries.forEach((entry) => {
    stat.entries++;

    // nuber of days
    if (entry.count == 1) {
      stat.days++;
    }

    if (entry.count > 1) {
      stat.daysTwice++;
    }
  });

  // display >>

  // entries
  entries.textContent = stat.entries;

  // days
  days.textContent = stat.days;

  // days twice
  daysTwice.textContent = stat.daysTwice;
}
