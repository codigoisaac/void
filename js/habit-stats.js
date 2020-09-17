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
    // hours

    // entries
    stat.entries++;

    // days
    if (entry.count == 1) {
      stat.days++;
    }

    const entryDay = entry.date.substring(0, 2); // get day

    // days 2x
    if (entry.count == 2) {
      stat.daysTwice++;
    }

    // day strike
    if (entryDay == previousEntryDay + 1) {
      strike++;
    }
    previousEntryDay = entryDay;
    stat.dayStrike = strike;

    // 2x day strike
  });

  // display >>

  // hours

  // entries
  entries.textContent = stat.entries;

  // days
  days.textContent = stat.days;

  // days 2x
  daysTwice.textContent = stat.daysTwice;

  // day strike
  dayStrike.textContent = stat.dayStrike;

  // 2x day strike
}
