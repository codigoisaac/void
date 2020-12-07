let stat = {
    entries: 0,
    days: 0,
    doubleDays: 0,
    dayStrike: 0,
    doubleStrike: 0,
  },
  had2PlusYesterday = false;

function setHabitStats() {
  stat_Meditations();
  stat_DaysMeditated();
  stat_DaysMeditatedStrike();
  stat_DaysMeditatedTwice();
  stat_DaysMeditatedTwiceStrike();

  // check strikes fail
  stat = checkStrikesFail(stat);

  displayStats();
}

function stat_Meditations() {
  entries = getData();
  entries.forEach((entry) => {
    stat.entries++;
  });
}

function stat_DaysMeditated() {
  getData().forEach((entry) => {
    if (entry.count == 1) {
      stat.days++;
    }
  });
}

function stat_DaysMeditatedStrike() {
  let previousEntryDay = 0,
    previousEntryMonth = 0,
    previousEntryYear = 0,
    strike = 1;

  getData().forEach((entry) => {
    const currentEntryDay = entry.day,
      currentEntryMonth = entry.month,
      currentEntryYear = entry.year;

    //* calculation
    if (currentEntryDay != previousEntryDay) {
      // different day
      if (currentEntryMonth == previousEntryMonth) {
        // same month
        if (currentEntryYear == previousEntryYear) {
          // same year
          if (previousEntryDay + 1 == currentEntryDay) {
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
        if (currentEntryYear == previousEntryYear) {
          // same year
          if (currentEntryMonth == previousEntryMonth + 1) {
            // 1 month difference

            // get number of days in previuous entry's month
            const daysInPrevEntrysMonth = daysInMonth(
              previousEntryMonth,
              previousEntryYear
            );
            if (
              previousEntryDay == daysInPrevEntrysMonth &&
              currentEntryDay == 1
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
          if (previousEntryMonth == 12 && currentEntryMonth == 1) {
            // from December to January

            // get number of days in previuous entry's month
            const daysInPrevEntrysMonth = daysInMonth(
              previousEntryMonth,
              previousEntryYear
            );
            if (
              previousEntryDay == daysInPrevEntrysMonth &&
              currentEntryDay == 1
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
        currentEntryMonth != previousEntryMonth ||
        currentEntryYear != previousEntryYear
      ) {
        // different month or
        // different year
        strike = 1; // fail strike
      }
    }

    previousEntryDay = currentEntryDay;
    previousEntryMonth = currentEntryMonth;
    previousEntryYear = currentEntryYear;
    stat.dayStrike = strike;
  });
}

function stat_DaysMeditatedTwice() {
  getData().forEach((entry) => {
    if (entry.count == 2) {
      stat.doubleDays++;
    }
  });
}

function stat_DaysMeditatedTwiceStrike() {
  getData().forEach((entry) => {
    if (entry.count == 2) {
      // this day is a 2x day
      if (had2PlusYesterday) {
        // the last day i had 2plus meditations
        stat.doubleStrike++; // increase strike
      } else {
        // turn it true for tomorrow
        had2PlusYesterday = true;
        stat.doubleStrike = 1; // fail strike
      }
    } else if (entry.count == 1) {
      // first entry in a day
      if (getData().indexOf(entry) != getData().length - 1) {
        // if there is a next entry
        let nextEntry = getData()[getData().indexOf(entry) + 1];
        if (nextEntry.count != 2) {
          // ...and the next entry is not today
          stat.doubleStrike = 0; // fail strike
          had2PlusYesterday = false; // turn it false for tomorrow
        }
      }
    }
  });
}

// function calculateDoubleDayStrike(stat) {}

function checkStrikesFail(stat) {
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

  return stat;
}

function displayStats() {
  const entriesDisplay = document.querySelector("#meditation-count > .stat"),
    daysDisplay = document.querySelector("#days-meditated > .stat"),
    doubleDaysDisplay = document.querySelector("#days-meditated-twice > .stat"),
    dayStrikeDisplay = document.querySelector("#day-strike > .stat"),
    doubleStrikeDisplay = document.querySelector("#twice-day-strike > .stat");

  console.log(stat);

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

function daysInMonth(month, year) {
  return 32 - new Date(year, month - 1, 32).getDate();
}
