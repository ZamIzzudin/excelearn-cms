/** @format */

"use client";

import { useState } from "react";
import StatisticsTab from "./tabs/StatisticsTab";
import PartnersTab from "./tabs/PartnersTab";
import TestimonialsTab from "./tabs/TestimonialsTab";
import SocialMediaTab from "./tabs/SocialMediaTab";
import AssetsTab from "./tabs/AssetsTab";

const tabs = [
  { id: "statistics", name: "Statistics" },
  { id: "partners", name: "Partners" },
  { id: "testimonials", name: "Testimonials" },
  { id: "socmed", name: "Social Media" },
  { id: "assets", name: "Assets" },
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
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center border-b-2 border-transparent gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap duration-150 ${
                    activeTab === tab.id
                      ? "text-blue-600  !border-blue-600 font-semibold"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
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
          {activeTab === "socmed" && <SocialMediaTab />}
          {activeTab === "assets" && <AssetsTab />}
        </div>
      </div>
    </div>
  );
}
