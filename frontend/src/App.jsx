import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./landingPage.jsx";
import Dashboard from "./Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Organisation from "./pages/Organisation.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/organisation" element={<Organisation />} />
    </Routes>
  );
}
