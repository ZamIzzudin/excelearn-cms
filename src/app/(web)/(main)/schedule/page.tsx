/** @format */

"use client";

import { useState, useRef } from "react";
import {
  Calendar,
  Plus,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Clock,
  MapPin,
  User,
  FileText,
  X,
} from "lucide-react";
import InputForm from "src/components/Form";
import Notification from "src/components/Notification";
import { Form } from "antd";
import dayjs from "dayjs";

// Dummy data untuk schedule
const dummyScheduleData = [
  {
    id: 1,
    title: "Team Meeting",
    description: "Weekly team sync meeting",
    date: "2024-01-15",
    time: "09:00",
    duration: 60,
    location: "Conference Room A",
    attendees: "John, Jane, Mike",
    type: "meeting",
    priority: "high",
  },
  {
    id: 2,
    title: "Project Deadline",
    description: "Submit final project deliverables",
    date: "2024-01-18",
    time: "17:00",
    duration: 0,
    location: "Online",
    attendees: "Development Team",
    type: "deadline",
    priority: "high",
  },
  {
    id: 3,
    title: "Client Presentation",
    description: "Present Q1 results to client",
    date: "2024-01-22",
    time: "14:00",
    duration: 90,
    location: "Client Office",
    attendees: "Sales Team, Client",
    type: "presentation",
    priority: "medium",
  },
  {
    id: 4,
    title: "Training Session",
    description: "New employee onboarding",
    date: "2024-01-25",
    time: "10:00",
    duration: 120,
    location: "Training Room",
    attendees: "HR Team, New Employees",
    type: "training",
    priority: "low",
  },
];

const eventTypes = [
  { label: "Meeting", value: "meeting" },
  { label: "Deadline", value: "deadline" },
  { label: "Presentation", value: "presentation" },
  { label: "Training", value: "training" },
  { label: "Event", value: "event" },
  { label: "Other", value: "other" },
];

const priorityOptions = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [scheduleData, setScheduleData] = useState(dummyScheduleData);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [form] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate calendar days
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
    return scheduleData.filter((event) =>
      dayjs(event.date).isSame(date, "day")
    );
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventModal(true);
    form.resetFields();
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setShowEventModal(true);
    form.setFieldsValue({
      ...event,
      date: dayjs(event.date),
    });
  };

  const handleDeleteEvent = (eventId: number) => {
    setScheduleData((prev) => prev.filter((event) => event.id !== eventId));
    Notification("success", "Event deleted successfully");
  };

  const handleSaveEvent = async (values: any) => {
    try {
      const eventData = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        id: editingEvent ? editingEvent.id : Date.now(),
      };

      if (editingEvent) {
        setScheduleData((prev) =>
          prev.map((event) =>
            event.id === editingEvent.id ? eventData : event
          )
        );
        Notification("success", "Event updated successfully");
      } else {
        setScheduleData((prev) => [...prev, eventData]);
        Notification("success", "Event added successfully");
      }

      setShowEventModal(false);
      form.resetFields();
    } catch (error) {
      Notification("error", "Failed to save event");
    }
  };

  const handleExportTemplate = () => {
    const template = [
      {
        title: "Sample Event",
        description: "Event description",
        date: "2024-01-15",
        time: "09:00",
        duration: 60,
        location: "Location",
        attendees: "Attendee names",
        type: "meeting",
        priority: "medium",
      },
    ];

    const csvContent = [
      "title,description,date,time,duration,location,attendees,type,priority",
      ...template.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schedule_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csvData = event.target?.result as string;
          const lines = csvData.split("\n");
          const headers = lines[0].split(",").map((h) => h.replace(/"/g, ""));

          const newEvents = lines
            .slice(1)
            .filter((line) => line.trim())
            .map((line, index) => {
              const values = line.split(",").map((v) => v.replace(/"/g, ""));
              const eventData: any = { id: Date.now() + index };

              headers.forEach((header, i) => {
                eventData[header.trim()] = values[i]?.trim() || "";
              });

              return eventData;
            });

          setScheduleData((prev) => [...prev, ...newEvents]);
          Notification("success", `Imported ${newEvents.length} events`);
        } catch (error) {
          Notification("error", "Failed to import file");
        }
      };
      reader.readAsText(file);
    }
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
            Manage your events and appointments
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
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleImportExcel}
            className="hidden"
          />
          <button
            onClick={handleAddEvent}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Event</span>
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
                    setSelectedDate(day.format("YYYY-MM-DD"));
                    handleAddEvent();
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
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEvent(event);
                        }}
                        className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${getPriorityColor(
                          event.priority
                        )}`}
                        title={`${event.title} - ${event.time}`}
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${getTypeColor(
                              event.type
                            )}`}
                          />
                          <span className="truncate">{event.title}</span>
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

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {editingEvent ? "Edit Event" : "Add New Event"}
              </h2>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <Form form={form} onFinish={handleSaveEvent} layout="vertical">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <InputForm
                    type="text"
                    name="title"
                    label="Event Title"
                    placeholder="Enter event title"
                    required
                    icon={<FileText className="w-5 h-5 text-slate-400" />}
                  />
                </div>

                <div className="md:col-span-2">
                  <InputForm
                    type="textarea"
                    name="description"
                    label="Description"
                    placeholder="Enter event description"
                  />
                </div>

                <InputForm
                  type="date"
                  name="date"
                  label="Date"
                  required
                  icon={<Calendar className="w-5 h-5 text-slate-400" />}
                />

                <InputForm
                  type="text"
                  name="time"
                  label="Time"
                  placeholder="09:00"
                  required
                  icon={<Clock className="w-5 h-5 text-slate-400" />}
                />

                <InputForm
                  type="number"
                  name="duration"
                  label="Duration (minutes)"
                  placeholder="60"
                />

                <InputForm
                  type="text"
                  name="location"
                  label="Location"
                  placeholder="Enter location"
                  icon={<MapPin className="w-5 h-5 text-slate-400" />}
                />

                <InputForm
                  type="text"
                  name="attendees"
                  label="Attendees"
                  placeholder="Enter attendee names"
                  icon={<User className="w-5 h-5 text-slate-400" />}
                />

                <InputForm
                  type="select"
                  name="type"
                  label="Event Type"
                  placeholder="Select event type"
                  options={eventTypes}
                  required
                />

                <InputForm
                  type="select"
                  name="priority"
                  label="Priority"
                  placeholder="Select priority"
                  options={priorityOptions}
                  required
                />
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                {editingEvent && (
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteEvent(editingEvent.id);
                      setShowEventModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  {editingEvent ? "Update Event" : "Add Event"}
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}