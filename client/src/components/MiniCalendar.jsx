import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function MiniCalendar({ selectedDate, onSelectDate, taskDates }) {
  const today = new Date();
  const [view, setView] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = toLocalDateStr(today);

  const prev = () => setView(new Date(year, month - 1, 1));
  const next = () => setView(new Date(year, month + 1, 1));
  const goToday = () => {
    setView(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(todayStr);
  };

  const handleDay = (day) => {
    const str = toLocalDateStr(new Date(year, month, day));
    onSelectDate(str === selectedDate ? null : str);
  };

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="glass rounded-2xl p-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prev}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ color: '#000000' }}
          onClick={goToday}
          className="text-sm font-semibold text-gray-800 transition-colors"
        >
          {MONTHS[month]} {year}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={next}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-300 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;

          const dateStr = toLocalDateStr(new Date(year, month, day));
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const hasTask = taskDates.has(dateStr);

          return (
            <div key={day} className="flex flex-col items-center py-0.5">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDay(day)}
                className={[
                  'w-7 h-7 text-xs rounded-full flex items-center justify-center font-medium transition-colors duration-150',
                  isSelected
                    ? 'bg-black text-white shadow-sm'
                    : isToday
                    ? 'ring-2 ring-gray-400 ring-offset-1 text-black font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black',
                ].join(' ')}
              >
                {day}
              </motion.button>

              {hasTask && (
                <div
                  className={`w-1 h-1 rounded-full -mt-0.5 ${
                    isSelected ? 'bg-white' : 'bg-gray-600'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
