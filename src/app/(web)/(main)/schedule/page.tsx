/** @format */

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  Plus,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Form } from "antd";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

import Notification from "@/components/Notification";

import { useSchedules, useDelete } from "./hook";

export default function SchedulePage() {
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(dayjs());

  const [form] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateCalendarDays = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startOfCalendar = startOfMonth.startOf("week");
    const endOfCalendar = endOfMonth.endOf("week");

    const days = [];
    let day = startOfCalendar;

    while (day.isBefore(endOfCalendar) || day.isSame(endOfCalendar, "day")) {
      days.push(day);
      day = day.add(1, "day");
    }

    return days;
  };

  const getEventsForDate = (date: dayjs.Dayjs) => {
    return [];
    // return scheduleData.filter((event) =>
    //   dayjs(event.date).isSame(date, "day")
    // );
  };

  const handleDeleteEvent = (eventId: number) => {
    // setScheduleData((prev) => prev.filter((event) => event.id !== eventId));
    Notification("success", "Schedule deleted successfully");
  };

  const handleExportTemplate = () => {
    const wb = XLSX.utils.book_new();

    const headers = [
      "Title",
      "Description",
      "Date",
      "Time",
      "Duration (minutes)",
      "Location",
      "Attendees",
      "Type",
      "Priority",
    ];

    const sampleData = [
      "Team Meeting [SAMPLE DATA DONT DELETE]",
      "Weekly team sync meeting",
      "2024-01-15",
      "09:00",
      60,
      "Conference Room A",
      "John, Jane, Mike",
      "meeting",
      "high",
    ];

    const wsData = [headers, sampleData];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    const colWidths = [
      { wch: 20 }, // Title
      { wch: 30 }, // Description
      { wch: 12 }, // Date
      { wch: 8 }, // Time
      { wch: 18 }, // Duration
      { wch: 20 }, // Location
      { wch: 25 }, // Attendees
      { wch: 12 }, // Type
      { wch: 10 }, // Priority
    ];
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "SCHEDULE");

    // Generate and download file
    XLSX.writeFile(wb, "SCHEDULE_TEMPLATE.xlsx");

    Notification("success", "Template downloaded successfully");
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = event.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert to JSON, starting from row 3 (index 2) to skip headers and sample data
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
              range: 2, // Start from row 3 (0-indexed, so 2)
            });

            // Define the expected column mapping
            const columnMapping = [
              "title",
              "description",
              "date",
              "time",
              "duration",
              "location",
              "attendees",
              "type",
              "priority",
            ];

            const newEvents = jsonData
              .filter((row: any) => row && row.length > 0 && row[0]) // Filter out empty rows
              .map((row: any, index: number) => {
                const eventData: any = {
                  id: Date.now() + index,
                };

                columnMapping.forEach((field, colIndex) => {
                  const value = row[colIndex];
                  if (value !== undefined && value !== null && value !== "") {
                    // Handle date formatting
                    if (field === "date" && typeof value === "number") {
                      // Excel date serial number to JS date
                      const excelDate = new Date(
                        (value - 25569) * 86400 * 1000
                      );
                      eventData[field] = dayjs(excelDate).format("YYYY-MM-DD");
                    } else if (field === "duration") {
                      eventData[field] = parseInt(value) || 0;
                    } else {
                      eventData[field] = String(value).trim();
                    }
                  }
                });

                return eventData;
              })
              .filter((event: any) => event.title); // Only include events with titles

            if (newEvents.length > 0) {
              // setScheduleData((prev) => [...prev, ...newEvents]);
              Notification(
                "success",
                `Successfully imported ${newEvents.length} events`
              );
            } else {
              Notification(
                "error",
                "No valid events found in the file. Please check the format."
              );
            }
          } catch (error) {
            console.error("Import error:", error);
            Notification(
              "error",
              "Failed to import file. Please check the file format."
            );
          }
        };

        reader.readAsBinaryString(file);
      } catch (error) {
        console.error("File reading error:", error);
        Notification("error", "Failed to read the file.");
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = ".xlsx,.xls";
      fileInputRef.current.click();
    }
  };

  const getTemplateInstructions = () => {
    return (
      <div className="text-sm text-slate-600 space-y-2">
        <p>
          <strong>Template Instructions:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Row 1: Column headers (bold formatting)</li>
          <li>Row 2: Sample data for reference</li>
          <li>Row 3+: Your actual event data</li>
          <li>Required fields: Title, Date (YYYY-MM-DD), Time (HH:MM)</li>
          <li>Date format: YYYY-MM-DD (e.g., 2024-01-15)</li>
          <li>Time format: HH:MM (e.g., 09:00, 14:30)</li>
          <li>
            Type options: meeting, deadline, presentation, training, event,
            other
          </li>
          <li>Priority options: high, medium, low</li>
        </ul>
      </div>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-500";
      case "deadline":
        return "bg-red-500";
      case "presentation":
        return "bg-purple-500";
      case "training":
        return "bg-green-500";
      case "event":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Schedule</h1>
          <p className="text-slate-600 mt-1">
            Manage your schedules and appointments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportTemplate}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Template</span>
          </button>
          <button
            onClick={handleFileInputClick}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            className="hidden"
          />
          <button
            onClick={() => router.push("/schedule/editor")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Schedule</span>
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              {currentDate.format("MMMM YYYY")}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <button
                onClick={() => setCurrentDate(dayjs())}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(currentDate.add(1, "month"))}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-slate-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-4">
            {generateCalendarDays().map((day) => {
              const events = getEventsForDate(day);
              const isCurrentMonth = day.isSame(currentDate, "month");
              const isToday = day.isSame(dayjs(), "day");

              return (
                <div
                  key={day.format("YYYY-MM-DD")}
                  className={`min-h-[120px] p-2 border rounded-lg transition-colors cursor-pointer hover:bg-slate-50 ${
                    isCurrentMonth
                      ? "border-slate-200"
                      : "border-slate-100 opacity-50"
                  } ${isToday ? "bg-indigo-50 border-indigo-200" : ""}`}
                  onClick={() => {
                    // setSelectedDate(day.format("YYYY-MM-DD"));
                    // handleAddEvent();
                  }}
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      isToday
                        ? "text-indigo-600"
                        : isCurrentMonth
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {day.format("D")}
                  </div>

                  <div className="space-y-1">
                    {events.slice(0, 3).map((event) => (
                      <div
                        // key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleEditEvent(event);
                        }}
                        // className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${getPriorityColor(
                        //   // event.priority
                        // )}`}
                        // title={`${event.title} - ${event.time}`}
                      >
                        <div className="flex items-center gap-1">
                          <div
                          // className={`w-2 h-2 rounded-full ${getTypeColor(
                          //   // event.type
                          // )}`}
                          />
                          {/* <span className="truncate">{event.title}</span> */}
                        </div>
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div className="text-xs text-slate-500 text-center">
                        +{events.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
