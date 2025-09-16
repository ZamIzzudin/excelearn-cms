/** @format */

"use client";

import { useState } from "react";
import { Calendar, Download, Filter, BarChart3, TrendingUp, Users, FileText } from "lucide-react";
import InputForm from "@/components/Form";
import { Form } from "antd";

const reportTypes = [
  { id: 1, name: "User Analytics", description: "Detailed user behavior and engagement metrics", icon: Users, color: "bg-blue-500" },
  { id: 2, name: "Performance Report", description: "System performance and response time analysis", icon: TrendingUp, color: "bg-green-500" },
  { id: 3, name: "Content Statistics", description: "Content creation and interaction statistics", icon: FileText, color: "bg-purple-500" },
  { id: 4, name: "Traffic Analysis", description: "Website traffic patterns and source analysis", icon: BarChart3, color: "bg-orange-500" },
];

const recentReports = [
  { id: 1, name: "Monthly User Report", type: "User Analytics", date: "2024-01-15", status: "Completed" },
  { id: 2, name: "Performance Q1 2024", type: "Performance Report", date: "2024-01-14", status: "Processing" },
  { id: 3, name: "Content Review", type: "Content Statistics", date: "2024-01-13", status: "Completed" },
  { id: 4, name: "Traffic Summary", type: "Traffic Analysis", date: "2024-01-12", status: "Failed" },
];

export default function ReportsPage() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [form] = Form.useForm();

  const handleGenerateReport = (values: any) => {
    console.log("Generating report:", values);
    setShowGenerateModal(false);
    form.resetFields();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reports</h1>
          <p className="text-slate-600 mt-1">Generate and manage your analytics reports</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <BarChart3 className="w-5 h-5" />
          Generate Report
        </button>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${report.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-2">{report.name}</h3>
                  <p className="text-sm text-slate-600">{report.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Recent Reports</h2>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4 text-slate-500" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <Calendar className="w-4 h-4 text-slate-500" />
                Date Range
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Report Name</th>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Type</th>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Generated</th>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Status</th>
                <th className="text-right py-4 px-6 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-800">{report.name}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {report.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{report.date}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      report.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      {report.status === 'Completed' && (
                        <button className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Generate New Report</h2>
            <Form form={form} onFinish={handleGenerateReport} layout="vertical">
              <InputForm
                type="text"
                name="name"
                label="Report Name"
                placeholder="Enter report name"
                required
              />
              
              <InputForm
                type="select"
                name="type"
                label="Report Type"
                placeholder="Select report type"
                options={reportTypes.map(type => ({ label: type.name, value: type.id }))}
                required
              />

              <InputForm
                type="date"
                name="startDate"
                label="Start Date"
                placeholder="Select start date"
                required
              />

              <InputForm
                type="date"
                name="endDate"
                label="End Date"
                placeholder="Select end date"
                required
              />

              <InputForm
                type="select"
                name="format"
                label="Export Format"
                placeholder="Select format"
                options={[
                  { label: "PDF", value: "pdf" },
                  { label: "Excel", value: "xlsx" },
                  { label: "CSV", value: "csv" },
                ]}
                required
              />

              <InputForm
                type="textarea"
                name="description"
                label="Description (Optional)"
                placeholder="Add any additional notes or requirements"
              />
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Generate Report
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}