// Times of day written "HH:MM" (same idea as app/models/wall_clock.rb).
//
//   plannerClock.minutes("09:30")  // => 570   (null if not a valid time)
//   plannerClock.clock(570)        // => "09:30"
//
// Loaded before the calendar scripts that use it.
(function () {
  const PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

  window.plannerClock = {
    minutes: function (clock) {
      const match = PATTERN.exec(clock || "");
      return match ? Number(match[1]) * 60 + Number(match[2]) : null;
    },

    clock: function (totalMinutes) {
      return String(Math.floor(totalMinutes / 60)).padStart(2, "0") + ":" +
        String(totalMinutes % 60).padStart(2, "0");
    }
  };
})();
