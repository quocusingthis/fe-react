import React, { useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function getRandomColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 80%)`;
}

const CalendarPage = ({ tasks }) => {
  const allTasks = useMemo(() =>
    [...tasks.todo, ...tasks.inProgress, ...tasks.done].map((task, idx) => ({
      ...task,
      color: getRandomColor(task.name + idx)
    })), [tasks]
  );

  const dateTaskMap = useMemo(() => {
    const map = {};
    allTasks.forEach(task => {
      if (!task.date) return;
      const start = task.date.split(' ')[0];
      const end = task.endDate ? task.endDate.split(' ')[0] : start;

      const [sy, sm, sd] = start.split('-').map(Number);
      const [ey, em, ed] = end.split('-').map(Number);
      let d = new Date(sy, sm - 1, sd);
      const endDate = new Date(ey, em - 1, ed);

      while (d <= endDate) {
        const key = d.toISOString().slice(0, 10);
        if (!map[key]) map[key] = [];
        map[key].push(task);
        d.setDate(d.getDate() + 1);
      }
    });
    return map;
  }, [allTasks]);

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const key = date.toISOString().slice(0, 10);
    const tasks = dateTaskMap[key];
    if (!tasks) return null;
    return (
      <div className="flex flex-wrap mt-1">
        {tasks.map((task, i) => (
          <div
            key={i}
            title={task.name}
            style={{
              background: task.color,
              borderRadius: 4,
              minWidth: 0,
              width: 12,
              height: 12,
              marginRight: 2,
              marginBottom: 2,
              display: 'inline-block'
            }}
          />
        ))}
      </div>
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    const key = date.toISOString().slice(0, 10);
    const tasks = dateTaskMap[key];
    if (!tasks) return '';
    return 'calendar-has-task';
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">Calendar</h1>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl">
          <Calendar
            tileContent={tileContent}
            tileClassName={tileClassName}
            calendarType="gregory"
            className="w-full"
          />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2 text-center">Tasks</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {allTasks.map((task, i) => (
            <div key={i} className="flex items-center gap-1">
              <span style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                background: task.color,
                borderRadius: 4,
                marginRight: 4
              }} />
              <span className="text-xs">{task.name}</span>
            </div>
          ))}
        </div>
      </div>
      <style>
        {`
          .calendar-has-task {
            box-shadow: 0 0 0 2px #60a5fa inset;
            border-radius: 8px;
          }
          .react-calendar {
            width: 100% !important;
            max-width: 100% !important;
            font-size: 1.1rem;
          }
        `}
      </style>
    </div>
  );
};

export default CalendarPage;