import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  const [date, time] = dateTime.split(' ');
  if (!date) return '';
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}` + (time ? ` ${time}` : '');
};

const TaskDetailCard = ({ task, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!task) return null;

  return (
    <motion.div
      layout
      initial={{ borderRadius: 10 }}
      className="bg-white border border-blue-200 rounded-md px-4 py-2 text-sm shadow-sm cursor-pointer mb-2"
    >
      <motion.div
        onClick={() => setIsOpen((v) => !v)}
        layout
        initial={{ borderRadius: 10 }}
        className="flex items-center p-2 gap-4"
      >
        <motion.div layout className="rounded-full bg-blue-200 h-6 w-6 flex items-center justify-center font-bold text-blue-700">
          {typeof index === 'number' ? index + 1 : ''}
        </motion.div>
        <motion.div layout className="flex flex-col flex-1">
          <span className="font-semibold">{task.name}</span>
          {(task.date || task.endDate) && (
            <span className="text-xs text-gray-400 flex items-center">
              {task.date && formatDateTime(task.date)}
              {task.endDate && (
                <>
                  <span className="mx-2">→</span>
                  {formatDateTime(task.endDate)}
                </>
              )}
            </span>
          )}
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full p-2"
          >
            {task.detail && (
              <div className="mb-2">
                <div className="text-xs text-gray-500 mb-1 font-semibold">Detail</div>
                <div
                  className="text-sm break-words whitespace-pre-line"
                  style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}
                >
                  {task.detail}
                </div>
              </div>
            )}
            {(task.date || task.endDate) && (
              <div className="mb-2">
                <div className="text-xs text-gray-500 mb-1 font-semibold">Date</div>
                <div className="flex items-center text-sm text-gray-700">
                  {task.date && <span>{formatDateTime(task.date)}</span>}
                  {task.endDate && (
                    <>
                      <span className="mx-2">→</span>
                      <span>{formatDateTime(task.endDate)}</span>
                    </>
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <button
                className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskDetailCard;