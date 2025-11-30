import { useState, useEffect, useMemo } from "react";
import AppLayout from "../layouts/AppLayout";

const HOLIDAYS = {
  2025: [
    { date: "2025-01-01", title: "New Year's Day" },
    { date: "2025-01-26", title: "Republic Day" },
    { date: "2025-03-29", title: "Holi" },
    { date: "2025-08-15", title: "Independence Day" },
    { date: "2025-10-24", title: "Diwali" },
    { date: "2025-12-25", title: "Christmas" },
  ],
  2026: [
    { date: "2026-01-01", title: "New Year's Day" },
    { date: "2026-01-26", title: "Republic Day" },
    { date: "2026-03-17", title: "Holi" },
    { date: "2026-08-15", title: "Independence Day" },
    { date: "2026-11-08", title: "Diwali" },
    { date: "2026-12-25", title: "Christmas" },
  ],
};

export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("calendar_events");
    return saved ? JSON.parse(saved) : [];
  });

  const [newEvent, setNewEvent] = useState({ title: "", date: "" });

  useEffect(() => {
    localStorage.setItem("calendar_events", JSON.stringify(events));
  }, [events]);

  // Calendar grid generation
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const weeks = [];
  let currentDay = 1 - firstDay;

  while (currentDay <= daysInMonth) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDay);
      currentDay++;
    }
    weeks.push(week);
  }

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    setEvents([...events, newEvent]);
    setNewEvent({ title: "", date: "" });
  };

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  // Holiday maps for quick lookup
  const holidayMap = useMemo(() => {
    const list = HOLIDAYS[currentYear] || [];
    const map = new Map();
    list.forEach(h => map.set(h.date, h.title));
    return map;
  }, [currentYear]);

  const upcomingHolidays = useMemo(() => {
    const list = HOLIDAYS[currentYear] || [];
    const nowStr = today.toISOString().slice(0, 10);
    return list.filter(h => h.date >= nowStr);
  }, [currentYear]);

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Calendar</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT SIDEBAR */}
        <div className="col-span-3 bg-white p-4 rounded-xl border">
          <h2 className="text-lg font-semibold mb-3">Add Event</h2>

          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg mb-3"
          />

          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg mb-3"
          />

          <button
            onClick={addEvent}
            className="w-full bg-blue-900 text-white py-2 rounded-lg mb-6"
          >
            + Add Event
          </button>

          <h3 className="font-semibold text-gray-700 mb-3">Upcoming Events</h3>
          <div className="space-y-3 mb-6">
            {events.length === 0 && (
              <p className="text-gray-500 text-sm">No events added.</p>
            )}

            {events.map((evt, idx) => (
              <div key={`evt-${idx}`} className="p-2 bg-gray-50 border rounded-lg">
                <p className="font-medium">{evt.title}</p>
                <p className="text-gray-500 text-sm">{evt.date}</p>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-gray-700 mb-3">Upcoming Holidays</h3>
          <div className="space-y-3">
            {upcomingHolidays.map((h, idx) => (
              <div key={`hol-${idx}`} className="p-2 bg-green-50 border rounded-lg">
                <p className="font-medium">{h.title}</p>
                <p className="text-gray-600 text-sm">{h.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CALENDAR */}
        <div className="col-span-9 bg-white p-4 rounded-xl border">
          {/* Month header */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevMonth}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              ←
            </button>

            <h2 className="text-xl font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </h2>

            <button
              onClick={nextMonth}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              →
            </button>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 text-center text-gray-600 font-medium mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {weeks.map((week, wi) =>
              week.map((day, di) => {
                const dateStr =
                  day > 0
                    ? `${currentYear}-${String(currentMonth + 1).padStart(
                        2,"0"
                      )}-${String(day).padStart(2,"0")}`
                    : "";

                const holidayTitle = dateStr && holidayMap.get(dateStr);
                const hasEvent = events.some((e) => e.date === dateStr);

                const isToday =
                  day === today.getDate() &&
                  currentMonth === today.getMonth() &&
                  currentYear === today.getFullYear();

                return (
                  <div
                    key={`${wi}-${di}`}
                    className={`border h-24 rounded-md p-2 text-sm relative
                      ${day <= 0 ? "bg-gray-50 text-gray-300" : "bg-white"}
                      ${isToday ? "ring-2 ring-blue-600 bg-blue-50" : ""}
                      ${holidayTitle ? "bg-green-50 border-green-400" : ""}
                    `}
                  >
                    {day > 0 && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{day}</span>

                          {holidayTitle && (
                            <span className="text-[10px] px-1 py-[1px] rounded bg-green-200 text-green-800">
                              🎉
                            </span>
                          )}
                        </div>

                        {holidayTitle && (
                          <p className="text-[10px] text-green-700 mt-1 truncate">
                            {holidayTitle}
                          </p>
                        )}

                        {hasEvent && (
                          <span className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-blue-600"></span>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
