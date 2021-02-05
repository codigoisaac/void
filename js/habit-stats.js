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
  stat_DayStrike();
  stat_DaysMeditatedTwice();
  stat_DaysMeditatedTwiceStrike();

  // check strikes fail - according to current date
  // checkStrikesFail();

  displayStats();
}

// meditações
function stat_Meditations() {
  stat.entries = 0;
  getData().forEach((entry) => {
    stat.entries++;
  });
}

// dias meditados 2x
function stat_DaysMeditatedTwice() {
  stat.doubleDays = 0;
  getData().forEach((entry) => {
    if (entry.count == 2) {
      stat.doubleDays++;
    }
  });
}

// dias meditados
function stat_DaysMeditated() {
  stat.days = 0;
  getData().forEach((entry) => {
    if (entry.count == 1) {
      stat.days++;
    }
  });
}

// dias meditados em seguida
function stat_DayStrike() {
  let strike = 1;

  const firsts = getData().filter((e) => e.count == 1);

  let prev = {
    // previous entry
    day: 0,
    month: 0,
    year: 0,
  };

  //* calculate day strike
  for (let i = firsts.length - 1; i >= 0; i--) {
    const cur = firsts[i]; // current entry

    if (prev.year == cur.year) {
      if (prev.month == cur.month && prev.day == cur.day - 1) {
        strike++;
      } else if (
        prev.month == cur.month - 1 &&
        prev.day == daysInMonth(prev.month, prev.year) &&
        cur.day == 1
      ) {
        strike++;
      } else {
        strike = 1;
      }
    } else if (
      prev.year == cur.year - 1 &&
      prev.month == 12 &&
      prev.day == daysInMonth(prev.month, prev.year) &&
      cur.month == 1 &&
      cur.day == 1
    ) {
      strike++;
    } else {
      strike = 1;
    }

    //
    prev.day = cur.day;
    prev.month = cur.month;
    prev.year = cur.year;
  }

  stat.dayStrike = strike;
  console.log(stat.dayStrike);
}

//todo: dias meditados 2x em seguida
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

//todo: fix
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

export { daysInMonth, setHabitStats };
