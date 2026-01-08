/** @format */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ArrowLeft, Plus, X } from "lucide-react";
import { Form, Row, Col } from "antd";
import InputForm from "@/components/Form";

import {
  useCreateSchedule,
  useSchedulesDetail,
  useUpdateSchedule,
} from "../hook";

import Image from "next/image";
import Notification from "@/components/Notification";

import dayjs from "dayjs";

const AVAILABILITY = ["Full Booked", "Open Seat"];

const SKILL_LEVELS = ["Beginner", "Intermediate", "Expert", "All Level"];

const LANGUAGES = ["Indonesia", "Inggris"];

export default function ScheduleEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("id");
  const defaultDate = searchParams.get("date");

  const [form] = Form.useForm();

  const { data: existingSchedule } = useSchedulesDetail(scheduleId || "");
  const { mutate: createSchedule, isPending: isCreating } = useCreateSchedule();
  const { mutate: updateSchedule, isPending: isUpdating } = useUpdateSchedule();

  const [formAction, setFormAction] = useState<any>({ benefits: [] });

  const [newBenefit, setNewBenefit] = useState({ benefit: null });

  useEffect(() => {
    if (existingSchedule && scheduleId) {
      const initalData = {
        ...existingSchedule,
        schedule_start: dayjs(existingSchedule.schedule_start, "HH:mm"),
        schedule_end: dayjs(existingSchedule.schedule_end, "HH:mm"),
        schedule_date: dayjs(existingSchedule.schedule_date),
        schedule_close_registration_date: dayjs(
          existingSchedule.schedule_close_registration_date
        ),
      };

      form.setFieldsValue(initalData);
      setFormAction(initalData);
    } else if (defaultDate && !scheduleId) {
      const initialData = {
        benefits: [],
        schedule_date: dayjs(defaultDate),
      };
      form.setFieldsValue(initialData);
      setFormAction(initialData);
    } else {
      form.resetFields();
      setFormAction({ benefits: [] });
    }
  }, [existingSchedule, defaultDate, scheduleId]);

  const handleAddBenefit = () => {
    if (!newBenefit?.benefit) {
      return;
    }

    // Check if benefits already has 4 items (maximum limit)
    if (formAction?.benefits && formAction.benefits.length >= 4) {
      Notification(
        "error",
        "Maximum 4 benefits allowed. Please remove one to add new benefit."
      );
      return;
    }

    setFormAction((prev: any) => ({
      ...prev,
      benefits: [...prev?.benefits, newBenefit.benefit],
    }));
    setNewBenefit({ benefit: null });
    form.setFieldValue("benefit", undefined);
  };

  const handleRemoveBenefit = (index: number) => {
    setFormAction((prev: any) => ({
      ...prev,
      benefits: prev?.benefits?.filter((_: string, i: number) => i !== index),
    }));
  };

  const handleAddSchedule = async () => {
    try {
      await form.validateFields();

      const formData = new FormData();

      formData.append("schedule_name", formAction.schedule_name);
      formData.append("schedule_description", formAction.schedule_description);
      formData.append("schedule_date", formAction.schedule_date);
      formData.append(
        "schedule_close_registration_date",
        formAction.schedule_close_registration_date
      );
      formData.append("location", formAction.location);
      formData.append("schedule_start", formAction.schedule_start);
      formData.append("schedule_end", formAction.schedule_end);
      formData.append("skill_level", formAction.skill_level);
      formData.append("status", formAction.status);
      formData.append("language", formAction.language);
      formData.append("quota", formAction.quota);
      formData.append("duration", formAction.duration);
      formData.append("link", formAction.link || "");
      formData.append(
        "is_assestment",
        formAction.is_assestment ? "true" : "false"
      );

      formAction.benefits?.forEach((benefit: string) => {
        formData.append("benefits", benefit);
      });

      if (formAction?.banner?.file) {
        formData.append("file", formAction?.banner?.file ?? null);
      }

      createSchedule(formData, {
        onSuccess: () => {
          Notification("success", "Success Add New Schedule");
          router.back();
          form.resetFields();
          setFormAction({ benefits: [] });
        },
        onError: (e) => {
          Notification("error", "Failed to Add New Schedule");
          console.log(e);
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateSchedule = async () => {
    if (!scheduleId) return;

    try {
      await form.validateFields();

      const formData = new FormData();

      formData.append("schedule_name", formAction.schedule_name);
      formData.append("schedule_description", formAction.schedule_description);
      formData.append("schedule_date", formAction.schedule_date);
      formData.append(
        "schedule_close_registration_date",
        formAction.schedule_close_registration_date
      );
      formData.append("location", formAction.location);
      formData.append(
        "schedule_start",
        typeof formAction.schedule_start === "string"
          ? formAction.schedule_start
          : dayjs(formAction.schedule_start).format("HH:mm")
      );
      formData.append(
        "schedule_end",
        typeof formAction.schedule_end === "string"
          ? formAction.schedule_end
          : dayjs(formAction.schedule_end).format("HH:mm")
      );
      formData.append("skill_level", formAction.skill_level);
      formData.append("status", formAction.status);
      formData.append("language", formAction.language);
      formData.append("quota", formAction.quota);
      formData.append("duration", formAction.duration);
      formData.append("link", formAction.link || "");
      formData.append(
        "is_assestment",
        formAction.is_assestment ? "true" : "false"
      );

      formAction.benefits?.forEach((benefit: string) => {
        formData.append("benefits", benefit);
      });

      if (formAction?.banner?.file) {
        formData.append("file", formAction?.banner?.file ?? null);
      } else {
        const parsed = JSON.stringify(formAction?.banner);
        formData.append("banner", parsed);
      }

      updateSchedule(
        { id: scheduleId, data: formData },
        {
          onSuccess: () => {
            Notification("success", "Success to Update Schedule");
            router.back();
            form.resetFields();
            setFormAction({ benefits: [] });
          },
          onError: (e) => {
            Notification("error", "Failed to Update Schedule");
            console.log(e);
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              {scheduleId ? "Edit Schedule" : "Create Schedule"}
            </h1>
            <p className="text-slate-600 mt-1">
              {scheduleId
                ? "Update schedule information"
                : "Add a new schedule or agenda"}
            </p>
          </div>
        </div>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="space-y-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <InputForm
                    type="text"
                    name="schedule_name"
                    label="Schedule Name"
                    placeholder="Enter product name"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                  />
                </Col>
                <Col span={12}>
                  <InputForm
                    type="text"
                    name="location"
                    label="Location"
                    placeholder="Enter Location"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                  />
                </Col>
              </Row>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <InputForm
                    type="date"
                    name="schedule_date"
                    label="Date"
                    placeholder="Enter Date"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                  />
                </Col>
                <Col span={12}>
                  <InputForm
                    type="date"
                    name="schedule_close_registration_date"
                    label="Close Registration"
                    placeholder="Enter Date"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                  />
                </Col>
              </Row>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <InputForm
                    type="time"
                    name="schedule_start"
                    label="Start"
                    placeholder="Enter time start"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                  />
                </Col>
                <Col span={12}>
                  <InputForm
                    type="time"
                    name="schedule_end"
                    label="End"
                    placeholder="Enter time end"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                  />
                </Col>
              </Row>
              <InputForm
                type="textarea"
                name="schedule_description"
                label="Schedule Overview"
                placeholder="Enter product overview"
                required
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
              <InputForm
                type="text"
                name="link"
                label="Redirect Link (Optional)"
                placeholder="https://example.com or leave empty"
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 pt-6 pb-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Benefits</h2>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  formAction?.benefits?.length >= 4
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {formAction?.benefits?.length || 0} / 4
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2 items-start">
                <div className="flex-grow">
                  <InputForm
                    type="text"
                    name="benefit"
                    label=""
                    placeholder="Add a benefit..."
                    form={newBenefit}
                    setForm={(e: any) => setNewBenefit(e)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
              </div>

              {formAction?.benefits?.length > 0 && (
                <div className="space-y-2 pb-3">
                  {formAction?.benefits?.map(
                    (benefit: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <span className="text-slate-700">{benefit}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(index)}
                          className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Schedule Details
            </h2>

            <div className="space-y-4">
              <Row className="pt-5" gutter={[12, 12]}>
                <Col span={12}>
                  <InputForm
                    type="select"
                    name="skill_level"
                    label="Skill Level"
                    placeholder="Choose skill level"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                    options={SKILL_LEVELS.map((type: string) => ({
                      label: type,
                      value: type.replace(" ", "_").toUpperCase(),
                    }))}
                  />
                </Col>
                <Col span={12}>
                  <InputForm
                    type="select"
                    name="language"
                    label="Language"
                    placeholder="Choose language"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                    options={LANGUAGES.map((type: string) => ({
                      label: type,
                      value: type.replace(" ", "_").toUpperCase(),
                    }))}
                  />
                </Col>
              </Row>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <InputForm
                    type="number"
                    name="quota"
                    label="Max Quota"
                    placeholder="Enter max quota"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                  />
                </Col>
                <Col span={12}>
                  <InputForm
                    type="number"
                    name="duration"
                    label="Duration (minutes)"
                    placeholder="Enter duration in minutes"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                  />
                </Col>
              </Row>
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <InputForm
                    type="select"
                    name="status"
                    label="Status Availability"
                    placeholder="Choose status availability"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                    options={AVAILABILITY.map((type: string) => ({
                      label: type,
                      value: type.replace(" ", "_").toUpperCase(),
                    }))}
                  />
                </Col>
                <Col span={12}>
                  <InputForm
                    type="checkbox"
                    name="is_assestment"
                    label="Assestment"
                    placeholder="Is provide an assestment?"
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                  />
                </Col>
              </Row>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 pt-6 pb-3">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Banner
            </h2>
            {formAction?.banner ? (
              <div className="relative mb-5">
                <Image
                  src={formAction?.banner?.data || formAction?.banner?.url}
                  alt="uploaded banner"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px",
                  }} // optional
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormAction((prev: any) => ({
                      ...prev,
                      banner: undefined,
                    }))
                  }
                  className="p-1 hover:bg-gray-100 hover:text-red-500 rounded text-white transition-colors absolute top-5 right-5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <InputForm
                type="file"
                name="banner"
                label=""
                accept="image/*"
                className="mb-5"
                form={formAction}
                setForm={(e: any) => setFormAction(e)}
              />
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                router.back();
                form.resetFields();
                setFormAction({ benefits: [] });
              }}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() =>
                scheduleId ? handleUpdateSchedule() : handleAddSchedule()
              }
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {scheduleId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{scheduleId ? "Update Schedule" : "Add Schedule"}</>
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
