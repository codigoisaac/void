const entriesDisplay = document.querySelector("#meditations-recorded > .stat"),
  daysDisplay = document.querySelector("#days-meditated > .stat"),
  doubleDaysDisplay = document.querySelector("#days-meditated-twice > .stat"),
  dayStrikeDisplay = document.querySelector("#day-strike > .stat"),
  doubleStrikeDisplay = document.querySelector("#twice-day-strike > .stat");

function setHabitStats() {
  const savedEntries = getData();

  let stat = {
    entries: 0,
    days: 0,
    doubleDays: 0,
    dayStrike: 0,
    doubleStrike: 0,
  };

  let previousEntryDay = 0;
  let strike = 1;
  let didIhad2PlusYesterday = false;

  savedEntries.forEach((entry) => {
    // entries
    stat.entries++;

    // days
    if (entry.count == 1) {
      stat.days++;
    }

    // days 2x
    if (entry.count == 2) {
      stat.doubleDays++;
    }

    const entryDay = parseInt(entry.date.substring(0, 2)); // get day

    // day strike
    if (entryDay != previousEntryDay) {
      if (previousEntryDay + 1 == entryDay) {
        strike++;
      } else {
        strike = 1; // strike fail
      }
      previousEntryDay = entryDay;
      stat.dayStrike = strike;
    }

    // 2x day strike
    if (entry.count == 2) {
      // this day is a 2x day
      if (didIhad2PlusYesterday) {
        // the last day i had 2plus
        stat.doubleStrike++;
      } else {
        // turn it true for tomorrow
        didIhad2PlusYesterday = true;
        stat.doubleStrike = 1;
      }
    } else if (entry.count == 1) {
      // first entry in a day
      if (savedEntries.indexOf(entry) != savedEntries.length - 1) {
        // if there is a next entry
        let nextEntry = savedEntries[savedEntries.indexOf(entry) + 1];
        if (nextEntry.count != 2) {
          // ...and the next entry is not today
          stat.doubleStrike = 0; // 2+ strike fail
          didIhad2PlusYesterday = false; // turn it false for tomorrow
        }
      }
    }
  });

  // display >>
  // entries
  entriesDisplay.textContent = stat.entries;
  // days
  daysDisplay.textContent = stat.days;
  // days 2x
  doubleDaysDisplay.textContent = stat.doubleDays;
  // day strike
  dayStrikeDisplay.textContent = stat.dayStrike;
  // 2x day strike
  doubleStrikeDisplay.textContent = stat.doubleStrike;
}
