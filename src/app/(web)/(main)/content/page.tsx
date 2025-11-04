/** @format */

"use client";

import { useState } from "react";
import { BarChart, Users, MessageSquare, Globe } from "lucide-react";
import StatisticsTab from "./tabs/StatisticsTab";
import PartnersTab from "./tabs/PartnersTab";
import TestimonialsTab from "./tabs/TestimonialsTab";
import MetadataTab from "./tabs/MetadataTab";

const tabs = [
  { id: "statistics", name: "Statistics", icon: BarChart },
  { id: "partners", name: "Partners", icon: Users },
  { id: "testimonials", name: "Testimonials", icon: MessageSquare },
  { id: "metadata", name: "Metadata", icon: Globe },
];

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("statistics");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Content Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage website content, statistics, and metadata
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "statistics" && <StatisticsTab />}
          {activeTab === "partners" && <PartnersTab />}
          {activeTab === "testimonials" && <TestimonialsTab />}
          {activeTab === "metadata" && <MetadataTab />}
        </div>
      </div>
    </div>
  );
}
