/** @format */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGlobalState } from "@/lib/middleware";
import { useState } from "react";

import {
  Home,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  MoveLeft,
} from "lucide-react";

const menuItems = [
  { id: 1, text: "Dashboard", icon: Home, href: "/" },
  { id: 2, text: "Users", icon: Users, href: "/users" },
  { id: 3, text: "Reports", icon: BarChart3, href: "/reports" },
  { id: 7, text: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const { state, actions } = useGlobalState();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  console.log(state);

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-50 transition-all duration-300 ${
          isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div
            className={`flex items-center w-full ${
              isCollapsed ? "lg:justify-center" : "justify-between"
            }`}
          >
            <div className="flex gap-3 items-center">
              <div
                onClick={() => setIsCollapsed(false)}
                className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer"
              >
                <span className="text-white font-bold text-sm">E</span>
              </div>
              {!isCollapsed && (
                <span className="font-bold text-slate-800 text-lg">
                  Excelearn
                </span>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden text-sm lg:block p-2 bg-white border border-slate-200 rounded-lg shadow-sm transition-all duration-300"
              >
                <MoveLeft size={10} className="w-4 h-4 text-slate-600" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                } ${isCollapsed ? "lg:justify-center lg:px-2" : ""}`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-500 group-hover:text-slate-700"
                  }`}
                />
                {!isCollapsed && (
                  <span className="font-medium">{item.text}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          {!isCollapsed && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 mb-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {state?.user?.display_name
                    ? state?.user?.display_name[0]
                    : "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {state.user.display_name}
                </p>
                <p className="text-xs text-slate-500 truncate capitalize">
                  {state.user.role?.toLowerCase()}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => actions.logout()}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full ${
              isCollapsed ? "lg:justify-center lg:px-2" : ""
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed top-4 left-4 z-30 p-2 bg-white border border-slate-200 rounded-lg shadow-sm lg:hidden"
      >
        <Menu className="w-5 h-5 text-slate-600" />
      </button>
    </>
  );
}
