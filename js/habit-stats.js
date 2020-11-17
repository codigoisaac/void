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

function calculateDayStrike(stat) {
  let previousEntryDay = 0, //
    previousEntryMonth = 0,
    previousEntryYear = 0,
    strike = 1,
    entries = getData();

  entries.forEach((entry) => {
    const currentEntryDay = parseInt(entry.date.substring(0, 2)), // get day
      currentEntryMonth = parseInt(entry.date.substring(3, 5)), // get month
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
    previousEntryYear = entry.year;
    stat.dayStrike = strike;
  });

  checkStrikeFail(stat);

  return stat;
}

function checkStrikeFail(stat) {
  //* fail the strike if there's no entry for more than a day
  // get current date
  const date = new Date(),
    curDay = date.getDate(),
    curMonth = date.getMonth() + 1,
    curYear = date.getFullYear();

  // get last entry's date
  const entries = getData(),
    lastEntry = entries[entries.length - 1],
    lastEntryDay = parseInt(lastEntry.date.substring(0, 2)),
    lastEntryMonth = parseInt(lastEntry.date.substring(3, 5)),
    lastEntryYear = lastEntry.year;

  //TODO: this alg

  if (lastEntryMonth == curMonth) {
    // in the same month
    if (lastEntryDay + 1 < curDay) {
      // fail strikes
      stat.dayStrike = 0;
      stat.doubleStrike = 0;
    }
  } else if (curMonth == lastEntryMonth + 1) {
    const daysInLastEntrysMonth = daysInMonth(lastEntryMonth, lastEntryYear);
    if (lastEntryDay == daysInLastEntrysMonth && curDay == 1) {
    }
  }
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

function daysInMonth(month, year) {
  return 32 - new Date(year, month - 1, 32).getDate();
}
