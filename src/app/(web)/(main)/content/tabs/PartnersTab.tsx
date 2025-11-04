/** @format */

"use client";

import { useState } from "react";
import { Form } from "antd";
import { Plus, Edit, Trash2, Building2, X } from "lucide-react";
import Image from "next/image";
import InputForm from "@/components/Form";
import Notification from "@/components/Notification";
import {
  usePartners,
  useCreatePartner,
  useUpdatePartner,
  useDeletePartner,
} from "../hook";

export default function PartnersTab() {
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form] = Form.useForm();

  const { data: partners = [], isLoading, refetch } = usePartners();
  const { mutate: createPartner, isPending: isCreating } = useCreatePartner();
  const { mutate: updatePartner, isPending: isUpdating } = useUpdatePartner();
  const { mutate: deletePartner, isPending: isDeleting } = useDeletePartner();

  const handleOpenModal = (partner?: any) => {
    if (partner) {
      setEditingPartner(partner);
      form.setFieldsValue(partner);
      setFormData(partner);
    } else {
      setEditingPartner(null);
      form.resetFields();
      setFormData({});
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPartner(null);
    form.resetFields();
    setFormData({});
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();

      const formDataToSend = new FormData();
      formDataToSend.append("partner_name", formData.partner_name);
      formDataToSend.append("is_active", formData.is_active || true);

      if (formData.logo?.file) {
        formDataToSend.append("file", formData.logo.file);
      } else if (editingPartner && formData.logo_url) {
        formDataToSend.append("logo_url", formData.logo_url);
        if (formData.logo_public_id) {
          formDataToSend.append("logo_public_id", formData.logo_public_id);
        }
      }

      if (editingPartner) {
        updatePartner(
          { id: editingPartner.id, data: formDataToSend },
          {
            onSuccess: () => {
              Notification("success", "Partner updated successfully");
              handleCloseModal();
              refetch();
            },
            onError: (error: any) => {
              Notification("error", error.message || "Failed to update partner");
            },
          }
        );
      } else {
        createPartner(formDataToSend, {
          onSuccess: () => {
            Notification("success", "Partner created successfully");
            handleCloseModal();
            refetch();
          },
          onError: (error: any) => {
            Notification("error", error.message || "Failed to create partner");
          },
        });
      }
    } catch (error) {
      Notification("error", "Please fill in all required fields");
    }
  };

  const handleDelete = (id: string) => {
    deletePartner(id, {
      onSuccess: () => {
        Notification("success", "Partner deleted successfully");
        setDeleteConfirm(null);
        refetch();
      },
      onError: (error: any) => {
        Notification("error", error.message || "Failed to delete partner");
      },
    });
  };

  const isPending = isCreating || isUpdating;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse h-40 bg-slate-100 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <Building2 className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">Partner Management</h3>
            <p className="text-sm text-blue-700">Add and manage your partners</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Partner
        </button>
      </div>

      {partners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map((partner: any) => (
            <div
              key={partner.id}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg transition-all"
            >
              <div className="relative h-32 bg-slate-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {partner.logo_url ? (
                  <Image
                    src={partner.logo_url}
                    alt={partner.partner_name}
                    width={120}
                    height={120}
                    className="object-contain max-h-full"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-slate-300" />
                )}
              </div>
              <h3 className="font-semibold text-slate-800 text-center mb-3 truncate">
                {partner.partner_name}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(partner)}
                  className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(partner.id)}
                  className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            No partners yet
          </h3>
          <p className="text-slate-600 mb-6">
            Start by adding your first partner
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Partner
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {editingPartner ? "Edit Partner" : "Add New Partner"}
            </h2>

            <Form form={form} layout="vertical" requiredMark={false}>
              <InputForm
                type="text"
                name="partner_name"
                label="Partner Name"
                placeholder="Enter partner name"
                required
                form={formData}
                setForm={setFormData}
              />

              {formData.logo_url && !formData.logo?.file ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Logo
                  </label>
                  <div className="relative h-32 bg-slate-50 rounded-lg flex items-center justify-center">
                    <Image
                      src={formData.logo_url}
                      alt={formData.partner_name}
                      width={120}
                      height={120}
                      className="object-contain max-h-full"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          logo_url: undefined,
                          logo_public_id: undefined,
                        }))
                      }
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <InputForm
                  type="file"
                  name="logo"
                  label="Partner Logo"
                  accept="image/*"
                  required={!editingPartner}
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
                  {isPending ? "Saving..." : editingPartner ? "Update" : "Create"}
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
              Delete Partner
            </h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this partner? This action cannot be
              undone.
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
