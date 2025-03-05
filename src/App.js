import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import SmmCards from "./components/SmmCards";
import SideNav from "./components/SideNav";
import CalendarSmm from "./components/CalendarSmm";
import { supabase } from "./lib/supabaseClient"; // Ensure you have this import

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.log("No session found, redirecting to login...");
        window.location.href = "https://nextnoetics.com/login"; // Redirect user if no session
      } else {
        console.log("Session found!", session);
        setLoading(false);
      }
    };

    syncSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking the session
  }

  return (
    <div className="App">
      <div className="flex">
        <SideNav />
        <Routes>
          <Route path="/calendar" element={<CalendarSmm />} />
          <Route path="/" element={<SmmCards />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;