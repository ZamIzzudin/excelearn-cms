/** @format */

"use client";

import { useState } from "react";
import {
  Image,
  Video,
  Edit2,
  ExternalLink,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import Notification from "@/components/Notification";
import { useAssets, useUpdateAssetUrl } from "../hook";
import InputForm from "@/components/Form";
import { Form } from "antd";

interface Asset {
  _id: string;
  category: string;
  name: string;
  url: string;
  fallback_url: string;
  type: "image" | "video";
  is_active: boolean;
}

const categoryLabels: Record<string, string> = {
  hero_background: "Hero Background",
  hero_video: "Hero Video",
  about_image: "About Section Image",
  statistic_background: "Statistic Background",
  steps_background: "Steps Background",
  services_image: "Services Section Image",
  cta_schedule_image: "CTA Schedule Image",
  contact_image: "Contact Section Image",
};

export default function AssetsTab() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: assets, isLoading, refetch } = useAssets();
  const { mutate: updateAssetUrl, isPending } = useUpdateAssetUrl();

  const handleEdit = (asset: Asset) => {
    setEditingId(asset._id);
    setFormData({
      main_file: null,
      fallback_file: null,
    });
  };

  const handleSave = (id: string) => {
    if (!formData.main_file && !formData.fallback_file) {
      Notification("error", "Please select at least one file to upload");
      return;
    }

    const payload: { url?: string; fallback_url?: string } = {};
    
    if (formData.main_file?.url) {
      payload.url = formData.main_file.url;
    }
    if (formData.fallback_file?.url) {
      payload.fallback_url = formData.fallback_file.url;
    }

    updateAssetUrl(
      { id, payload },
      {
        onSuccess: () => {
          Notification("success", "Asset updated successfully");
          setEditingId(null);
          setFormData({});
          refetch();
        },
        onError: (error: any) => {
          Notification("error", error.message || "Failed to update asset");
        },
      }
    );
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
        <Image className="w-5 h-5 text-indigo-600" />
        <div>
          <h3 className="font-semibold text-indigo-900">Dynamic Assets</h3>
          <p className="text-sm text-indigo-700">
            Manage website background images and media. Files are uploaded directly to Cloudinary (max 10MB for images, 100MB for videos).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {assets?.map((asset: Asset) => {
          const isEditing = editingId === asset._id;

          return (
            <div
              key={asset._id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {asset.type === "video" ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <Video className="w-8 h-8 text-slate-400" />
                    </div>
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          asset.fallback_url || "/placeholder.png";
                      }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-slate-800">
                      {categoryLabels[asset.category] || asset.name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        asset.type === "video"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {asset.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        asset.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {asset.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {isEditing ? (
                    <Form layout="vertical" className="space-y-4">
                      <InputForm
                        type="file-cloud"
                        name="main_file"
                        label={`Main Asset ${asset.type === "video" ? "(Video)" : "(Image)"}`}
                        form={formData}
                        setForm={setFormData}
                        accept={asset.type === "video" ? "video/*" : "image/*"}
                        folder="excelearn/assets"
                      />

                      <InputForm
                        type="file-cloud"
                        name="fallback_file"
                        label="Fallback Asset (Optional - shown if main fails)"
                        form={formData}
                        setForm={setFormData}
                        accept="image/*"
                        folder="excelearn/assets"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(asset._id)}
                          disabled={isPending || (!formData.main_file?.url && !formData.fallback_file?.url)}
                          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isPending ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isPending}
                          className="flex items-center gap-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </Form>
                  ) : (
                    <>
                      <p className="text-sm text-slate-500 truncate mb-1">
                        {asset.url}
                      </p>
                      {asset.fallback_url && (
                        <p className="text-xs text-slate-400 truncate">
                          Fallback: {asset.fallback_url}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(asset.url)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Preview"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(asset)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Upload New"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="bg-white rounded-xl p-2 max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setPreviewUrl(null)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {previewUrl.includes(".mp4") || previewUrl.includes("video") ? (
              <video
                src={previewUrl}
                controls
                className="max-w-full max-h-[70vh] rounded-lg"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-[70vh] rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
