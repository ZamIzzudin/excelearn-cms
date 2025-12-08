/** @format */

"use client";

import { useState } from "react";
import { Form } from "antd";
import { Edit, Share2, X, ExternalLink } from "lucide-react";
import Image from "next/image";
import InputForm from "@/components/Form";
import Notification from "@/components/Notification";
import { useSocmed, useUpdateSocmed } from "../hook";

export default function SocialMediaTab() {
  const [showModal, setShowModal] = useState<"NONE" | "INPUT">("NONE");
  const [formAction, setFormAction] = useState<any>({});
  const [form] = Form.useForm();

  const { data: socmeds = [], isLoading, refetch } = useSocmed();
  const { mutate: update, isPending: isUpdating } = useUpdateSocmed();

  async function updateSocmed() {
    try {
      await form.validateFields();

      const formData = new FormData();
      formData.append("socmed_name", formAction.socmed_name);
      formData.append("socmed_link", formAction.socmed_link);

      if (formAction?.logo?.file) {
        formData.append("file", formAction?.logo?.file ?? null);
      } else if (formAction?.logo) {
        const parsed = JSON.stringify(formAction?.logo);
        formData.append("logo", parsed);
      }

      update(
        { id: formAction._id, data: formData },
        {
          onSuccess: () => {
            Notification("success", "Success to update social media");
            setShowModal("NONE");
            setFormAction({});
            form.resetFields();
            refetch();
          },
          onError: () => {
            Notification("error", "Failed to update social media");
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  const isPending = isUpdating;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse h-40 bg-slate-100 rounded-xl"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div>
          <h3 className="font-semibold text-blue-900">
            Social Media Management
          </h3>
          <p className="text-sm text-blue-700">
            Update your social media links. Leave link empty to hide from
            website.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {socmeds.map((socmed: any) => (
          <div
            key={socmed._id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 mb-1 truncate">
                  {socmed?.socmed_name}
                </h3>
                {socmed?.socmed_link ? (
                  <a
                    href={socmed.socmed_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 truncate"
                  >
                    <span className="truncate">{socmed.socmed_link}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                ) : (
                  <span className="text-sm text-slate-400 italic">
                    No link set (hidden on website)
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  setShowModal("INPUT");
                  setFormAction(socmed);
                  form.setFieldsValue(socmed);
                }}
                className="w-full flex items-center justify-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Link</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal === "INPUT" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Edit {formAction?.socmed_name} Link
            </h2>

            <Form form={form} layout="vertical" requiredMark={false}>
              <div className="mb-4">
                <span className="block text-sm font-medium text-slate-700 mb-2">
                  Social Media Name
                </span>
                <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
                  {formAction?.socmed_name}
                </div>
              </div>

              <InputForm
                type="text"
                name="socmed_link"
                label="Social Media Link"
                placeholder="https://... (leave empty to hide from website)"
                form={formAction}
                setForm={setFormAction}
              />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormAction({});
                    setShowModal("NONE");
                    form.resetFields();
                  }}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => updateSocmed()}
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Update Link"}
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
