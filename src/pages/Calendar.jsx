import { useState, useEffect } from "react";
import AppLayout from "../layouts/AppLayout";

export default function Calendar() {
  // ----------------------
  // DATE STATE
  // ----------------------
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // ----------------------
  // EVENTS STORAGE
  // ----------------------
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("calendar_events");
    return saved ? JSON.parse(saved) : [];
  });

  const [newEvent, setNewEvent] = useState({ title: "", date: "" });

  useEffect(() => {
    localStorage.setItem("calendar_events", JSON.stringify(events));
  }, [events]);

  // ----------------------
  // GENERATE CALENDAR GRID
  // ----------------------
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

  // ----------------------
  // ADD EVENT
  // ----------------------
  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    setEvents([...events, newEvent]);
    setNewEvent({ title: "", date: "" });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Calendar</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* ----------------------
            LEFT SIDEBAR
        ---------------------- */}
        <div className="col-span-3 bg-white p-4 rounded-xl border">
          <h2 className="text-lg font-semibold mb-3">Add Event</h2>

          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg mb-3"
          />

          <input
            type="date"
            value={newEvent.date}
            onChange={(e) =>
              setNewEvent({ ...newEvent, date: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg mb-3"
          />

          <button
            onClick={addEvent}
            className="w-full bg-blue-900 text-white py-2 rounded-lg mb-6"
          >
            + Add Event
          </button>

          <h3 className="font-semibold text-gray-700 mb-3">Upcoming Events</h3>

          <div className="space-y-3">
            {events.length === 0 && (
              <p className="text-gray-500 text-sm">No events added.</p>
            )}

            {events.map((evt, idx) => (
              <div key={idx} className="p-2 bg-gray-50 border rounded-lg">
                <p className="font-medium">{evt.title}</p>
                <p className="text-gray-500 text-sm">{evt.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ----------------------
            MAIN CALENDAR
        ---------------------- */}
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
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
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
                        2,
                        "0"
                      )}-${String(day).padStart(2, "0")}`
                    : "";

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
                      ${isToday ? "ring-2 ring-blue-600" : ""}
                    `}
                  >
                    {day > 0 && (
                      <>
                        <span>{day}</span>

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
