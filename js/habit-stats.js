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
  let didIhad2PlusYesterday = false;
  let twoPlusStrike = 0;

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
    } else {
      strike = 1; // strike fail
    }
    previousEntryDay = entryDay;
    stat.dayStrike = strike;

    // 2x day strike
    if (entry.count == 2) {
      // this day is a 2x day
      console.log("this day is a 2x day", entry);
      if (didIhad2PlusYesterday) {
        // the last day i had 2plus
        console.log("the last day i had 2plus", entry);
        twoPlusStrike++;
      } else {
        // turn it true for tomorrow
        didIhad2PlusYesterday = true;
      }
    } else if (entry.count < 2) {
      // im the first entry in a day
      console.log("im the first entry in a day", entry);
      const nextEntry = savedEntries[savedEntries.indexOf(entry) + 1];
      console.log({ nextEntery: nextEntry });
      if (nextEntry.count != 2) {
        // ...and there is no second entry in this day
        console.log("...and there is no second entry in this day");
        didIhad2PlusYesterday = false; // turn it false for tomorrow
        twoPlusStrike = 0; // 2+ strike fail
      }
    }
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
