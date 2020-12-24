let stat = {
    entries: 0,
    days: 0,
    doubleDays: 0,
    dayStrike: 0,
    doubleStrike: 0,
  },
  had2PlusYesterday = false;

function setHabitStats() {
  // set stats
  stat_Meditations();
  stat_DaysMeditated();
  stat_DaysMeditatedStrike();
  stat_DaysMeditatedTwice();
  stat_DaysMeditatedTwiceStrike();

  // check strikes fail - according to current date
  checkStrikesFail();

  displayStats();
}

function stat_Meditations() {
  stat.entries = 0;
  getData().forEach((entry) => {
    stat.entries++;
  });
}

function stat_DaysMeditated() {
  stat.days = 0;
  getData().forEach((entry) => {
    if (entry.count == 1) {
      stat.days++;
    }
  });
}

function stat_DaysMeditatedStrike() {
  let strike = 1;

  let previousEntry = {
    day: 0,
    month: 0,
    year: 0,
  };

  getData().forEach((currentEntry) => {
    //* calculation
    if (currentEntry.day != previousEntry.day) {
      // different day
      if (currentEntry.month == previousEntry.month) {
        // same month
        if (currentEntry.year == previousEntry.year) {
          // same year
          if (previousEntry.day + 1 == currentEntry.day) {
            // 1 day difference
            strike++; // increase strike
          } else {
            // more than 1 day difference
            strike = 1; // fail strike
          }
        } else {
          // same month and
          // different year
          strike = 1; // fail strike
        }
      } else {
        // different day and
        // different month
        if (currentEntry.year == previousEntry.year) {
          // same year
          if (currentEntry.month == previousEntry.month + 1) {
            // 1 month difference

            // get number of days in previuous entry's month
            const daysInPrevEntrysMonth = daysInMonth(
              previousEntry.month,
              previousEntry.year
            );
            if (
              previousEntry.day == daysInPrevEntrysMonth &&
              currentEntry.day == 1
            ) {
              // previous entry is in last day of its month and
              // current entry is in first day of its month
              strike++; // increase strike
            } else {
              strike = 1; // fail strike
            }
          } else {
            // more than 1 month difference
            strike = 1; // fail strike
          }
        } else {
          // different day,
          // different month and
          // different year
          if (previousEntry.month == 12 && currentEntry.month == 1) {
            // from December to January

            // get number of days in previuous entry's month
            const daysInPrevEntrysMonth = daysInMonth(
              previousEntry.month,
              previousEntry.year
            );
            if (
              previousEntry.day == daysInPrevEntrysMonth &&
              currentEntry.day == 1
            ) {
              // previous entry is in last day of December and
              // current entry is in first day of January
              strike++; // increase strike
            } else {
              strike = 1; // fail strike
            }
          } else {
            // not from December to January
            strike = 1; // fail strike
          }
        }
      }
    } else {
      // same day number
      if (
        currentEntry.month != previousEntry.month ||
        currentEntry.year != previousEntry.year
      ) {
        // different month or
        // different year
        strike = 1; // fail strike
      }
    }

    previousEntry.day = currentEntry.day;
    previousEntry.month = currentEntry.month;
    previousEntry.year = currentEntry.year;
    stat.dayStrike = strike;
  });
}

function stat_DaysMeditatedTwice() {
  stat.doubleDays = 0;
  getData().forEach((entry) => {
    if (entry.count == 2) {
      stat.doubleDays++;
    }
  });
}

function stat_DaysMeditatedTwiceStrike() {
  let entries = getData();
  entries.forEach((entry) => {
    if (entry.count == 2) {
      // this day is a 2x day
      if (had2PlusYesterday) {
        // the last day i had 2plus meditations
        stat.doubleStrike++; // increase strike
      } else {
        // turn it true for tomorrow
        had2PlusYesterday = true;
        stat.doubleStrike = 1; // start/restart strike
      }
    } else if (entry.count == 1) {
      // first entry in a day
      if (entries.indexOf(entry) != entries.length - 1) {
        // if this is not the last entry in the array - there is a next entry
        let nextEntry = entries[entries.indexOf(entry) + 1];
        if (nextEntry.count != 2) {
          // ...and the next entry is not today
          stat.doubleStrike = 0; // fail strike
          had2PlusYesterday = false; // turn it false for tomorrow
        }
      }
    }
  });
}

function checkStrikesFail() {
  //* fail the strikes if there's no entry for more than a day
  // get current date
  const date = new Date(),
    currentDay = date.getDate(),
    currentMonth = date.getMonth() + 1,
    currentYear = date.getFullYear();

  // get last entry's date
  const entries = getData(),
    lastEntry = entries[entries.length - 1],
    lastEntrysDay = lastEntry.day,
    lastEntrysMonth = lastEntry.month,
    lastEntrysYear = lastEntry.year;

  //* calculation
  if (currentYear != lastEntrysYear) {
    // different year
    if (!(currentMonth == 1 && lastEntrysMonth == 12)) {
      // not December / January
      // fail strikes
      stat.dayStrike = 0;
      stat.doubleStrike = 0;
    } else {
      // is December / January
      const daysInLastEntrysMonth = daysInMonth(currentMonth, currentYear);
      if (!(currentDay == 1 && lastEntrysDay == daysInLastEntrysMonth)) {
        // not last / first day
        // fail strikes
        stat.dayStrike = 0;
        stat.doubleStrike = 0;
      }
    }
  } else {
    // same year
    if (currentMonth != lastEntrysMonth) {
      // different month
      if (currentMonth == lastEntrysMonth + 1) {
        // 1 month apart
        const daysInLastEntrysMonth = daysInMonth(
          lastEntrysMonth,
          lastEntrysYear
        );
        if (!(lastEntrysDays == daysInLastEntrysMonth && currentDay == 1)) {
          // not last / first day
          // fail strikes
          stat.dayStrike = 0;
          stat.doubleStrike = 0;
        }
      } else {
        // more than 1 month apart
        // fail strikes
        stat.dayStrike = 0;
        stat.doubleStrike = 0;
      }
    } else {
      // same month
      if (currentDay > lastEntrysDay + 1) {
        // more than 1 day apart
        // fail strikes
        stat.dayStrike = 0;
        stat.doubleStrike = 0;
      }
    }
  }
}

function displayStats() {
  const entriesDisplay = document.querySelector("#meditation-count > .stat"),
    daysDisplay = document.querySelector("#days-meditated > .stat"),
    doubleDaysDisplay = document.querySelector("#days-meditated-twice > .stat"),
    dayStrikeDisplay = document.querySelector("#day-strike > .stat"),
    doubleStrikeDisplay = document.querySelector("#twice-day-strike > .stat");

  // 2x day strike
  doubleStrikeDisplay.textContent = stat.doubleStrike;
  // day strike
  dayStrikeDisplay.textContent = stat.dayStrike;

  // meditations
  entriesDisplay.textContent = stat.entries;
  // days meditated 2x
  doubleDaysDisplay.textContent = stat.doubleDays;
  // days meditated
  daysDisplay.textContent = stat.days;
}

function daysInMonth(month, year) {
  return 32 - new Date(year, month - 1, 32).getDate();
}
