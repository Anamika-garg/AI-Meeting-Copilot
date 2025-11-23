import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, CheckCircle2, Zap, Layout, ArrowRight } from "lucide-react";
import { signup, setToken, setUser } from "../services/api";

const PRIMARY = "#004D40";
const SECONDARY = "#FDFBF7";
const ACCENT = "#009688";
const TEXT = "#263238";

const Signup = () => {
  const [basic, setBasic] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!basic.name || !basic.email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await signup(basic.name, basic.email, password, confirmPassword);
      // On successful signup, navigate to organisation page
      // You can also store token if the API returns one
      navigate("/organisation");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen-container">
      <style>{`
        :root {
          --primary: ${PRIMARY};
          --secondary: ${SECONDARY};
          --accent: ${ACCENT};
          --text: ${TEXT};
        }

        body { margin: 0; font-family: 'Inter', sans-serif; overflow-x: hidden; }

        .split-screen-container {
          display: flex;
          min-height: 100vh;
          width: 100vw;
        }

        /* --- LEFT SIDE: THE FORM --- */
        .left-panel {
          flex: 1;
          background: #FFFFFF;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center; /* Centers form horizontally in the panel */
          overflow-y: auto;
        }

        .form-container {
          width: 100%;
          max-width: 480px; /* Limits form width so it doesn't stretch too wide */
        }

        .form-header {
          margin-bottom: 40px;
        }
        .form-header h1 {
          font-size: 2rem;
          color: var(--primary);
          margin-bottom: 8px;
          font-weight: 700;
        }
        .form-header p {
          color: #64748B;
          font-size: 1rem;
        }

        /* Input Styling */
        .input-group { margin-bottom: 20px; }
        .input-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 8px;
        }
        .input-group input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #E2E8F0;
          border-radius: 8px;
          font-size: 1rem;
          background: #F8FAFC;
          transition: all 0.2s;
          box-sizing: border-box;
          color: var(--text); /* <-- Add this line */
        }
        .input-group input:focus {
          border-color: var(--accent);
          background: #fff;
          outline: none;
          box-shadow: 0 0 0 4px rgba(0, 150, 136, 0.1);
        }

        /* Button Styling */
        .btn-primary {
          width: 100%;
          padding: 16px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s;
          margin-top: 10px;
        }
        .btn-primary:hover {
          background: #00382E;
        }

        /* --- RIGHT SIDE: THE VISUALS --- */
        .right-panel {
          flex: 1;
          background-color: var(--primary);
          background-image: linear-gradient(135deg, ${PRIMARY} 0%, #00382E 100%);
          color: white;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }

        /* If you have the image file, use this class */
        .hero-image-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        /* Placeholder for your aesthetic image */
        .aesthetic-img {
          width: 100%;
          max-width: 500px;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }

        .features-list {
          margin-top: 40px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        /* Mobile Responsive */
        @media (max-width: 968px) {
          .right-panel { display: none; } /* Hide image on tablet/mobile */
          .left-panel { padding: 40px 20px; }
        }
      `}</style>

      {/* --- LEFT PANEL: SIGNUP FORM --- */}
      <div className="left-panel">
        <div className="form-container">
          <div className="form-header">
            <h1>Create your account</h1>
            <p>Start automating your workflow in seconds.</p>
          </div>

          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Akshita Tanwar"
                value={basic.name}
                onChange={(e) => setBasic({ ...basic, name: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label>Work Email</label>
              <input
                type="email"
                placeholder="akshita@company.com"
                value={basic.email}
                onChange={(e) => setBasic({ ...basic, email: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{ 
                color: '#ef4444', 
                fontSize: '0.875rem', 
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#fee2e2',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? "Creating account..." : "Get Started"} <ArrowRight size={20} />
            </button>

            <p style={{ marginTop: 24, textAlign: 'center', fontSize: '0.9rem', color: '#64748B' }}>
              Already have an account?{" "}
              <span
                style={{ color: ACCENT, textDecoration: 'none', fontWeight: 600, cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Log in
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* --- RIGHT PANEL: AESTHETIC VISUALS --- */}
      <div className="right-panel">
        <div>
           {/* Logo Area */}
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layout /> MinuteMate
          </h2>
        </div>

        <div className="hero-image-container">
          {/* REPLACE 'your-image-url.png' with the actual image you generated */}
          <img 
            src="prettyImg.jpg" 
            alt="Dashboard Preview" 
            className="aesthetic-img"
            style={{background: 'rgba(255,255,255,0.1)'}} // Placeholder background
          />
        </div>

        <div className="features-list">
          <div className="feature-item">
            <CheckCircle2 color={ACCENT} /> Auto-capture Google Meet transcripts
          </div>
          <div className="feature-item">
            <CheckCircle2 color={ACCENT} /> Instant Jira Ticket Creation
          </div>
          <div className="feature-item">
            <CheckCircle2 color={ACCENT} /> Smart Assignee Detection
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;