import React, { useState } from "react";
import { ArrowRight, Layout } from "lucide-react";

const PRIMARY = "#004D40";
const SECONDARY = "#FDFBF7";
const ACCENT = "#009688";
const TEXT = "#263238";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    alert("Login submitted!");
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
        .left-panel {
          flex: 1;
          background: #FFFFFF;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow-y: auto;
        }
        .form-container {
          width: 100%;
          max-width: 400px;
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
          color: var(--text);
        }
        .input-group input:focus {
          border-color: var(--accent);
          background: #fff;
          outline: none;
          box-shadow: 0 0 0 4px rgba(0, 150, 136, 0.1);
        }
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
        .hero-image-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .aesthetic-img {
          width: 100%;
          max-width: 400px;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }
        @media (max-width: 968px) {
          .right-panel { display: none; }
          .left-panel { padding: 40px 20px; }
        }
      `}</style>
      <div className="left-panel">
        <div className="form-container">
          <div className="form-header">
            <h1>Login</h1>
            <p>Sign in to your MinuteMate account.</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Login <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
      <div className="right-panel">
        <div>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layout /> MinuteMate
          </h2>
        </div>
        <div className="hero-image-container">
          <img 
            src="/api/placeholder/400/300" 
            alt="Login Visual" 
            className="aesthetic-img"
            style={{background: 'rgba(255,255,255,0.1)'}}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
