/** @format */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { useGlobalState } from "@/lib/middleware";

import { MenuItem } from "@/interface/type";
import { DefaultMenu, SuperMenu, colors } from "@/lib/var";

export default function Dashboard() {
  const { state } = useGlobalState();
  const [menuList, setMenuList] = useState<MenuItem[]>(
    DefaultMenu.filter((each: MenuItem) => each.href !== "/")
  );

  useEffect(() => {
    if (state.user && state.user.role === "SUPERADMIN") {
      setMenuList(SuperMenu.filter((each: MenuItem) => each.href !== "/"));
    }
  }, [state]);

  return (
    <div className="space-y-8 flex flex-col items-center justify-center min-h-[90dvh]">
      <div className="flex flex-col items-center">
        <h1 className="text-[60px] font-bold text-slate-800">ExceLEARN</h1>
        <p className="text-slate-600 mt-1">Manage Your Company Profile Here</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {menuList.map((menu: MenuItem, index: number) => {
          const Icon = menu.icon;
          const iconColor = colors[index];

          return (
            <Link
              href={menu?.href}
              key={menu.text}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {menu.text}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${iconColor}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: iconColor }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
