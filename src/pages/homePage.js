import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskModal from '../components/TaskModal';
import TaskDetailCard from '../components/TaskDetailCard';

const Homepage = ({ tasks, setTasks }) => {
  const [modal, setModal] = useState({ open: false, category: '', index: null, initial: null });
  const navigate = useNavigate();

  const openAddModal = (category) => setModal({ open: true, category, index: null, initial: null });
  const openEditModal = (category, index, task) => setModal({ open: true, category, index, initial: task });
  const closeModal = () => setModal({ open: false, category: '', index: null, initial: null });

  const handleSave = (data) => {
    if (modal.index === null) {
      setTasks(prev => ({
        ...prev,
        [modal.category]: [
          ...prev[modal.category],
          { ...data }
        ]
      }));
    } else {
      setTasks(prev => ({
        ...prev,
        [modal.category]: prev[modal.category].map((t, i) =>
          i === modal.index ? { ...t, ...data } : t
        )
      }));
    }
    closeModal();
  };

  const handleDelete = (category, index) => {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const handleDragStart = (e, category, index) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ category, index }));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, targetCategory) => {
    e.preventDefault();
    const { category, index } = JSON.parse(e.dataTransfer.getData('text/plain'));
    const task = tasks[category][index];
    setTasks(prev => {
      const newTasks = { ...prev };
      newTasks[category] = newTasks[category].filter((_, i) => i !== index);
      newTasks[targetCategory] = [...newTasks[targetCategory], task];
      return newTasks;
    });
  };

  const columns = [
    { key: 'todo', label: 'TO DO' },
    { key: 'inProgress', label: 'IN PROGRESS' },
    { key: 'done', label: 'DONE' }
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">TO DO LIST</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(({ key, label }) => (
          <div
            key={key}
            onDrop={(e) => handleDrop(e, key)}
            onDragOver={handleDragOver}
            className="bg-blue-50 rounded-2xl p-4 shadow-md transition-all border border-blue-100"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                <span className="inline-block bg-blue-600 text-white w-6 h-6 text-center rounded-full mr-2">
                  {tasks[key].length}
                </span>
                {label}
              </div>
              <button
                onClick={() => openAddModal(key)}
                className="rounded-md border-2 border-black w-[100px] h-[40px] transition-all hover:scale-up-center relative hover:ring-4 hover:ring-offset-2 overflow-hidden group"
              >
                <div className="w-full h-full flex flex-col justify-center items-center text-sm font-semibold bg-blue-500 text-white group-hover:bg-blue-600 transition-all">
                  + New task
                </div>
              </button>
            </div>
            <div className="min-h-[200px] space-y-2">
              {tasks[key].length > 0 ? (
                tasks[key].map((task, index) => {
                  let hoverTransform = 'hover:scale-120';
                  if (key === 'todo') {
                    hoverTransform = 'hover:scale-120 hover:origin-left';
                  } else if (key === 'done') {
                    hoverTransform = 'hover:scale-120 hover:origin-right';
                  } else {
                    hoverTransform = 'hover:scale-120 hover:origin-center';
                  }

                  return (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, key, index)}
                      className={
                        `group transition-all duration-200 relative ` +
                        hoverTransform
                      }
                      style={{ transition: 'transform 0.2s' }}
                    >
                      <TaskDetailCard task={task} index={index} />
                      <div className="flex flex-col items-end ml-2 absolute top-1.5 right-2 z-10">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal(key, index, task); }}
                          className="mb-1 px-2 py-1 text-xs text-white bg-yellow-500 rounded hover:bg-yellow-600 transition w-[48px] h-[28px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(key, index); }}
                          className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 transition w-[48px] h-[28px]"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 italic text-center py-6">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <TaskModal
        open={modal.open}
        onClose={closeModal}
        onSave={handleSave}
        initial={modal.initial}
      />
      <style>
        {`
          @keyframes scale-up-center {
            0% { transform: scale(1);}
            100% { transform: scale(1.08);}
          }
          .hover\\:scale-up-center:hover {
            animation: scale-up-center 0.3s cubic-bezier(.39,.575,.565,1.000) both;
          }
        `}
      </style>
    </div>
  );
};

export default Homepage;
