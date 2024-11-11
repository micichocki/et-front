import React, { useState } from 'react';

const DatePickerComponent = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [hours, setHours] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: { start: '', end: '' } }), {})
  );
  const [selectedDays, setSelectedDays] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: false }), {})
  );

  const handleTimeChange = (day, type, value) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value
      }
    }));
  };

  const handleCheckboxChange = (day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg max-w-md mx-auto">
      {daysOfWeek.map(day => (
        <div key={day} className="flex items-center mb-4 gap-4">
          <label className={`flex items-center font-semibold ${selectedDays[day] ? 'text-gray-700' : 'text-gray-400'}`}>
            <input
              type="checkbox"
              checked={selectedDays[day]}
              onChange={() => handleCheckboxChange(day)}
              className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            {day}
          </label>
          <input
            type="time"
            value={hours[day].start}
            onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
            className="time-input w-24 px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={!selectedDays[day]}
          />
          <span className="text-gray-500">to</span>
          <input
            type="time"
            value={hours[day].end}
            onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
            className="time-input w-24 px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={!selectedDays[day]}
          />
        </div>
      ))}
    </div>
  );
};

export default DatePickerComponent;