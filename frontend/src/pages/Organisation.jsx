import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Users, 
  UploadCloud, 
  Plus, 
  Trello, // Proxy for Jira icon
  HelpCircle,
  FileText,
  CheckCircle2,
  Info,
  ChevronRight,
  ExternalLink
} from "lucide-react";

const PRIMARY = "#004D40";
const SECONDARY = "#FDFBF7";
const ACCENT = "#009688";
const TEXT = "#263238";

const Organisation = () => {
  const navigate = useNavigate();
  
  // --- State Management ---
  const [org, setOrg] = useState({ name: "", numDepartments: 1 });
  const [departments, setDepartments] = useState([{ name: "" }]);
  const [managers, setManagers] = useState([{ name: "", email: "", jiraId: "" }]);
  const [employees, setEmployees] = useState([
    { name: "", department: "", role: "", email: "", jiraId: "", managerName: "", managerEmail: "", managerJiraId: "" },
  ]);
  const [file, setFile] = useState(null);

  // --- Handlers ---
  const handleDepartmentChange = (idx, value) => {
    const updated = [...departments];
    updated[idx].name = value;
    setDepartments(updated);
  };

  const handleNumDepartments = (num) => {
    const n = Math.max(1, num);
    setOrg({ ...org, numDepartments: n });
    const newDepts = [...departments];
    const newManagers = [...managers];
    
    // Expand or shrink arrays based on number
    while(newDepts.length < n) {
      newDepts.push({ name: "" });
      newManagers.push({ name: "", email: "", jiraId: "" });
    }
    while(newDepts.length > n) {
      newDepts.pop();
      newManagers.pop();
    }
    setDepartments(newDepts);
    setManagers(newManagers);
  };

  const handleManagerChange = (idx, field, value) => {
    const updated = [...managers];
    updated[idx][field] = value;
    setManagers(updated);
  };

  const handleEmployeeChange = (idx, field, value) => {
    const updated = [...employees];
    updated[idx][field] = value;
    
    // If department is changed, automatically link to that department's manager
    if (field === "department") {
      const deptIndex = departments.findIndex(dept => dept.name === value);
      if (deptIndex !== -1 && managers[deptIndex]) {
        updated[idx].managerName = managers[deptIndex].name;
        updated[idx].managerEmail = managers[deptIndex].email;
        updated[idx].managerJiraId = managers[deptIndex].jiraId;
      }
    }
    
    setEmployees(updated);
  };

  const addEmployee = () => {
    setEmployees([
      ...employees,
      { name: "", department: "", role: "", email: "", jiraId: "", managerName: "", managerEmail: "", managerJiraId: "" },
    ]);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFinishSetup = (e) => {
    e.preventDefault();
    
    // Collect all team members (managers + employees) for the dropdown
    const allTeamMembers = [];
    
    // Add managers with their department info
    managers.forEach((manager, idx) => {
      if (manager.name) {
        allTeamMembers.push({
          name: manager.name,
          email: manager.email,
          jiraId: manager.jiraId,
          role: "Manager",
          department: departments[idx]?.name || "",
          isManager: true
        });
      }
    });
    
    // Add employees with their manager and department info
    employees.forEach((employee) => {
      if (employee.name) {
        // Find the manager for this employee's department
        const deptIndex = departments.findIndex(dept => dept.name === employee.department);
        const manager = deptIndex !== -1 ? managers[deptIndex] : null;
        
        allTeamMembers.push({
          name: employee.name,
          email: employee.email,
          jiraId: employee.jiraId,
          role: employee.role || "Employee",
          department: employee.department || "",
          managerName: manager?.name || employee.managerName || "",
          managerEmail: manager?.email || employee.managerEmail || "",
          managerJiraId: manager?.jiraId || employee.managerJiraId || "",
          isManager: false
        });
      }
    });
    
    // Save organization data to localStorage
    const organizationData = {
      companyName: org.name,
      departments: departments.filter(dept => dept.name).map((dept, idx) => ({
        name: dept.name,
        manager: managers[idx]
      })),
      managers: managers.filter(mgr => mgr.name),
      employees: employees.filter(emp => emp.name).map(emp => {
        const deptIndex = departments.findIndex(dept => dept.name === emp.department);
        const manager = deptIndex !== -1 ? managers[deptIndex] : null;
        return {
          ...emp,
          managerName: manager?.name || emp.managerName || "",
          managerEmail: manager?.email || emp.managerEmail || "",
          managerJiraId: manager?.jiraId || emp.managerJiraId || ""
        };
      }),
      teamMembers: allTeamMembers
    };
    
    localStorage.setItem("organizationData", JSON.stringify(organizationData));

    // --- AUTO GENERATE TASKS BASED ON TEAM SIZE ---

const generatedTasks = [];
let taskId = 1;

// Loop through each manager
managers.forEach((manager, idx) => {
  if (!manager.name) return;

  // Get employees under this manager
  const empUnderManager = employees.filter(
    emp => emp.managerName === manager.name
  );

  // Create as many tasks as emp count
  empUnderManager.forEach((emp, i) => {
    generatedTasks.push({
      id: taskId++,
      title: `Task ${i + 1} for ${manager.name}`,
      priority: "medium",
      managerName: manager.name,
      assignedTo: "",
      status: "pending"
    });
  });
});

// Save tasks
localStorage.setItem("tasks", JSON.stringify(generatedTasks));

    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  // --- Components ---
  const SectionTitle = ({ icon: Icon, title, subtitle }) => (
    <div className="section-header">
      <div className="icon-box"><Icon size={20} color="white" /></div>
      <div>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="layout-container">
      <style>{`
        :root {
          --primary: ${PRIMARY};
          --secondary: ${SECONDARY};
          --accent: ${ACCENT};
          --text: ${TEXT};
          --border: #E2E8F0;
        }

        body { margin: 0; font-family: 'Inter', sans-serif; overflow: hidden; }

        .layout-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          background-color: var(--secondary);
        }

        /* --- LEFT SIDE: SCROLLABLE FORM --- */
        .form-panel {
          flex: 1.5; /* Takes up 60% of screen */
          overflow-y: auto;
          padding: 60px 80px;
          background-color: #FFFFFF;
        }

        .form-header { margin-bottom: 40px; }
        .form-header h1 { font-size: 2rem; color: var(--primary); margin: 0 0 10px 0; font-weight: 800; }
        .form-header p { color: #64748B; margin: 0; font-size: 1.1rem; }

        .section { margin-bottom: 50px; border-bottom: 1px solid #F1F5F9; padding-bottom: 40px; }
        .section:last-child { border-bottom: none; }

        .section-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .section-header h3 { margin: 0; color: var(--primary); font-size: 1.25rem; }
        .section-header p { margin: 0; font-size: 0.85rem; color: #64748B; }
        
        .icon-box {
          width: 40px; height: 40px;
          background: var(--accent);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 150, 136, 0.2);
        }

        /* Inputs & Grids */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        label { font-size: 0.85rem; font-weight: 600; color: var(--text); }
        
        input, select {
          padding: 12px 16px;
          border: 2px solid #E2E8F0;
          background: #F8FAFC;
          border-radius: 8px;
          font-size: 0.95rem;
          color: var(--text);
          transition: all 0.2s;
        }
        input:focus, select:focus {
          background: white;
          border-color: var(--accent);
          outline: none;
          box-shadow: 0 0 0 4px rgba(0, 150, 136, 0.1);
        }

        /* Card Styles */
        .dept-card {
          background: #FAFAFA;
          border: 1px solid #E2E8F0;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .dept-title { font-weight: 700; color: var(--primary); margin-bottom: 16px; display: block; }

        .employee-card {
          border: 1px solid #E2E8F0;
          padding: 20px;
          border-radius: 10px;
          background: white;
          transition: border 0.2s;
          position: relative;
        }
        .employee-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

        /* Buttons */
        .btn-primary {
          background: var(--primary);
          color: white;
          width: 100%;
          padding: 18px;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 20px;
          transition: background 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary:hover { background: #00382E; }

        .btn-secondary {
          width: 100%;
          padding: 14px;
          background: white;
          border: 2px dashed #CBD5E1;
          color: var(--primary);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: var(--accent); background: #F0FDFA; }

        /* File Upload */
        .file-drop-zone {
          border: 2px dashed #CBD5E1;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          background: #FAFAFA;
          transition: all 0.2s;
        }
        .file-drop-zone:hover { border-color: var(--accent); background: #F0FDFA; }


        /* --- RIGHT SIDE: STRUCTURED HELP PANEL --- */
        .info-panel {
          flex: 1; /* Takes up 40% of screen */
          background-color: var(--primary);
          background-image: radial-gradient(circle at top right, #005f4f, #004d40);
          color: white;
          display: flex;
          flex-direction: column;
          border-left: 1px solid rgba(255,255,255,0.1);
        }

        .info-header {
          padding: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .info-header h2 { margin: 0; font-size: 1.5rem; display: flex; align-items: center; gap: 12px; }
        
        .info-content {
          padding: 40px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          transition: transform 0.2s;
        }
        .info-card:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .info-card-title {
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #E2E8F0;
        }

        .info-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }
        
        .code-block {
          background: rgba(0,0,0,0.3);
          padding: 12px;
          border-radius: 6px;
          font-family: 'Monaco', monospace;
          font-size: 0.8rem;
          margin-top: 12px;
          color: #A7F3D0;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .link-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--accent);
          font-size: 0.9rem;
          margin-top: 16px;
          font-weight: 600;
          cursor: pointer;
        }
        .link-row:hover { color: #4DB6AC; }

        @media (max-width: 1100px) {
          .info-panel { display: none; }
          .form-panel { padding: 40px 20px; }
        }
      `}</style>

      {/* LEFT SIDE: FORM */}
      <div className="form-panel">
        <div className="form-header">
          <h1>Configure Organization</h1>
          <p>Set up your teams to automate your assignments correctly.</p>
        </div>

        <form onSubmit={e => e.preventDefault()}>
          
          {/* Org Structure */}
          <div className="section">
            <SectionTitle icon={Building2} title="Structure" subtitle="Define departments to route tasks." />
            <div className="grid-2" style={{ marginBottom: 24 }}>
              <div className="input-group">
                <label>Company Name</label>
                <input type="text" placeholder="Acme Inc." value={org.name} onChange={e => setOrg({ ...org, name: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Number of Departments</label>
                <input type="number" min={1} value={org.numDepartments} onChange={e => handleNumDepartments(Number(e.target.value))} />
              </div>
            </div>

            {departments.map((dept, idx) => (
              <div key={idx} className="dept-card">
                <span className="dept-title">Department {idx + 1}</span>
                <div className="grid-2">
                  <div className="input-group">
                    <label>Department Name</label>
                    <input type="text" placeholder="e.g. Backend Team" value={dept.name} onChange={e => handleDepartmentChange(idx, e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Manager Name</label>
                    <input type="text" placeholder="e.g. Rahul Verma" value={managers[idx]?.name || ""} onChange={e => handleManagerChange(idx, "name", e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Manager Email</label>
                    <input type="email" placeholder="lead@company.com" value={managers[idx]?.email || ""} onChange={e => handleManagerChange(idx, "email", e.target.value)} />
                  </div>
                  <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Manager Jira Account ID</label>
                    <input type="text" placeholder="557058:3b1269b5-..." value={managers[idx]?.jiraId || ""} onChange={e => handleManagerChange(idx, "jiraId", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Employees */}
          <div className="section">
            <SectionTitle icon={Users} title="Team Roster" subtitle="Map employees to departments. They will automatically be linked to their department's manager." />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {employees.map((emp, idx) => {
                // Find the manager for this employee's department
                const deptIndex = departments.findIndex(dept => dept.name === emp.department);
                const manager = deptIndex !== -1 ? managers[deptIndex] : null;
                
                return (
                  <div key={idx} className="employee-card">
                    <div className="input-group" style={{ marginBottom: 12 }}>
                      <label>Name</label>
                      <input type="text" value={emp.name} onChange={e => handleEmployeeChange(idx, "name", e.target.value)} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 12 }}>
                      <label>Department</label>
                      <select value={emp.department} onChange={e => handleEmployeeChange(idx, "department", e.target.value)}>
                        <option value="">Select Department...</option>
                        {departments.map((dept, dIdx) => (
                          <option key={dIdx} value={dept.name}>{dept.name || `Dept ${dIdx+1}`}</option>
                        ))}
                      </select>
                    </div>
                    {emp.department && manager?.name && (
                      <div style={{ 
                        marginBottom: 12, 
                        padding: '8px 12px', 
                        backgroundColor: '#E0F7F5', 
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        color: '#004D40'
                      }}>
                        <strong>Manager:</strong> {manager.name}
                        <br />
                        <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Department: {emp.department}</span>
                      </div>
                    )}
                    <div className="input-group">
                      <label>Jira Account ID</label>
                      <input type="text" placeholder="ID..." value={emp.jiraId} onChange={e => handleEmployeeChange(idx, "jiraId", e.target.value)} />
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="btn-secondary" onClick={addEmployee}><Plus size={18} /> Add Team Member</button>
          </div>

          {/* Upload */}
          <div className="section">
            <SectionTitle icon={UploadCloud} title="Bulk Import" subtitle="Upload CSV to skip manual entry." />
            <div className="file-drop-zone">
              <input type="file" id="file-upload" onChange={handleFileUpload} style={{ display: 'none' }} />
              <label htmlFor="file-upload">
                <UploadCloud size={48} color={ACCENT} style={{ marginBottom: 16 }} />
                <p style={{ margin: 0, fontWeight: 600, color: TEXT }}>
                  {file ? file.name : "Drag & drop or click to upload CSV"}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: 8 }}>Max file size: 10MB</p>
              </label>
            </div>
          </div>

          <button className="btn-primary" onClick={handleFinishSetup}>Finish Setup & Launch Dashboard <ChevronRight size={20}/></button>
        </form>
      </div>

      {/* --- RIGHT SIDE: STRUCTURED ASSISTANT --- */}
      <div className="info-panel">
        <div className="info-header">
          <h2><Info /> Setup Assistant</h2>
        </div>
        
        <div className="info-content">
          
          {/* Card 1: Jira Guide */}
          <div className="info-card">
            <div className="info-card-title">
              How to find Jira IDs <HelpCircle size={18} />
            </div>
            <p className="info-text">
              The Account ID is a unique string used by the Jira API to assign tickets. It is NOT the email address.
            </p>
            <div className="code-block">
              /people/557058:3b1269b5...
            </div>
            <div className="link-row">
              See Jira Documentation <ExternalLink size={14} />
            </div>
          </div>

          {/* Card 2: Why this is needed */}
          <div className="info-card">
            <div className="info-card-title">
              Why do we need this? <CheckCircle2 size={18} color="#4DB6AC" />
            </div>
            <p className="info-text">
              <strong>MinuteMate</strong> listens to meetings for phrases like <em>"Rahul, fix the bug"</em>. 
              <br/><br/>
              To create the ticket automatically, we need to map the name "Rahul" to his specific <strong>Jira ID</strong>.
            </p>
          </div>

          {/* Card 3: CSV Guide */}
          <div className="info-card">
            <div className="info-card-title">
              Bulk Upload Format <FileText size={18} />
            </div>
            <p className="info-text">
              Save time by uploading a CSV. Ensure your file matches this exact header format:
            </p>
            <div className="code-block">
              Name, Email, Dept, Jira_ID, Role
            </div>
            <div className="link-row">
              Download Sample Template <ExternalLink size={14} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Organisation;