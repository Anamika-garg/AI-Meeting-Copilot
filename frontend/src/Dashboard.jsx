import React, { useState } from "react";

// Dummy employee list
const employees = ["Dimpal", "Riya", "Ayush", "Karan", "Mehul"];

// Dummy tasks
const initialTasks = [
  { id: 1, title: "Prepare Meeting Summary", priority: "high" },
  { id: 2, title: "Fix UI Bugs", priority: "medium" },
  { id: 3, title: "Update Jira Tickets", priority: "low" },
  { id: 4, title: "Send Follow-Up Emails", priority: "medium" },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState(initialTasks);

  // Remove task when assigned
  const assignTask = (taskId, employee) => {
    alert(`Assigned to: ${employee}`);
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const priorityColor = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#263238]">

      {/* NAVBAR */}
      <nav className="w-full bg-[#004D40] text-white h-16 flex items-center px-6 shadow-lg">
        <h1 className="text-xl font-bold tracking-wide">MinuteMate Dashboard</h1>
      </nav>

      {/* TASK LIST CONTAINER */}
      <div className="max-w-4xl mx-auto mt-12 bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Pending Tasks</h2>

        {tasks.length === 0 ? (
          <p className="text-lg opacity-60">🎉 All tasks assigned!</p>
        ) : (
          <ul className="space-y-6">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition"
              >

                {/* TASK TEXT */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-4 h-4 rounded-full ${priorityColor[task.priority]}`}
                  ></div>

                  <span className="font-semibold">{task.title}</span>
                </div>

                {/* DROPDOWN */}
                <select
                  className="px-4 py-2 border rounded-lg cursor-pointer bg-[#FDFBF7]"
                  defaultValue=""
                  onChange={(e) => assignTask(task.id, e.target.value)}
                >
                  <option value="" disabled>
                    Assign to
                  </option>

                  {employees.map((emp) => (
                    <option key={emp} value={emp}>
                      {emp}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
