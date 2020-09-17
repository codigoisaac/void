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

  let previousEntryDay = 0;
  let strike = 1;

  savedEntries.forEach((entry) => {
    stat.entries++;

    // days
    if (entry.count == 1) {
      stat.days++;
    }

    // days 2x
    if (entry.count > 1) {
      stat.daysTwice++;
    }

    // day strike
    const entryDay = entry.date.substring(0, 2); // get day
    if (entryDay == previousEntryDay + 1) {
      strike++;
    }
    previousEntryDay = entryDay;
    stat.dayStrike = strike;
  });

  // display >>

  // entries
  entries.textContent = stat.entries;

  // days
  days.textContent = stat.days;

  // days twice
  daysTwice.textContent = stat.daysTwice;

  // day strike
  dayStrike.textContent = stat.dayStrike;
}
