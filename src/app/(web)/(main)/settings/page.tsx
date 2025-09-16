/** @format */

"use client";

import { useState } from "react";
import { Save, Bell, Shield, User, Palette, Globe } from "lucide-react";
import InputForm from "@/components/Form";
import { Form } from "antd";

const settingsSections = [
  { id: "profile", name: "Profile", icon: User },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "security", name: "Security", icon: Shield },
  { id: "appearance", name: "Appearance", icon: Palette },
  { id: "general", name: "General", icon: Globe },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [form] = Form.useForm();

  const handleSaveSettings = (values: any) => {
    console.log("Saving settings:", values);
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputForm
            type="text"
            name="firstName"
            label="First Name"
            placeholder="Enter first name"
          />
          <InputForm
            type="text"
            name="lastName"
            label="Last Name"
            placeholder="Enter last name"
          />
          <InputForm
            type="text"
            name="email"
            label="Email Address"
            placeholder="Enter email address"
          />
          <InputForm
            type="text"
            name="phone"
            label="Phone Number"
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Profile Picture</h3>
        <InputForm
          type="file"
          name="avatar"
          accept="image/*"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Bio</h3>
        <InputForm
          type="textarea"
          name="bio"
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
            <div>
              <p className="font-medium text-slate-800">New Messages</p>
              <p className="text-sm text-slate-600">Get notified when you receive new messages</p>
            </div>
            <InputForm type="switch" name="emailMessages" />
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
            <div>
              <p className="font-medium text-slate-800">Weekly Reports</p>
              <p className="text-sm text-slate-600">Receive weekly summary reports</p>
            </div>
            <InputForm type="switch" name="emailReports" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
            <div>
              <p className="font-medium text-slate-800">System Updates</p>
              <p className="text-sm text-slate-600">Get notified about system maintenance and updates</p>
            </div>
            <InputForm type="switch" name="pushUpdates" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Change Password</h3>
        <div className="space-y-4">
          <InputForm
            type="password"
            name="currentPassword"
            label="Current Password"
            placeholder="Enter current password"
          />
          <InputForm
            type="password"
            name="newPassword"
            label="New Password"
            placeholder="Enter new password"
          />
          <InputForm
            type="password"
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Two-Factor Authentication</h3>
        <div className="p-4 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Enable 2FA</p>
              <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
            </div>
            <InputForm type="switch" name="twoFactor" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Theme</h3>
        <InputForm
          type="radio"
          name="theme"
          options={[
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
            { label: "System", value: "system" },
          ]}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Color Scheme</h3>
        <InputForm
          type="select"
          name="colorScheme"
          placeholder="Select color scheme"
          options={[
            { label: "Blue", value: "blue" },
            { label: "Green", value: "green" },
            { label: "Purple", value: "purple" },
            { label: "Orange", value: "orange" },
          ]}
        />
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Language & Region</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputForm
            type="select"
            name="language"
            label="Language"
            placeholder="Select language"
            options={[
              { label: "English", value: "en" },
              { label: "Indonesian", value: "id" },
              { label: "Spanish", value: "es" },
            ]}
          />
          <InputForm
            type="select"
            name="timezone"
            label="Timezone"
            placeholder="Select timezone"
            options={[
              { label: "UTC+7 (Jakarta)", value: "Asia/Jakarta" },
              { label: "UTC+0 (London)", value: "Europe/London" },
              { label: "UTC-5 (New York)", value: "America/New_York" },
            ]}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Data & Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
            <div>
              <p className="font-medium text-slate-800">Analytics</p>
              <p className="text-sm text-slate-600">Help improve our service by sharing usage data</p>
            </div>
            <InputForm type="switch" name="analytics" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "appearance":
        return renderAppearanceSettings();
      case "general":
        return renderGeneralSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account preferences and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <nav className="space-y-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                      activeSection === section.id
                        ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <Form form={form} onFinish={handleSaveSettings} layout="vertical">
              {renderContent()}
              
              <div className="flex justify-end pt-6 border-t border-slate-200 mt-8">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}