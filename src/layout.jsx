
import React from 'react';

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        {/* Add any head elements here */}
      </head>
      <body className="">
        
        <div className="">
          <div className="">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;