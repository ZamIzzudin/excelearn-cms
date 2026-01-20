/** @format */

"use client";

import { useState, useMemo } from "react";
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
  ChevronDown,
} from "lucide-react";
import InputForm from "@/components/Form";
import Notification from "@/components/Notification";
import { Form } from "antd";
import dayjs from "dayjs";
import { useDebounce } from "@/hooks/useDebounce";

import {
  usePromo,
  useCreatePromo,
  useDelete,
  useUpdatePromo,
  useActivatePromo,
} from "./hook";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const SORT_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
];

export default function PromotionPage() {
  const [showModal, setShowModal] = useState<
    "NONE" | "DELETE" | "ACTIVATE" | "INPUT"
  >("NONE");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form] = Form.useForm();
  const [formAction, setFormAction] = useState<any>({});

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePromo({
    promo_name: debouncedSearchTerm || undefined,
    is_active: statusFilter || undefined,
    sort_order: sortOrder,
  });

  const { mutate: add, isPending: addLoading } = useCreatePromo();
  const { mutate: deletePromo, isPending: deleteLoading } = useDelete();
  const { mutate: update, isPending: updateLoading } = useUpdatePromo();
  const { mutate: activate, isPending: activateLoading } = useActivatePromo();

  // Flatten all pages data
  const promos = useMemo(() => {
    return data?.pages?.flatMap((page: any) => page.data) || [];
  }, [data]);

  // Get pagination info from last page
  const pagination = useMemo(() => {
    return data?.pages?.[data.pages.length - 1]?.pagination || {};
  }, [data]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  async function addPromo() {
    try {
      await form.validateFields();

      const formData = new FormData();
      formData.append("promo_name", formAction.promo_name);
      formData.append("promo_description", formAction.promo_description);
      formData.append("end_date", formAction.end_date);
      formData.append("percentage", formAction.percentage);
      formData.append("link", formAction.link || "");

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
      formData.append("link", formAction.link || "");

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
        },
      );
    } catch (e) {
      console.log(e);
    }
  }

  function PromoCard({ data }: any) {
    if (!data) return null;
    return (
      <div
        key={data._id}
        className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all ${
          data.is_active
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
            {data.is_active && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                  Active
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
            <div className="text-center text-white">
              <h3 className="text-xl font-bold mb-2">{data.promo_name}</h3>
              {data.percentage && (
                <div className="text-3xl font-bold">{data.percentage}% OFF</div>
              )}
            </div>
            {data.is_active && (
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
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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

  const activePromotion = promos.find((p: any) => p.is_active);

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
            setFormAction({});
            form.resetFields();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Promotion
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search promo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors w-full md:w-auto"
            >
              <Filter className="w-5 h-5 text-slate-500" />
              <span>Filter</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform ${
                  showFilterDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-10">
                {/* Status Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SORT_OPTIONS.map((sort) => (
                      <option key={sort.value} value={sort.value}>
                        {sort.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setStatusFilter("");
                    setSortOrder("desc");
                    setSearchTerm("");
                    setShowFilterDropdown(false);
                  }}
                  className="w-full mt-4 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(statusFilter || debouncedSearchTerm) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
            <span className="text-sm text-slate-600">Active filters:</span>
            {statusFilter && (
              <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full flex items-center gap-1">
                {STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label}
                <button
                  onClick={() => setStatusFilter("")}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {debouncedSearchTerm && (
              <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full flex items-center gap-1">
                Search: "{debouncedSearchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
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
                This promo is currently being displayed to visitors
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

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Loading promotions...</p>
        </div>
      ) : promos && promos.length > 0 ? (
        <>
          {/* Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promos.map((p: any) => (
              <PromoCard key={p._id} data={p} />
            ))}
          </div>

          {/* Pagination Info & Load More Button */}
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-600">
              Showing {promos.length} of{" "}
              {pagination.total_promos || promos.length} promotions
              {pagination.total_pages > 1 &&
                ` • Page ${pagination.current_page || 1} of ${
                  pagination.total_pages
                }`}
            </p>

            {hasNextPage && (
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                {isFetchingNextPage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5" />
                    Load More
                  </>
                )}
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 flex flex-col items-center">
          <Megaphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            No promo found
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || statusFilter
              ? "Try adjusting your search or filters"
              : "Get started by creating your first promotion"}
          </p>
          <button
            onClick={() => {
              setShowModal("INPUT");
              setFormAction({});
              form.resetFields();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
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
              {formAction?._id ? "Edit Promotion" : "Add New Promotion"}
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
                    type="text"
                    name="link"
                    label="Redirect Link (Optional)"
                    placeholder="https://example.com or leave empty"
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
                {formAction?.banner?.data || formAction?.banner?.url ? (
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
                      }}
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
                  onClick={() => {
                    setShowModal("NONE");
                    setFormAction({});
                  }}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    formAction?._id ? updatePromo() : addPromo();
                  }}
                  disabled={addLoading || updateLoading}
                >
                  {addLoading || updateLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : formAction?._id ? (
                    "Update Promotion"
                  ) : (
                    "Add Promotion"
                  )}
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
            <p>Are you sure you want to delete this promo?</p>
            <div className="flex gap-5 mt-8 justify-center">
              <button
                onClick={() => {
                  setShowModal("NONE");
                  setSelected(null);
                }}
                disabled={deleteLoading}
                className="flex items-center justify-center gap-2 px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activate/Deactivate Modal */}
      {showModal === "ACTIVATE" && (
        <div className="fixed bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 top-0 right-0 left-0 bottom-0 m-0">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {selected?.is_active ? "Deactivate" : "Activate"} Promotion
            </h2>
            <p>
              Are you sure you want to{" "}
              {selected?.is_active ? "deactivate" : "activate"} this promo?
            </p>
            <div className="flex gap-5 mt-8 justify-center">
              <button
                onClick={() => {
                  setShowModal("NONE");
                  setSelected(null);
                }}
                disabled={activateLoading}
                className="flex items-center justify-center gap-2 px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                          } Data`,
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
                          } Data`,
                        );
                        setSelected(null);
                      },
                    },
                  );
                }}
                disabled={activateLoading}
                className="px-10 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activateLoading
                  ? "Processing..."
                  : selected?.is_active
                    ? "Deactivate"
                    : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
