/** @format */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Package, Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { Tooltip } from "antd";

import Notification from "@/components/Notification";

import { useProducts, useDelete } from "./hook";

const CATEGORIES = [
  { value: "All", label: "All Categories" },
  { value: "IT Training", label: "IT Training" },
  { value: "IT Consultant", label: "IT Consultant" },
  { value: "IT Support", label: "IT Support" },
];

export default function ProductPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const [selected, setSelected] = useState(null);

  const { data: products, isLoading, refetch } = useProducts();
  const { mutate: deleteProduct, isPending } = useDelete();

  function ProductCard({ product }: any) {
    return (
      <div
        key={product._id}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        {product.banner?.url ? (
          <div className="h-48 bg-slate-100 overflow-hidden">
            <Image
              src={product.banner?.url}
              alt={product.banner?.public_id}
              className="w-full h-full object-cover"
              width={250}
              height={250}
            />
          </div>
        ) : null}

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <Tooltip placement="top" title={product?.product_name || "-"}>
              <h3 className="text-lg font-semibold text-slate-800 truncate max-w-[60%]">
                {product.product_name}
              </h3>
            </Tooltip>
            <span className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
              {product.product_category?.replace("_", " ")}
            </span>
          </div>

          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {product.overview_produk}
          </p>

          <div className="space-y-2 mb-4 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Skill Level:</span>
              <span className="font-medium capitalize">
                {product.skill_level.toLowerCase()?.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-medium">
                {product.duration} Minutes/Session
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-slate-200">
            <button
              onClick={() => router.push(`/product/editor?id=${product._id}`)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => {
                setSelected(product._id);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-600 mt-1">Manage your service products</p>
        </div>
        <button
          onClick={() => router.push("/product/editor")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search product..."
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

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <ProductCard product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 flex flex-col items-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            No products found
          </h3>
          <p className="text-slate-600 mb-6">
            {searchTerm
              ? "Try adjusting your search or filters"
              : "Get started by creating your first product"}
          </p>
          <button
            onClick={() => router.push("/product/editor")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      )}

      {selected ? (
        <div className="fixed bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 top-0 right-0 left-0 bottom-0 m-0">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Delete Product
            </h2>
            <p>Are you sure want to delete this product?</p>
            <div className="flex gap-5 mt-8 justify-center">
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                }}
                className="flex items-center justify-center gap-2 px-10 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={isPending}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(selected, {
                    onSuccess: () => {
                      Notification("success", "Success Delete Data");
                      refetch();
                      setSelected(null);
                    },
                    onError: () => {
                      Notification("error", "Failed to Delete Data");
                      setSelected(null);
                    },
                  });
                }}
                className="px-10 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isPending}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
