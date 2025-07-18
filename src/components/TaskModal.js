import React, { useState, useEffect } from 'react';

const TaskModal = ({ open, onClose, onSave, initial }) => {
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  const today = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const nowTimeStr = `${pad(today.getHours())}:${pad(today.getMinutes())}`;

  useEffect(() => {
    setName(initial?.name || '');
    setDetail(initial?.detail || '');
    setDate(initial?.date ? initial.date.split(' ')[0] : '');
    setTime(initial?.date && initial.date.split(' ')[1] ? initial.date.split(' ')[1] : '');
    setEndDate(initial?.endDate ? initial.endDate.split(' ')[0] : '');
    setEndTime(initial?.endDate && initial.endDate.split(' ')[1] ? initial.endDate.split(' ')[1] : '');
    setShowDate(false);
    setShowTime(false);
    setShowEndDate(false);
    setShowEndTime(false);
  }, [initial, open]);

  if (!open) return null;

  const isToday = date === todayStr;
  const isValidTime = () => {
    if (!isToday || !time) return true;
    const [h, m] = time.split(':').map(Number);
    const [nowH, nowM] = nowTimeStr.split(':').map(Number);
    if (h > nowH) return true;
    if (h === nowH && m >= nowM) return true;
    return false;
  };

  const isValidEnd = () => {
    if (!endDate) return true;
    const start = new Date(`${date}T${time || '00:00'}`);
    const end = new Date(`${endDate}T${endTime || '00:00'}`);
    return end > start;
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (isToday && time && !isValidTime()) {
      alert('Giờ bắt đầu phải lớn hơn hoặc bằng giờ hiện tại!');
      return;
    }
    if (endDate && !isValidEnd()) {
      alert('Ngày giờ kết thúc phải sau ngày giờ bắt đầu!');
      return;
    }
    let dateTime = '';
    if (date) {
      dateTime = date;
      if (time) dateTime += ' ' + time;
    }
    let endDateTime = '';
    if (endDate) {
      endDateTime = endDate;
      if (endTime) endDateTime += ' ' + endTime;
    }
    onSave({ name, detail, date: dateTime, endDate: endDateTime });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-[600px] shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-black"
          onClick={onClose}
        >✕</button>
        <h2 className="text-lg font-bold mb-4">{initial ? 'Edit task' : 'Add task'}</h2>
        <input
          className="w-full border rounded px-2 py-1 mb-3"
          placeholder="Task name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <textarea
          className="w-full border rounded px-2 py-1 mb-3"
          placeholder="Detail"
          value={detail}
          onChange={e => setDetail(e.target.value)}
        />
        {/* Ngày giờ */}
        <div className="mb-3 flex gap-4">
          {/* Start */}
          <div className="flex flex-col flex-1">
            <label className="text-xs mb-1">Start Date</label>
            <div className="flex items-center mb-2">
              <input
                className="w-full border rounded px-2 py-1"
                placeholder="Date (dd/mm/yyyy)"
                value={date ? date.split('-').reverse().join('/') : ''}
                readOnly
                onFocus={() => setShowDate(true)}
              />
              <button
                className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowDate(true)}
                type="button"
                title="Date"
              >
                📅
              </button>
              {showDate && (
                <input
                  type="date"
                  className="border rounded px-2 py-1 absolute mt-12"
                  value={date}
                  min={todayStr}
                  onChange={e => {
                    setDate(e.target.value);
                    setShowDate(false);
                  }}
                  onBlur={() => setShowDate(false)}
                  autoFocus
                />
              )}
            </div>
            <label className="text-xs mb-1">Start Time</label>
            <div className="flex items-center">
              <input
                className="w-full border rounded px-2 py-1"
                placeholder="Time (hh:mm)"
                value={time}
                readOnly
                onFocus={() => setShowTime(true)}
              />
              <button
                className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowTime(true)}
                type="button"
                title="Time"
                disabled={!date}
              >
                ⏰
              </button>
              {showTime && (
                <input
                  type="time"
                  className="border rounded px-2 py-1 absolute mt-12"
                  value={time}
                  min={isToday ? nowTimeStr : undefined}
                  onChange={e => {
                    setTime(e.target.value);
                    setShowTime(false);
                  }}
                  onBlur={() => setShowTime(false)}
                  autoFocus
                />
              )}
            </div>
          </div>
          {/* End */}
          <div className="flex flex-col flex-1">
            <label className="text-xs mb-1">End Date</label>
            <div className="flex items-center mb-2">
              <input
                className="w-full border rounded px-2 py-1"
                placeholder="Date (dd/mm/yyyy)"
                value={endDate ? endDate.split('-').reverse().join('/') : ''}
                readOnly
                onFocus={() => setShowEndDate(true)}
              />
              <button
                className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowEndDate(true)}
                type="button"
                title="Date"
              >
                📅
              </button>
              {showEndDate && (
                <input
                  type="date"
                  className="border rounded px-2 py-1 absolute mt-12"
                  value={endDate}
                  min={date || todayStr}
                  onChange={e => {
                    setEndDate(e.target.value);
                    setShowEndDate(false);
                  }}
                  onBlur={() => setShowEndDate(false)}
                  autoFocus
                />
              )}
            </div>
            <label className="text-xs mb-1">End Time</label>
            <div className="flex items-center">
              <input
                className="w-full border rounded px-2 py-1"
                placeholder="Time (hh:mm)"
                value={endTime}
                readOnly
                onFocus={() => setShowEndTime(true)}
              />
              <button
                className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowEndTime(true)}
                type="button"
                title="Time"
                disabled={!endDate}
              >
                ⏰
              </button>
              {showEndTime && (
                <input
                  type="time"
                  className="border rounded px-2 py-1 absolute mt-12"
                  value={endTime}
                  min={endDate === date ? time : undefined}
                  onChange={e => {
                    setEndTime(e.target.value);
                    setShowEndTime(false);
                  }}
                  onBlur={() => setShowEndTime(false)}
                  autoFocus
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            onClick={handleSave}
            disabled={isToday && time && !isValidTime()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;