"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { sidebarIcons, menuItems } from "../../lib/data";
import Image from "next/image";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Function to check if a menu item is active
  const isItemActive = (route) => {
    return pathname === route;
  };

  return (
    <div
      className={`bg-slate-900 text-white transition-all duration-300 h-screen ${
        isCollapsed ? "w-16" : "w-60"
      } flex flex-col`}
    >
      {/* Logo and Toggle */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between pl-2">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold">BuyInfo</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.route}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isItemActive(item.route)
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <span className="flex-shrink-0">
                  <Image
                    src={sidebarIcons[item.iconKey]}
                    width={24}
                    height={24}
                    alt={item.label}
                    className="w-6 h-6 brightness-0 invert"
                  />
                </span>
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
