import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import SmmCards from "./components/SmmCards";
import SideNav from "./components/SideNav";
import CalendarSmm from "./components/CalendarSmm";
import { supabase } from "./lib/supabaseClient"; // Ensure you have this import

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
      authListener.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking the session
  }

  return (
    <div className="App">
      <div className="flex">
        <SideNav session={session} />
        <Routes>
          <Route path="/calendar" element={<CalendarSmm />} />
          <Route path="/" element={<SmmCards session={session} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;