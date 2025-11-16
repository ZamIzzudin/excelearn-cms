/** @format */

"use client";

import { useState, useEffect } from "react";
import { Form } from "antd";
import { Save, TrendingUp } from "lucide-react";
import InputForm from "@/components/Form";
import Notification from "@/components/Notification";
import { useStatistic, useUpdateStatistic } from "../hook";

export default function StatisticsTab() {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<any>({});

  const { data: statistics, isLoading, refetch } = useStatistic();
  const { mutate: update, isPending } = useUpdateStatistic();

  useEffect(() => {
    if (statistics) {
      form.setFieldsValue(statistics);
      setFormData(statistics);
    }
  }, [statistics, form]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();

      update(formData, {
        onSuccess: () => {
          Notification("success", "Statistics updated successfully");
          refetch();
        },
        onError: (error: any) => {
          Notification("error", error.message || "Failed to update statistics");
        },
      });
    } catch (error) {
      Notification("error", "Please fill in all required fields");
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-slate-100 rounded-xl"></div>
        <div className="h-20 bg-slate-100 rounded-xl"></div>
        <div className="h-20 bg-slate-100 rounded-xl"></div>
        <div className="h-20 bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200 w-fit">
        <h3 className="font-semibold text-blue-900">Website Statistics</h3>
      </div>
      <Form form={form} layout="vertical" requiredMark={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputForm
            type="number"
            name="year_experience"
            label="Years of Experience"
            placeholder="Enter years of experience"
            required
            form={formData}
            setForm={setFormData}
          />

          <InputForm
            type="number"
            name="total_participant"
            label="Total Participants"
            placeholder="Enter total participants"
            required
            form={formData}
            setForm={setFormData}
          />

          <InputForm
            type="number"
            name="total_topic_class"
            label="Total Topic Classes"
            placeholder="Enter total topic classes"
            required
            form={formData}
            setForm={setFormData}
          />

          <InputForm
            type="number"
            name="total_training_completed"
            label="Total Training Completed"
            placeholder="Enter total training completed"
            required
            form={formData}
            setForm={setFormData}
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Statistics
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}
