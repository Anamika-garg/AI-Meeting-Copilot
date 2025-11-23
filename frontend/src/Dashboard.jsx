import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock, Users, AlertCircle, User } from "lucide-react";

/**
 * Dashboard.jsx
 * - Clean two-column layout
 * - Improved task cards (title, priority badge, manager, assigned)
 * - Dropdown with readable text (works across browsers)
 * - Right-side stats panel refined
 * - Loads organizationData and tasks from localStorage
 */

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [organizationData, setOrganizationData] = useState(null);
  const [teamByManager, setTeamByManager] = useState({});

  useEffect(() => {
    // Load organization data and group team members by manager
    const orgData = localStorage.getItem("organizationData");
    if (orgData) {
      const parsed = JSON.parse(orgData);
      setTeamMembers(parsed.teamMembers || []);
      setOrganizationData(parsed);

      const grouped = {};
      // Ensure manager keys exist
      (parsed.teamMembers || []).forEach((m) => {
        if (m.isManager && m.name) {
          grouped[m.name] = grouped[m.name] || [];
        }
      });
      // Put employees under their manager
      (parsed.teamMembers || []).forEach((m) => {
        if (!m.isManager && m.managerName) {
          grouped[m.managerName] = grouped[m.managerName] || [];
          grouped[m.managerName].push(m);
        }
      });

      setTeamByManager(grouped);
    }

    // Load tasks
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Assign a task to an employee and persist
  const handleAssignTask = (taskId, assigneeName) => {
    if (!assigneeName) return;
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, assignedTo: assigneeName, status: "assigned" } : t
    );
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  // Priority mapping
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return { dot: "bg-red-500", text: "High", badge: "bg-red-100 text-red-700" };
      case "medium":
        return { dot: "bg-yellow-500", text: "Medium", badge: "bg-yellow-100 text-yellow-700" };
      case "low":
        return { dot: "bg-green-500", text: "Low", badge: "bg-green-100 text-green-700" };
      default:
        return { dot: "bg-gray-400", text: "Normal", badge: "bg-gray-100 text-gray-700" };
    }
  };

  const totalTasks = tasks.length;
  const assignedTasks = tasks.filter((t) => t.assignedTo).length;
  const pendingTasks = tasks.filter((t) => !t.assignedTo).length;
  const totalTeamMembers = teamMembers.length;

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userName = user?.name || "User";

  return (
    <div className="min-h-screen flex bg-[#F4FBFA]">
      {/* Left column: content */}
      <div className="w-full lg:w-3/5 relative">
        {/* Nav */}
        <nav className="fixed top-0 left-0 w-full lg:w-3/5 h-20 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#004D40] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div className="font-bold text-xl text-[#004D40]">MinuteMate</div>
          </div>

          <ul className="hidden md:flex gap-8 text-[#004D40] font-medium">
            <Link to="/" className="hover:text-[#009688] transition">Home</Link>
            <li className="text-[#009688] border-b-2 border-[#009688] pb-1">Tasks</li>
            <li className="hover:text-[#009688] transition cursor-pointer">Team</li>
          </ul>

          <div className="w-10 h-10 bg-[#004D40] rounded-full flex items-center justify-center text-white font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
        </nav>

        {/* Main content area */}
        <div className="pt-28 pb-10 px-6 lg:px-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#004D40] mb-2">Pending Tasks</h1>
          <p className="text-gray-600 mb-8">Manage and assign tasks from your meetings</p>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-[#004D40]">{totalTasks}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingTasks}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">Assigned</p>
              <p className="text-2xl font-bold text-green-600">{assignedTasks}</p>
            </div>
          </div>

          {/* Tasks */}
          {tasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <AlertCircle className="mx-auto text-gray-400 mb-3" size={32} />
              <h3 className="text-lg font-semibold text-gray-700">No tasks yet</h3>
              <p className="text-gray-500">Tasks will appear when meetings generate action items.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {tasks.map((task) => {
                const priority = getPriorityColor(task.priority);

                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left: priority + info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`w-3 h-3 rounded-full mt-2 ${priority.dot} flex-shrink-0`} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {task.title || "Untitled Task"}
                            </h3>

                            {/* Keep small on narrow screens */}
                            <span className={`hidden sm:inline-block px-2 py-1 rounded-md text-xs font-medium ${priority.badge}`}>
                              {priority.text}
                            </span>
                          </div>

                          {/* small priority badge under title for mobile */}
                          <div className="sm:hidden mt-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${priority.badge}`}>
                              {priority.text}
                            </span>
                          </div>

                          <div className="mt-3 text-sm text-gray-700">
                            <div>
                              <strong className="text-gray-600">Manager:</strong>{" "}
                              <span className="font-semibold text-[#004D40]">{task.managerName}</span>
                            </div>
                            {task.assignedTo && (
                              <div className="mt-1">
                                <strong className="text-gray-600">Assigned to:</strong>{" "}
                                <span className="font-semibold text-[#004D40]">{task.assignedTo}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: dropdown */}
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <select
                          value={task.assignedTo || ""}
                          onChange={(e) => handleAssignTask(task.id, e.target.value)}
                          // use inline style to ensure options show readable text across browsers
                          className="w-full sm:w-[220px] border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 shadow-sm hover:border-[#009688] focus:ring-2 focus:ring-[#009688] focus:border-transparent"
                          style={{ color: "#1e293b", backgroundColor: "white" }}
                        >
                          <option value="" style={{ color: "#475569" }}>
                            Assign to...
                          </option>

                          {(teamByManager[task.managerName] || []).map((member, idx) => (
                            <option
                              key={idx}
                              value={member.name}
                              style={{ color: "#0f172a", backgroundColor: "white" }}
                            >
                              {member.name} {member.role ? `(${member.role})` : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right column: stats / assistant */}
      <aside className="hidden lg:block lg:w-2/5 bg-[#222] min-h-screen p-10 text-white">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6">Quick Stats</h2>

          <div className="bg-[#2a2a2a] p-6 rounded-xl border border-[#333] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Tasks</p>
                <p className="text-white text-xl font-bold">{totalTasks}</p>
              </div>
              <div className="w-10 h-10 bg-red-600/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-400" size={18} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Assigned</p>
                <p className="text-white text-xl font-bold">{assignedTasks}</p>
              </div>
              <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="text-green-400" size={18} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-white text-xl font-bold">{pendingTasks}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-600/10 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-400" size={18} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Team Members</p>
                <p className="text-white text-xl font-bold">{totalTeamMembers}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center">
                <Users className="text-blue-400" size={18} />
              </div>
            </div>
          </div>

          {organizationData && (
            <div className="bg-gradient-to-r from-[#004D40] to-[#00695C] rounded-xl p-6 mt-6">
              <p className="text-lg font-semibold">Great job! 🚀</p>
              <p className="text-green-100 text-sm">Let's keep improving productivity.</p>
            </div>
          )}

          {/* IMAGE IN RIGHT PANEL */}
          {/* <div className="mt-10 flex justify-center">
            <img
              src="dashboardImage.png"
              alt="Dashboard Visual"
              className="rounded-xl opacity-90 w-[85%] object-cover shadow-lg"
            />
          </div> */}

        </div>
        <div className="mt-10 flex justify-center">
            <img
              src="dashboardImage.png"
              alt="Dashboard Visual"
              className="rounded-xl opacity-90 w-[85%] object-cover shadow-lg"
            />
          </div> 
      </aside>
    </div>
  );
}
