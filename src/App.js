import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Homepage from './pages/homePage';
import CalendarPage from './pages/CalendarPage';
import UserTable from './pages/UserTable';
import './index.css';

function App() {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });

  return (
    <Router>
      <div className="w-screen flex flex-col items-center bg-black dark:bg-white relative pb-4">
        <div className="mt-8" />
        <h1 className="relative w-full xl:text-4xl md:text-10xl text-5xl sm:tracking-[17px] tracking-[10px] uppercase text-center leading-[0.70em] outline-none animate-dimlight box-reflect">
          Welcome to To-do-App
        </h1>
        <div className="mb-4" />
        <div className="flex gap-4 mt-6 mb-2">
          <Link
            to="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-semibold"
          >
            ToDo List
          </Link>
          <Link
            to="/calendar"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-semibold"
          >
            Calendar
          </Link>
          <Link
            to="/user"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-semibold"
          >
            User Table
          </Link>
        </div>
        <style>
          {`
            @keyframes dimlight {
              0%, 18%, 20%, 50.1%, 60%, 65.1%, 80%, 90.1%, 92% {
                color: #0e3742;
                box-shadow: none;
              }
              18.1%, 20.1%, 30%, 50%, 60.1%, 65%, 80.1%, 90%, 92.1%, 100% {
                color: #fff;
                text-shadow: 0 0 10px #03bcf4;
              }
            }
            .animate-dimlight {
              animation: dimlight 10s infinite;
            }
            .box-reflect {
              -webkit-box-reflect: below 1px linear-gradient(transparent, #0004);
            }
          `}
        </style>
      </div>
      <div className="w-full ">
        <Routes>
          <Route path="/" element={<Homepage tasks={tasks} setTasks={setTasks} />} />
          <Route path="/calendar" element={<CalendarPage tasks={tasks} />} />
          <Route path="/user" element={<UserTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;