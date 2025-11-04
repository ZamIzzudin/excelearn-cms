/** @format */

"use client";

import { useState } from "react";
import { Form } from "antd";
import { Plus, Edit, Trash2, MessageSquare, X, User } from "lucide-react";
import Image from "next/image";
import InputForm from "@/components/Form";
import Notification from "@/components/Notification";
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from "../hook";

export default function TestimonialsTab() {
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form] = Form.useForm();

  const { data: testimonials = [], isLoading, refetch } = useTestimonials();
  const { mutate: createTestimonial, isPending: isCreating } = useCreateTestimonial();
  const { mutate: updateTestimonial, isPending: isUpdating } = useUpdateTestimonial();
  const { mutate: deleteTestimonial, isPending: isDeleting } = useDeleteTestimonial();

  const handleOpenModal = (testimonial?: any) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      form.setFieldsValue(testimonial);
      setFormData(testimonial);
    } else {
      setEditingTestimonial(null);
      form.resetFields();
      setFormData({});
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
    form.resetFields();
    setFormData({});
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("is_active", formData.is_active || true);

      if (formData.photo?.file) {
        formDataToSend.append("file", formData.photo.file);
      } else if (editingTestimonial && formData.photo_url) {
        formDataToSend.append("photo_url", formData.photo_url);
        if (formData.photo_public_id) {
          formDataToSend.append("photo_public_id", formData.photo_public_id);
        }
      }

      if (editingTestimonial) {
        updateTestimonial(
          { id: editingTestimonial.id, data: formDataToSend },
          {
            onSuccess: () => {
              Notification("success", "Testimonial updated successfully");
              handleCloseModal();
              refetch();
            },
            onError: (error: any) => {
              Notification("error", error.message || "Failed to update testimonial");
            },
          }
        );
      } else {
        createTestimonial(formDataToSend, {
          onSuccess: () => {
            Notification("success", "Testimonial created successfully");
            handleCloseModal();
            refetch();
          },
          onError: (error: any) => {
            Notification("error", error.message || "Failed to create testimonial");
          },
        });
      }
    } catch (error) {
      Notification("error", "Please fill in all required fields");
    }
  };

  const handleDelete = (id: string) => {
    deleteTestimonial(id, {
      onSuccess: () => {
        Notification("success", "Testimonial deleted successfully");
        setDeleteConfirm(null);
        refetch();
      },
      onError: (error: any) => {
        Notification("error", error.message || "Failed to delete testimonial");
      },
    });
  };

  const isPending = isCreating || isUpdating;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse h-48 bg-slate-100 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">Testimonial Management</h3>
            <p className="text-sm text-blue-700">Manage customer testimonials</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      {testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial: any) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {testimonial.photo_url ? (
                    <Image
                      src={testimonial.photo_url}
                      alt={testimonial.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-slate-600 truncate">
                    {testimonial.title}
                  </p>
                </div>
              </div>
              <p className="text-slate-700 mb-4 line-clamp-3">
                {testimonial.content}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(testimonial)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(testimonial.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            No testimonials yet
          </h3>
          <p className="text-slate-600 mb-6">
            Start by adding your first testimonial
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Testimonial
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
            </h2>

            <Form form={form} layout="vertical" requiredMark={false}>
              <InputForm
                type="text"
                name="name"
                label="Name"
                placeholder="Enter person's name"
                required
                form={formData}
                setForm={setFormData}
              />

              <InputForm
                type="text"
                name="title"
                label="Title / Position"
                placeholder="Enter job title or position"
                required
                form={formData}
                setForm={setFormData}
              />

              <InputForm
                type="textarea"
                name="content"
                label="Testimonial Content"
                placeholder="Enter testimonial content"
                required
                form={formData}
                setForm={setFormData}
              />

              {formData.photo_url && !formData.photo?.file ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Photo
                  </label>
                  <div className="relative w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                      src={formData.photo_url}
                      alt={formData.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          photo_url: undefined,
                          photo_public_id: undefined,
                        }))
                      }
                      className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <InputForm
                  type="file"
                  name="photo"
                  label="Photo (Optional)"
                  accept="image/*"
                  form={formData}
                  setForm={setFormData}
                />
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Saving..." : editingTestimonial ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Delete Testimonial
            </h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this testimonial? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
