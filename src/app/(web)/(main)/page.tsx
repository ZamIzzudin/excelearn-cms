/** @format */

"use client";

import { BarChart3, Users, FileText, TrendingUp } from "lucide-react";

const stats = [
  { name: "Total Users", value: "2,651", change: "+12%", icon: Users, color: "bg-blue-500" },
  { name: "Active Sessions", value: "1,423", change: "+8%", icon: BarChart3, color: "bg-green-500" },
  { name: "Documents", value: "892", change: "+23%", icon: FileText, color: "bg-purple-500" },
  { name: "Growth Rate", value: "15.3%", change: "+2.1%", icon: TrendingUp, color: "bg-orange-500" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
            Export
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
            New Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">New user registered</p>
                  <p className="text-xs text-slate-500">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Add User", icon: Users, color: "bg-blue-500" },
              { name: "Create Report", icon: FileText, color: "bg-green-500" },
              { name: "View Analytics", icon: BarChart3, color: "bg-purple-500" },
              { name: "Settings", icon: TrendingUp, color: "bg-orange-500" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.name}
                  className="flex flex-col items-center gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors group"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{action.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}