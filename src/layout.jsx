import SideNav from './components/SideNav';
import TopNav from './components/TopNav'; // Import the TopNav component
import React from 'react';
import "./globals.css";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        {/* Add any head elements here */}
      </head>
      <body className="flex w-screen h-screen bg-gray-100 dark:bg-gray-800 overflow-x-hidden">
        <SideNav />
        <div className="flex-1 flex flex-col h-screen w-screen">
         
          <div className="flex overflow-auto h-screen w-full">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;