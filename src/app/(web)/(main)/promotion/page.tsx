/** @format */

"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Percent,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import InputForm from "@/components/Form";
import Notification from "@/components/Notification";
import { Form } from "antd";
import dayjs from "dayjs";

// Dummy promotion data
const dummyPromotions = [
  {
    id: 1,
    title: "Summer Sale 2024",
    description:
      "Get amazing discounts on all our premium features this summer!",
    discountPercentage: 50,
    priceBefore: 99,
    priceAfter: 49,
    banner:
      "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
    endDate: "2024-08-31",
    link: "https://example.com/summer-sale",
    isActive: true,
  },
  {
    id: 2,
    title: "Black Friday Special",
    description: "Limited time offer - biggest discount of the year!",
    discountPercentage: 70,
    priceBefore: 199,
    priceAfter: 59,
    banner:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    endDate: "2024-11-30",
    link: "https://example.com/black-friday",
    isActive: false,
  },
  {
    id: 3,
    title: "New Year Promotion",
    description: "Start the new year with our special pricing!",
    discountPercentage: null,
    priceBefore: 149,
    priceAfter: 99,
    banner: null,
    endDate: "2024-01-31",
    link: "https://example.com/new-year",
    isActive: false,
  },
];

export default function PromotionPage() {
  const [promotionData, setPromotionData] = useState(dummyPromotions);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [form] = Form.useForm();

  const handleCreatePromotion = () => {
    setEditingPromotion(null);
    setShowModal(true);
    form.resetFields();
  };

  const handleEditPromotion = (promotion: any) => {
    setEditingPromotion(promotion);
    setShowModal(true);
    form.setFieldsValue({
      ...promotion,
      endDate: dayjs(promotion.endDate),
    });
  };

  const handleSavePromotion = async (values: any) => {
    try {
      const promotionData = {
        ...values,
        endDate: values.endDate.format("YYYY-MM-DD"),
        id: editingPromotion ? editingPromotion.id : Date.now(),
        isActive: false, // New promotions start as inactive
      };

      if (editingPromotion) {
        setPromotionData((prev) =>
          prev.map((promo) =>
            promo.id === editingPromotion.id
              ? { ...promo, ...promotionData }
              : promo
          )
        );
        Notification("success", "Promotion updated successfully");
      } else {
        setPromotionData((prev) => [...prev, promotionData]);
        Notification("success", "Promotion created successfully");
      }

      setShowModal(false);
      form.resetFields();
    } catch (error) {
      Notification("error", "Failed to save promotion");
    }
  };

  const handleToggleActive = (promotionId: number) => {
    setPromotionData((prev) =>
      prev.map((promo) => ({
        ...promo,
        isActive: promo.id === promotionId ? !promo.isActive : false, // Only one can be active
      }))
    );

    const promotion = promotionData.find((p) => p.id === promotionId);
    const newStatus = !promotion?.isActive;

    Notification(
      "success",
      newStatus ? "Promotion activated" : "Promotion deactivated"
    );
  };

  const handleDeletePromotion = (promotionId: number) => {
    setPromotionData((prev) =>
      prev.filter((promo) => promo.id !== promotionId)
    );
    setShowDeleteModal(null);
    Notification("success", "Promotion deleted successfully");
  };

  const handlePreviewPromotion = (promotion: any) => {
    if (promotion.link) {
      window.open(promotion.link, "_blank");
    }
  };

  const activePromotion = promotionData.find((p) => p.isActive);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Promotion Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage popup promotions for your website
          </p>
        </div>
        <button
          onClick={handleCreatePromotion}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Promotion
        </button>
      </div>

      {/* Active Promotion Alert */}
      {activePromotion && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <ToggleRight className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800">
                Active Promotion: {activePromotion.title}
              </h3>
              <p className="text-green-600 text-sm">
                This promotion is currently being displayed to visitors
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600">Ends on</p>
              <p className="font-medium text-green-800">
                {dayjs(activePromotion.endDate).format("MMM DD, YYYY")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotionData.map((promotion) => (
          <div
            key={promotion.id}
            className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all ${
              promotion.isActive
                ? "border-green-300 ring-2 ring-green-100"
                : "border-slate-200"
            }`}
          >
            {/* Banner */}
            {promotion.banner ? (
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={promotion.banner}
                  alt={promotion.title}
                  className="w-full h-full object-cover"
                />
                {promotion.isActive && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                      Active
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative">
                <div className="text-center text-white">
                  <h3 className="text-xl font-bold mb-2">{promotion.title}</h3>
                  {promotion.discountPercentage && (
                    <div className="text-3xl font-bold">
                      {promotion.discountPercentage}% OFF
                    </div>
                  )}
                </div>
                {promotion.isActive && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                      Active
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <h3 className="font-semibold text-slate-800 mb-2">
                {promotion.title}
              </h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {promotion.description}
              </p>

              {/* Pricing */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    ${promotion.priceAfter}
                  </span>
                  <span className="text-sm text-slate-500 line-through">
                    ${promotion.priceBefore}
                  </span>
                </div>
                {promotion.discountPercentage && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    <Percent className="w-3 h-3" />
                    {promotion.discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* End Date */}
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <Calendar className="w-4 h-4" />
                Ends: {dayjs(promotion.endDate).format("MMM DD, YYYY")}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(promotion.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    promotion.isActive
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {promotion.isActive ? (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      Activate
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleEditPromotion(promotion)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>

                {promotion.link && (
                  <button
                    onClick={() => handlePreviewPromotion(promotion)}
                    className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setShowDeleteModal(promotion.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Promotion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {editingPromotion ? "Edit Promotion" : "Create New Promotion"}
            </h2>

            <Form form={form} onFinish={handleSavePromotion} layout="vertical">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <InputForm
                    type="text"
                    name="title"
                    label="Promotion Title"
                    placeholder="Enter promotion title"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <InputForm
                    type="textarea"
                    name="description"
                    label="Description"
                    placeholder="Enter promotion description"
                    required
                  />
                </div>

                <InputForm
                  type="number"
                  name="priceBefore"
                  label="Price Before"
                  placeholder="99"
                  required
                />

                <InputForm
                  type="number"
                  name="priceAfter"
                  label="Price After"
                  placeholder="49"
                  required
                />

                <InputForm
                  type="number"
                  name="discountPercentage"
                  label="Discount Percentage (Optional)"
                  placeholder="50"
                />

                <InputForm
                  type="date"
                  name="endDate"
                  label="End Date"
                  required
                />

                <div className="md:col-span-2">
                  <InputForm
                    type="text"
                    name="link"
                    label="Promotion Link"
                    placeholder="https://example.com/promotion"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <InputForm
                    type="file"
                    name="banner"
                    label="Banner Image (Optional)"
                    accept="image/*"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  {editingPromotion ? "Update Promotion" : "Create Promotion"}
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Delete Promotion
            </h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this promotion? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePromotion(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
