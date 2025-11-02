/** @format */

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Calendar,
  Percent,
  Megaphone,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
} from "lucide-react";
import InputForm from "@/components/Form";
import Notification from "@/components/Notification";
import { Form } from "antd";
import dayjs from "dayjs";

import {
  usePromo,
  useCreatePromo,
  useDelete,
  useUpdatePromo,
  useActivatePromo,
} from "./hook";

export default function PromotionPage() {
  const [showModal, setShowModal] = useState<
    "NONE" | "DELETE" | "ACTIVATE" | "INPUT"
  >("NONE");
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [form] = Form.useForm();
  const [formAction, setFormAction] = useState<any>({});

  const { data: promo = [], isLoading, refetch } = usePromo();
  const { mutate: add, isPending: addLoading } = useCreatePromo();
  const { mutate: deletePromo, isPending: deleteLoading } = useDelete();
  const { mutate: update, isPending: updateLoading } = useUpdatePromo();
  const { mutate: activate, isPending: activateLoading } = useActivatePromo();

  async function addPromo() {
    try {
      await form.validateFields();

      const formData = new FormData();
      formData.append("promo_name", formAction.promo_name);
      formData.append("promo_description", formAction.promo_description);
      formData.append("end_date", formAction.end_date);
      formData.append("percentage", formAction.percentage);

      if (formAction?.banner?.file) {
        formData.append("file", formAction?.banner?.file ?? null);
      } else {
        const parsed = JSON.stringify(formAction?.banner);
        formData.append("banner", parsed);
      }

      add(formData, {
        onSuccess: () => {
          Notification("success", "Success to add promo");
          setShowModal("NONE");
          setFormAction({});
          refetch();
        },
        onError: () => {
          Notification("error", "Failed to add promo");
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function updatePromo() {
    try {
      await form.validateFields();

      const formData = new FormData();
      formData.append("promo_name", formAction.promo_name);
      formData.append("promo_description", formAction.promo_description);
      formData.append("end_date", formAction.end_date);
      formData.append("percentage", formAction.percentage);

      if (formAction?.banner?.file) {
        formData.append("file", formAction?.banner?.file ?? null);
      } else {
        const parsed = JSON.stringify(formAction?.banner);
        formData.append("banner", parsed);
      }

      update(
        { id: formAction._id, data: formData },
        {
          onSuccess: () => {
            Notification("success", "Success to update promo");
            setShowModal("NONE");
            setFormAction({});
            refetch();
          },
          onError: () => {
            Notification("error", "Failed to update promo");
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  function PromoCard({ data }: any) {
    if (!data) return null;
    return (
      <div
        key={data.id}
        className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all ${
          data.isActive
            ? "border-green-300 ring-2 ring-green-100"
            : "border-slate-200"
        }`}
      >
        {/* Banner */}
        {data.banner ? (
          <div className="relative h-48 bg-slate-100 overflow-hidden">
            <img
              src={data?.banner?.url}
              alt={data.promo_name}
              className="w-full h-full object-cover"
            />
            {data.isActive && (
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
              <h3 className="text-xl font-bold mb-2">{data.promo_name}</h3>
              {data.percentage && (
                <div className="text-3xl font-bold">{data.percentage}% OFF</div>
              )}
            </div>
            {data.isActive && (
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
            {data.promo_name}
          </h3>
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {data.promo_description}
          </p>

          {/* Pricing */}
          <div className="flex items-center gap-3 mb-4">
            {/* <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    ${p.priceAfter}
                  </span>
                  <span className="text-sm text-slate-500 line-through">
                    ${p.priceBefore}
                  </span>
                </div> */}
            {data.percentage && (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                <Percent className="w-3 h-3" />
                {data.percentage}% OFF
              </div>
            )}
          </div>

          {/* End Date */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Calendar className="w-4 h-4" />
            Ends: {dayjs(data.end_date).format("HH:mm, DD MMM YYYY")}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelected(data);
                setShowModal("ACTIVATE");
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                data.is_active
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {data.is_active ? (
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
              onClick={() => {
                setFormAction(data);
                setShowModal("INPUT");
                form.setFieldsValue({
                  ...data,
                  end_date: dayjs(data.end_date),
                });
              }}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSelected(data);
                setShowModal("DELETE");
              }}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activePromotion = promo.find((p: any) => p.is_active);

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
          onClick={() => {
            setSelected(null);
            setShowModal("INPUT");
            form.resetFields();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Promotion
        </button>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search promo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-500" />
            Filter
          </button>
        </div>
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
                Active Promotion: {activePromotion.promo_name}
              </h3>
              <p className="text-green-600 text-sm">
                This p is currently being displayed to visitors
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600">Ends on</p>
              <p className="font-medium text-green-800">
                {dayjs(activePromotion.end_date).format("HH:mm, DD MMM YYYY")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Promotions Grid */}
      {promo && promo.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promo.map((p: any) => (
            <PromoCard data={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 flex flex-col items-center">
          <Megaphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            No promo found
          </h3>
          <p className="text-slate-600 mb-6">
            Get started by creating your first promotion
          </p>
          <button
            onClick={() => setShowModal("INPUT")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Promotion
          </button>
        </div>
      )}

      {/* Add/Edit Promotion Modal */}
      {showModal === "INPUT" && (
        <div className="fixed top-0 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {selected ? "Edit Promotion" : "Add New Promotion"}
            </h2>

            <Form form={form} layout="vertical">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="md:col-span-2">
                  <InputForm
                    type="text"
                    name="promo_name"
                    label="Promo Name"
                    placeholder="Enter promo name"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                  />
                </div>

                <div className="md:col-span-2">
                  <InputForm
                    type="textarea"
                    name="promo_description"
                    label="Description"
                    placeholder="Enter promo description"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                  />
                </div>
                <div className="md:col-span-2">
                  <InputForm
                    type="datetime"
                    name="end_date"
                    label="Promo End"
                    placeholder="Enter Promo End"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                  />
                </div>
                <div className="md:col-span-2">
                  <InputForm
                    type="number"
                    name="percentage"
                    label="Promo Percentage"
                    placeholder="Enter Promo Percentage"
                    required
                    form={formAction}
                    setForm={(e: any) => setFormAction(e)}
                  />
                </div>
                {formAction?.banner ? (
                  <div className="relative mb-5 md:col-span-2">
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
                  <div className="md:col-span-2">
                    <InputForm
                      type="file"
                      name="banner"
                      label="Banner Image (Optional)"
                      accept="image/*"
                      form={formAction}
                      setForm={(e: any) => setFormAction(e)}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal("NONE")}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                  onClick={() => {
                    formAction?._id ? updatePromo() : addPromo();
                  }}
                >
                  {formAction?._id ? "Update Promotion" : "Add Promotion"}
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal === "DELETE" && (
        <div className="fixed bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 top-0 right-0 left-0 bottom-0 m-0">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Delete Promotion
            </h2>
            <p>Are you sure want to delete this promo?</p>
            <div className="flex gap-5 mt-8 justify-center">
              <button
                onClick={() => {
                  setShowModal("NONE");
                  setSelected(null);
                }}
                disabled={deleteLoading}
                className="flex items-center justify-center gap-2 px-10 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                No
              </button>
              <button
                onClick={() => {
                  deletePromo(selected?._id, {
                    onSuccess: () => {
                      Notification("success", "Success Delete Data");
                      refetch();
                      setShowModal("NONE");
                      setSelected(null);
                    },
                    onError: () => {
                      Notification("error", "Failed to Delete Data");
                      setSelected(null);
                    },
                  });
                }}
                disabled={deleteLoading}
                className="px-10 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Activate Modal */}
      {showModal === "ACTIVATE" && (
        <div className="fixed bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 top-0 right-0 left-0 bottom-0 m-0">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {selected?.is_active ? "Deactivate" : "Activate"} Promotion
            </h2>
            <p>
              Are you sure want to{" "}
              {selected?.is_active ? "deactivate" : "activate"} this promo?
            </p>
            <div className="flex gap-5 mt-8 justify-center">
              <button
                onClick={() => {
                  setShowModal("NONE");
                  setSelected(null);
                }}
                disabled={deleteLoading}
                className="flex items-center justify-center gap-2 px-10 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                No
              </button>
              <button
                onClick={() => {
                  activate(
                    {
                      id: selected?._id,
                      data: { is_active: !selected?.is_active },
                    },
                    {
                      onSuccess: () => {
                        Notification(
                          "success",
                          `Success ${
                            selected?.is_active ? "Deactivate" : "Activate"
                          } Data`
                        );
                        refetch();
                        setShowModal("NONE");
                        setSelected(null);
                      },
                      onError: () => {
                        Notification(
                          "error",
                          `Failed to ${
                            selected?.is_active ? "Deactivate" : "Activate"
                          } Data`
                        );
                        setSelected(null);
                      },
                    }
                  );
                }}
                disabled={deleteLoading}
                className="px-10 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selected?.is_active ? "Deactivate" : "Activate"}{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
