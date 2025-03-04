import React, { useEffect } from "react";
import "./App.css";
import SmmCards from "./components/SmmCards";
import SideNav from "./components/SideNav";
import { supabase } from "./lib/supabaseClient"; // Ensure you have this import

function App() {
  useEffect(() => {
    const syncSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.log("No session found, redirecting to login...");
        window.location.href = "https://nextnoetics.com/login"; // Redirect user if no session
      } else {
        console.log("Session found!", session);
      }
    };

    syncSession();
  }, []);

  return (
    <div className="App">
      <div className="flex">
        <SideNav />
        <SmmCards />
      </div>
    </div>
  );
}

export default App;
