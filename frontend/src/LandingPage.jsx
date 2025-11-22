import React from "react";
import { Link } from "react-router-dom";
import { FileText, Pin, Mail, Rocket } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1e293b]">

      {/* NAVBAR */}
      <nav className="backdrop-blur-xl bg-white/70 border-b border-white/20 fixed top-0 left-0 w-full h-20 
  shadow-lg flex items-center justify-between px-6 md:px-10 lg:px-14 z-50">

        {/* LOGO */}
        <img src="logo.png" alt="MinuteMate Logo" className="navbar-logo drop-shadow-md" />

        {/* NAV LINKS + AUTH BUTTONS */}
        <div className="flex items-center gap-4 md:gap-6">

          {/* NAV LINKS */}
          <div className="hidden md:flex gap-6 items-center">
            <NavItem label="Features" href="#features" />
            <NavItem label="Dashboard" href="/dashboard" />
            <NavItem label="Contact" href="#contact" />
          </div>

          {/* LOGIN BUTTON */}
          <Link to="/login" className="px-4 py-2 bg-[#004D40] text-white rounded-lg font-semibold hover:bg-[#004D40] transition">
            Login
          </Link>

          {/* SIGNUP BUTTON */}
          <Link to="/signup" className="px-4 py-2 bg-[#004D40] text-white rounded-lg font-semibold hover:bg-[#004D40] transition">
            Sign Up
          </Link>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        className="relative px-6 md:px-12 lg:px-20 xl:px-32 pt-32 md:pt-40 pb-24 md:pb-32 
    flex flex-col md:flex-row items-center justify-between gap-16 overflow-hidden"
      >

        {/* LIGHT TEAL BACKGROUND */}
        <div className="absolute inset-0 bg-[#E0F7F7]"></div>

        {/* LEFT CONTENT */}
        <div className="relative z-10 max-w-2xl flex-1 space-y-8">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] 
        tracking-tight text-gray-900"
          >
            Automate Meetings with
            <span className="text-[#004D40]"> AI Efficiency</span>
            <br />
            Turn Conversations 
            <span className="text-[#14b8a6]"> Into Action.</span>
          </h1>

          <p className="text-lg md:text-xl opacity-80 leading-relaxed text-gray-700">
            Your AI assistant that captures discussions, generates summaries, extracts
            tasks, sends personalized emails, and syncs everything directly to Jira.
          </p>

          <button
            className="px-12 py-6 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl shadow-xl 
      hover:shadow-[#0ea5e9]/40 hover:scale-105 active:scale-95 transition-all 
      text-xl font-bold uppercase tracking-wide"
          >
            Get Started
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center w-full md:w-auto">
          <div
            className="absolute -inset-10 bg-gradient-to-br from-[#0ea5e9] to-[#14b8a6] 
        blur-3xl opacity-20 rounded-full"
          ></div>

          <img
            src="photo.png"
            alt="AI Icon"
            className="relative w-80 md:w-96 lg:w-[450px] drop-shadow-2xl animate-tiny-float"
          />
        </div>
      </section>


      {/* FEATURES SECTION */}
      <section id="features" className="px-6 md:px-12 lg:px-20 xl:px-32 py-24 bg-white rounded-t-[4rem] shadow-inner">

        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#0f766e]">
            Powerful Features
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#0ea5e9] to-[#14b8a6] mx-auto rounded-full"></div>
          <p className="mt-6 text-xl opacity-70 max-w-2xl mx-auto">
            Everything you need to transform conversations into execution.
          </p>
        </div>

        <div className="pt-10 pb-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">

            {/* FEATURE CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                // Using FileText from lucide-react or similar icon library
                Icon={FileText}
                title="Auto Summaries"
                text="AI generates clean, structured meeting summaries instantly with key insights extracted."
              />
              <FeatureCard
                Icon={Pin}
                title="Task Extraction"
                text="Automatically identifies tasks, assigns owners, and adds priority levels."
              />
              <FeatureCard
                Icon={Mail}
                title="Smart Emails"
                text="Every member receives personalized follow-up emails with their task list."
              />
              <FeatureCard
                Icon={Rocket}
                title="Jira Sync"
                text="Tasks created and synced into Jira instantly with zero manual work."
              />
            </div>

          </div>
        </div>

      </section>

      {/* CTA SECTION */}
      <section className="py-20 text-center bg-gradient-to-r from-[#0ea5e9]/10 to-[#14b8a6]/10">
        <h2 className="text-4xl font-bold mb-6">Start Automating Your Workflows</h2>
        <button className="px-10 py-4 bg-[#14b8a6] hover:bg-[#0f766e] text-white text-lg rounded-xl shadow-xl 
          hover:scale-105 transition-all font-semibold">
          Try Free Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-gradient-to-r from-[#0f766e] to-[#0d4c49] text-center text-white shadow-xl">
        <p className="text-lg font-medium">© 2025 MinuteMate — All Rights Reserved</p>
      </footer>

    </div >
  );
}

/* NAV LINKS */
function NavItem({ label, href }) {
  return (
    <Link
      to={href}
      className="text-[#0f172a] font-semibold px-4 py-2 rounded-lg hover:bg-[#0ea5e9]/10 
      hover:text-[#0284c7] transition-all"
    >
      {label}
    </Link>
  );
}

/* FEATURE CARD COMPONENT */
function FeatureCard({ Icon, title, text }) {
  return (
    <div
      className="group p-8 rounded-3xl bg-white 
            shadow-xl hover:shadow-2xl 
            hover:shadow-[#14b8a6]/40 
            hover:-translate-y-2 transition-all duration-300 cursor-pointer 
            border-t-4 border-[#e2e8f0] hover:border-[#14b8a6]"
    // 1. Removed backdrop-blur/bg-white/80 for a crisper, more premium look (bg-white is used)
    // 2. Enhanced shadow (shadow-xl) and added a distinct colored shadow on hover
    // 3. Changed border to a subtle top border (border-t-4) that changes color on hover
    >
      {/* ICON STYLING */}
      <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-full bg-[#e0f2f1] group-hover:bg-[#14b8a6] transition-all duration-300">
        {/* 4. Icon placed inside a rounded, light background container that brightens on hover */}
        <Icon className="w-6 h-6 text-[#0f766e] group-hover:text-white transition-all duration-300" />
      </div>


      {/* TITLE STYLING */}
      <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-[#0ea5e9] transition-all duration-300 mb-3">
        {title}
      </h3>

      {/* TEXT STYLING */}
      <p className="text-gray-600 leading-relaxed text-base">{text}</p>
    </div>
  );
}