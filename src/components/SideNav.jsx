import React, { useState } from 'react';
import { CalendarCog, Settings, PenTool, ScrollText } from 'lucide-react';
import { LuShrink } from "react-icons/lu";
import { RiMenu2Fill, RiLogoutCircleFill } from "react-icons/ri";
import { useLocation, Link } from 'react-router-dom';
import nextlogo from '../assets/next_noetics.png';
import logomin from '../assets/next_noetics_ico.png';
import Logout from './Logout';

const navItems = [
  { name: 'Builder', href: '/', icon: PenTool },
  { name: 'Calendar', href: '/calendar', icon: CalendarCog },
  { name: 'Documentation', href: '/docs', icon: ScrollText },
];

const SideNav = ({ session }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loading] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className={`relative left-0 top-0 z-50 bg-gray-950 h-full pb-12 -mt-12 text-white transition-all duration-300 ${isCollapsed ? 'w-14' : 'w-44'} overflow-hidden h-screen relative z-50`}>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-700 animate-pulse"></div>
      )}

        <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`text-white font-extrabold flex w-full text-3xl pt-2 focus:outline-none underline`}
        style={{ zIndex: 10 }}
      >
        {isCollapsed ? <span className='ml-3 w-full'> <RiMenu2Fill /></span> : <span className='flex justify-start ml-4 items-start w-full'><LuShrink /></span>}
      </button>

      <div className={`pt-4 flex items-start ${isCollapsed ? 'justify-center items-start' : 'justify-center w-full pt-4 '} gap-1 w-full px-1`}>
        <Link to="/" className="flex items-center justify-center w-full">
          <img
            src={isCollapsed ? logomin : nextlogo}
            alt="Noetics.io Logo"
            width={isCollapsed ? 40 : 400}
            height={isCollapsed ? 40 : 300}
            className="rounded-full "
          />
        </Link>
      </div>


      <nav className="flex flex-col justify-between h-full pb-8 pt-5  text-xs xl:text-base">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2  text-xs 2xl:text-base">
              <Link to={item.href} className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-2'} p-2 font-medium hover:bg-gray-700 rounded ${currentPath === item.href ? 'active' : ''}`}>
                <item.icon/>
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      
        <ul className='mb-12'>
          <li className="text-xs 2xl:text-base">
            <Link to="/settings" className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-2'}  p-2 font-medium hover:bg-gray-700 rounded ${currentPath === '/settings' ? 'active' : ''}`}>
              <Settings className="mr-2" />
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Settings</span>
            </Link>
            {session && (
              <div className={`flex mt-3 items-center ${isCollapsed ? 'justify-center' : 'justify-center'} p-1 font-medium hover:bg-gray-700 rounded`}>
                {isCollapsed ? <RiLogoutCircleFill size={24} className="mr-2" /> : <Logout />}
              </div>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideNav;