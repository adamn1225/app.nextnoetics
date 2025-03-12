import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import SmmCards from "./components/SmmCards";
import SideNav from "./components/SideNav";
import CalendarSmm from "./components/CalendarSmm";
import UserSettings from "./components/UserSettings";
import SignupFree from "./components/SignupFree";
import SignupPro from "./components/SignupPro";
import SignupBasic from "./components/SignupBasic";
import LoginPage from "./components/Login";
import { supabase } from "./lib/supabaseClient"; // Ensure you have this import
import TopNav from "./components/TopNav";
import Loader from "./components/Loader"; // Import the Loader component
import IntegrationDocs from "./components/IntegrationDocs";

function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const syncSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
        setLoading(false);
        return;
      }

      if (session) {
        console.log("Session found!", session);
        setSession(session);
      } else {
        console.log("No session found, continuing as guest...");
      }
      setLoading(false);
    };

    syncSession();

    // Listen for changes to the authentication state
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
      } else if (event === 'SIGNED_IN') {
        setSession(session);
      }
    });

    // Cleanup the listener on component unmount
    return () => {
      if (authListener && typeof authListener.unsubscribe === 'function') {
        authListener.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return <Loader />; // Show the Loader component while checking the session
  }

  return (
    <div className="App">
      <TopNav session={session} />
      <div className="flex h-screen">
        <SideNav session={session} />
        <Routes>
          <Route path="/calendar" element={<CalendarSmm />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/docs" element={<IntegrationDocs />} />
          <Route path="/signup-pro" element={<SignupPro />} />
          <Route path="/signup-basic" element={<SignupBasic />} />
          <Route path="/signup-free" element={<SignupFree />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<SmmCards session={session} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;