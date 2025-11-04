/** @format */

"use client";

import { useState, useEffect } from "react";
import { Form } from "antd";
import { Save, Globe, Tag, Plus, X } from "lucide-react";
import InputForm from "@/components/Form";
import Notification from "@/components/Notification";
import { useMetadata, useUpdateMetadata } from "../hook";

export default function MetadataTab() {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<any>({ site_keywords: [] });
  const [newKeyword, setNewKeyword] = useState("");

  const { data: metadata, isLoading, refetch } = useMetadata();
  const { mutate: updateMetadata, isPending } = useUpdateMetadata();

  useEffect(() => {
    if (metadata) {
      form.setFieldsValue(metadata);
      setFormData(metadata);
    }
  }, [metadata, form]);

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      const keywords = formData.site_keywords || [];
      setFormData({
        ...formData,
        site_keywords: [...keywords, newKeyword.trim()],
      });
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const keywords = [...formData.site_keywords];
    keywords.splice(index, 1);
    setFormData({ ...formData, site_keywords: keywords });
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();

      updateMetadata(formData, {
        onSuccess: () => {
          Notification("success", "Metadata updated successfully");
          refetch();
        },
        onError: (error: any) => {
          Notification("error", error.message || "Failed to update metadata");
        },
      });
    } catch (error) {
      Notification("error", "Please fill in all required fields");
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-slate-100 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <Globe className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="font-semibold text-blue-900">Website Metadata</h3>
          <p className="text-sm text-blue-700">
            Configure SEO and social media metadata
          </p>
        </div>
      </div>

      <Form form={form} layout="vertical" requiredMark={false}>
        <div className="space-y-8">
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              General Metadata
            </h3>
            <div className="space-y-4">
              <InputForm
                type="text"
                name="site_title"
                label="Site Title"
                placeholder="Enter site title"
                required
                form={formData}
                setForm={setFormData}
              />

              <InputForm
                type="textarea"
                name="site_description"
                label="Site Description"
                placeholder="Enter site description for SEO"
                required
                form={formData}
                setForm={setFormData}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  SEO Keywords
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="Add a keyword..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                {formData.site_keywords && formData.site_keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.site_keywords.map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(index)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <InputForm
                type="text"
                name="author"
                label="Author"
                placeholder="Enter author name"
                form={formData}
                setForm={setFormData}
              />

              <InputForm
                type="select"
                name="language"
                label="Language"
                placeholder="Select language"
                form={formData}
                setForm={setFormData}
                options={[
                  { label: "Indonesian", value: "id" },
                  { label: "English", value: "en" },
                ]}
              />

              <InputForm
                type="text"
                name="canonical_url"
                label="Canonical URL"
                placeholder="https://example.com"
                form={formData}
                setForm={setFormData}
              />

              <InputForm
                type="text"
                name="robots"
                label="Robots"
                placeholder="index, follow"
                form={formData}
                setForm={setFormData}
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Open Graph (Facebook)
            </h3>
            <div className="space-y-4">
              <InputForm
                type="text"
                name="og_title"
                label="OG Title"
                placeholder="Enter Open Graph title"
                form={formData}
                setForm={setFormData}
              />

              <InputForm
                type="textarea"
                name="og_description"
                label="OG Description"
                placeholder="Enter Open Graph description"
                form={formData}
                setForm={setFormData}
              />

              <InputForm
                type="text"
                name="og_image"
                label="OG Image URL"
                placeholder="https://example.com/image.jpg"
                form={formData}
                setForm={setFormData}
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Twitter Card
            </h3>
            <div className="space-y-4">
              <InputForm
                type="select"
                name="twitter_card"
                label="Card Type"
                placeholder="Select card type"
                form={formData}
                setForm={setFormData}
                options={[
                  { label: "Summary", value: "summary" },
                  { label: "Summary Large Image", value: "summary_large_image" },
                  { label: "App", value: "app" },
                  { label: "Player", value: "player" },
                ]}
              />

              <InputForm
                type="text"
                name="twitter_title"
                label="Twitter Title"
                placeholder="Enter Twitter card title"
                form={formData}
                setForm={setFormData}
              />

              <InputForm
                type="textarea"
                name="twitter_description"
                label="Twitter Description"
                placeholder="Enter Twitter card description"
                form={formData}
                setForm={setFormData}
              />

              <InputForm
                type="text"
                name="twitter_image"
                label="Twitter Image URL"
                placeholder="https://example.com/image.jpg"
                form={formData}
                setForm={setFormData}
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Other</h3>
            <div className="space-y-4">
              <InputForm
                type="text"
                name="favicon_url"
                label="Favicon URL"
                placeholder="https://example.com/favicon.ico"
                form={formData}
                setForm={setFormData}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-6 border-t border-slate-200">
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
                Save Metadata
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}
