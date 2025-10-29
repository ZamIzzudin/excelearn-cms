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
  Edit,
  MapPin,
  Users,
  Clock,
  X,
} from "lucide-react";
import { Form } from "antd";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

import Notification from "@/components/Notification";

import { useSchedules, useDelete } from "./hook";
import { CreateService } from "./handler";

export default function SchedulePage() {
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const [form] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: schedules = [], refetch } = useSchedules();

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
    if (!schedules || schedules.length === 0) return [];

    return schedules.filter((schedule: any) => {
      const scheduleDate = dayjs(parseInt(schedule.schedule_date));
      return scheduleDate.isSame(date, "day");
    });
  };

  const handleMouseEnter = (date: dayjs.Dayjs, e: React.MouseEvent) => {
    const events = getEventsForDate(date);
    if (events.length > 0) {
      setHoveredDate(date.format("YYYY-MM-DD"));
      const rect = e.currentTarget.getBoundingClientRect();
      setPopupPosition({ x: rect.left, y: rect.bottom });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  const handleExportTemplate = () => {
    const wb = XLSX.utils.book_new();

    const headers = [
      "schedule_name",
      "schedule_description",
      "schedule_date",
      "schedule_start",
      "schedule_end",
      "location",
      "quota",
      "lecturer",
      "is_assestment",
      "benefits",
      "skill_level",
      "language",
      "status",
    ];

    const sampleData = [
      "Workshop React Advanced [SAMPLE DATA DONT DELETE]",
      "Learn advanced React patterns and best practices",
      "2025-11-15",
      "09:00",
      "17:00",
      "Jakarta Convention Center",
      "30",
      "2",
      "true",
      "Certificate|Lunch|Materials",
      "BEGINNER",
      "INDONESIA",
      "OPEN_SEAT",
    ];

    const wsData = [headers, sampleData];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    const colWidths = [
      { wch: 35 },
      { wch: 50 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 30 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
      { wch: 40 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "SCHEDULE");
    XLSX.writeFile(wb, "SCHEDULE_TEMPLATE.xlsx");

    Notification("success", "Template downloaded successfully");
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const data = event.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
              range: 2,
            });

            const columnMapping = [
              "schedule_name",
              "schedule_description",
              "schedule_date",
              "schedule_start",
              "schedule_end",
              "location",
              "quota",
              "lecturer",
              "is_assestment",
              "benefits",
              "skill_level",
              "language",
              "status",
            ];

            const newSchedules = jsonData
              .filter((row: any) => row && row.length > 0 && row[0])
              .map((row: any) => {
                const scheduleData: any = {};

                columnMapping.forEach((field, colIndex) => {
                  const value = row[colIndex];
                  if (value !== undefined && value !== null && value !== "") {
                    if (field === "schedule_date" && typeof value === "string") {
                      const dateTimestamp = dayjs(value).valueOf().toString();
                      scheduleData[field] = dateTimestamp;
                    } else if (field === "schedule_start" || field === "schedule_end") {
                      const [hours, minutes] = String(value).split(":");
                      const timeDate = dayjs()
                        .hour(parseInt(hours))
                        .minute(parseInt(minutes))
                        .second(0);
                      scheduleData[field] = timeDate.valueOf().toString();
                    } else if (field === "quota" || field === "lecturer") {
                      scheduleData[field] = parseInt(value) || 0;
                    } else if (field === "is_assestment") {
                      scheduleData[field] = String(value).toLowerCase() === "true";
                    } else if (field === "benefits") {
                      scheduleData[field] = String(value).split("|").map((b: string) => b.trim());
                    } else {
                      scheduleData[field] = String(value).trim();
                    }
                  }
                });

                return scheduleData;
              })
              .filter((schedule: any) => schedule.schedule_name);

            if (newSchedules.length > 0) {
              let successCount = 0;
              let failCount = 0;

              for (const schedule of newSchedules) {
                try {
                  const formData = new FormData();
                  Object.keys(schedule).forEach((key) => {
                    if (key === "benefits") {
                      schedule[key].forEach((benefit: string) => {
                        formData.append("benefits", benefit);
                      });
                    } else {
                      formData.append(key, schedule[key]);
                    }
                  });

                  const response = await CreateService(formData);
                  if (response.status === 201) {
                    successCount++;
                  } else {
                    failCount++;
                  }
                } catch (error) {
                  failCount++;
                }
              }

              refetch();
              Notification(
                "success",
                `Successfully imported ${successCount} schedules${failCount > 0 ? ` (${failCount} failed)` : ""}`
              );
            } else {
              Notification(
                "error",
                "No valid schedules found in the file. Please check the format."
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN_SEAT":
        return "bg-green-100 text-green-700";
      case "FULL_BOOKED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
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
              const hasEvents = events.length > 0;

              return (
                <div
                  key={day.format("YYYY-MM-DD")}
                  className={`min-h-[120px] p-2 border rounded-lg transition-all cursor-pointer ${
                    isCurrentMonth
                      ? "border-slate-200"
                      : "border-slate-100 opacity-50"
                  } ${isToday ? "bg-blue-50 border-blue-200" : ""} ${
                    hasEvents ? "hover:shadow-md hover:border-blue-300" : "hover:bg-slate-50"
                  }`}
                  onMouseEnter={(e) => handleMouseEnter(day, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    if (!hasEvents) {
                      router.push(`/schedule/editor?date=${day.format("YYYY-MM-DD")}`);
                    }
                  }}
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      isToday
                        ? "text-blue-600"
                        : isCurrentMonth
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {day.format("D")}
                  </div>

                  <div className="space-y-1">
                    {events.slice(0, 3).map((event: any) => (
                      <div
                        key={event.id}
                        className="text-xs p-1.5 rounded bg-blue-100 text-blue-700 truncate cursor-pointer hover:bg-blue-200 transition-colors"
                        title={event.schedule_name}
                      >
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="truncate font-medium">{event.schedule_name}</span>
                        </div>
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div className="text-xs text-slate-500 text-center font-medium">
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

      {hoveredDate && (
        <div
          className="fixed z-50 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 w-96 max-h-[500px] overflow-y-auto"
          style={{
            left: `${Math.min(popupPosition.x, window.innerWidth - 400)}px`,
            top: `${popupPosition.y + 10}px`,
          }}
          onMouseEnter={() => setHoveredDate(hoveredDate)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-800">
              {dayjs(hoveredDate).format("MMMM D, YYYY")}
            </h3>
            <button
              onClick={handleMouseLeave}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <div className="space-y-3">
            {getEventsForDate(dayjs(hoveredDate)).map((schedule: any) => (
              <div
                key={schedule.id}
                className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-slate-800 flex-1">
                    {schedule.schedule_name}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                      schedule.status
                    )}`}
                  >
                    {schedule.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {schedule.schedule_description}
                </p>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {dayjs(parseInt(schedule.schedule_start)).format("HH:mm")} -{" "}
                      {dayjs(parseInt(schedule.schedule_end)).format("HH:mm")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{schedule.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {schedule.quota} seats | {schedule.lecturer} lecturer(s)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/schedule/editor?id=${schedule.id}`)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit Schedule
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
