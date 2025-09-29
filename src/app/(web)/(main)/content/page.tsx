/** @format */

"use client";

import { useState } from "react";
import { Image, Upload, Save, Eye } from "lucide-react";
import InputForm from "src/components/Form";
import Notification from "src/components/Notification";
import { Form } from "antd";

// Hardcoded content types - add new types here when needed
const contentTypes = [
  {
    id: 1,
    name: "Hero Banner",
    description: "Main banner on homepage",
    key: "hero_banner",
    currentImage: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
    recommendedSize: "1920x1080",
  },
  {
    id: 2,
    name: "About Section Image",
    description: "Image for about us section",
    key: "about_image",
    currentImage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    recommendedSize: "800x600",
  },
  {
    id: 3,
    name: "Services Banner",
    description: "Banner for services section",
    key: "services_banner",
    currentImage: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    recommendedSize: "1200x400",
  },
  {
    id: 4,
    name: "Contact Background",
    description: "Background image for contact section",
    key: "contact_bg",
    currentImage: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
    recommendedSize: "1920x600",
  },
  {
    id: 5,
    name: "Footer Logo",
    description: "Logo displayed in footer",
    key: "footer_logo",
    currentImage: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg",
    recommendedSize: "200x80",
  },
  {
    id: 6,
    name: "Testimonial Background",
    description: "Background for testimonials section",
    key: "testimonial_bg",
    currentImage: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
    recommendedSize: "1920x800",
  },
];

export default function ContentPage() {
  const [editingContent, setEditingContent] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form] = Form.useForm();
  const [contentData, setContentData] = useState(contentTypes);

  const handleEditContent = (content: any) => {
    setEditingContent(content);
    setShowEditModal(true);
    form.setFieldsValue({
      name: content.name,
      description: content.description,
    });
  };

  const handleSaveContent = async (values: any) => {
    try {
      // Here you would typically upload the image and save to backend
      console.log("Saving content:", values);
      
      // Update local state (in real app, this would come from API response)
      setContentData(prev => 
        prev.map(item => 
          item.id === editingContent.id 
            ? { ...item, ...values }
            : item
        )
      );

      Notification("success", "Content updated successfully");
      setShowEditModal(false);
      form.resetFields();
    } catch (error) {
      Notification("error", "Failed to update content");
    }
  };

  const handlePreviewImage = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Content Management</h1>
          <p className="text-slate-600 mt-1">
            Manage images and media content for your landing page
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentData.map((content) => (
          <div
            key={content.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* Image Preview */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={content.currentImage}
                alt={content.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                <button
                  onClick={() => handlePreviewImage(content.currentImage)}
                  className="opacity-0 group-hover:opacity-100 bg-white text-slate-800 px-4 py-2 rounded-lg font-medium transition-all transform scale-95 group-hover:scale-100 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>

            {/* Content Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    {content.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">
                    {content.description}
                  </p>
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {content.recommendedSize}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleEditContent(content)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Update Image
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Content Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Update {editingContent?.name}
            </h2>

            <Form form={form} onFinish={handleSaveContent} layout="vertical">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Image
                </label>
                <div className="relative h-32 bg-slate-100 rounded-xl overflow-hidden">
                  <img
                    src={editingContent?.currentImage}
                    alt={editingContent?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Recommended size: {editingContent?.recommendedSize}
                </p>
              </div>

              <InputForm
                type="file"
                name="image"
                label="New Image"
                accept="image/*"
                required
              />

              <InputForm
                type="text"
                name="alt_text"
                label="Alt Text"
                placeholder="Enter image description for accessibility"
              />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Update
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}