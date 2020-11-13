function setHabitStats() {
  //
  let stat = {
    entries: 0,
    days: 0,
    doubleDays: 0,
    dayStrike: 0,
    doubleStrike: 0,
  };

  let didIhad2PlusYesterday = false,
    entries = getData();

  entries.forEach((entry) => {
    // entries count
    stat.entries++;

    // days
    if (entry.count == 1) {
      stat.days++;
    }

    // days 2x
    if (entry.count == 2) {
      stat.doubleDays++;
    }

    // day strike
    stat = calculateDayStrike(stat);

    // 2x day strike
    if (entry.count == 2) {
      // this day is a 2x day
      if (didIhad2PlusYesterday) {
        // the last day i had 2plus meditations
        stat.doubleStrike++;
      } else {
        // turn it true for tomorrow
        didIhad2PlusYesterday = true;
        stat.doubleStrike = 1;
      }
    } else if (entry.count == 1) {
      // first entry in a day
      if (entries.indexOf(entry) != entries.length - 1) {
        // if there is a next entry
        let nextEntry = entries[entries.indexOf(entry) + 1];
        if (nextEntry.count != 2) {
          // ...and the next entry is not today
          stat.doubleStrike = 0; // 2+ strike fail
          didIhad2PlusYesterday = false; // turn it false for tomorrow
        }
      }
    }
  });

  displayStats(stat);
}

function displayStats(stat) {
  const entriesDisplay = document.querySelector("#meditation-count > .stat"),
    daysDisplay = document.querySelector("#days-meditated > .stat"),
    doubleDaysDisplay = document.querySelector("#days-meditated-twice > .stat"),
    dayStrikeDisplay = document.querySelector("#day-strike > .stat"),
    doubleStrikeDisplay = document.querySelector("#twice-day-strike > .stat");

  // 2x day strike
  doubleStrikeDisplay.textContent = stat.doubleStrike;
  // day strike
  dayStrikeDisplay.textContent = stat.dayStrike;
  // entries
  entriesDisplay.textContent = stat.entries;
  // days 2x
  doubleDaysDisplay.textContent = stat.doubleDays;
  // days
  daysDisplay.textContent = stat.days;
}

function calculateDayStrike(stat) {
  let prevEntryD = 0, // prev: previous
    prevEntryM = 0,
    prevEntryY = 0,
    strike = 1,
    entries = getData();

  entries.forEach((entry) => {
    const entryDay = parseInt(entry.date.substring(0, 2)), // get day
      entryMonth = parseInt(entry.date.substring(3, 5)); // get month

    if (entryDay != prevEntryD) {
      // not the same day
      if (entryMonth == prevEntryM) {
        // same month
        if (prevEntryD + 1 == entryDay) {
          // one day ahead
          strike++;
        } else {
          strike = 1; // strike fail
        }
      } else {
        // not the same month
        if (entryDay == 1) {
          // current entry is day 1
          const lastDayInPrevEntryMonth = daysInMonth(prevEntryM, prevEntryY);
          if (prevEntryD == lastDayInPrevEntryMonth) {
            // previous entry day is the last of it's month
            strike++;
          } else {
            strike = 1; // strike fail
          }
        } else {
          strike = 1; // strike fail
        }
      }

      prevEntryD = entryDay;
      prevEntryM = entryMonth;
      prevEntryY = entry.year;
      stat.dayStrike = strike;
    }
  });

  return stat;
}

function daysInMonth(month, year) {
  return 32 - new Date(year, month - 1, 32).getDate();
}
