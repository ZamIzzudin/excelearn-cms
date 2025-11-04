/** @format */

"use client";

import { Tabs } from "antd";
import type { TabsProps } from "antd";

const items: TabsProps["items"] = [
  { key: "1", label: "Statistic", children: "Content of Tab Pane 1" },
  { key: "2", label: "Partner", children: "Content of Tab Pane 2" },
  { key: "3", label: "Testimonial", children: "Content of Tab Pane 3" },
  { key: "4", label: "Metadata", children: "Content of Tab Pane 4" },
];

export default function ContentPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Content Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage images and media content for your landing page
          </p>
        </div>
      </div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        indicator={{ align: "center" }}
      />
    </div>
  );
}
