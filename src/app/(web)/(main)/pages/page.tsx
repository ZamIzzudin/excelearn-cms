/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Filter, Trash2, Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePages, useDeletePage, useTogglePublishPage } from "./hook";
import { useDebounce } from "@/hooks/useDebounce";
import Notification from "@/components/Notification";

export default function PagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Published" | "Draft"
  >("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const router = useRouter();
  const observerTarget = useRef(null);

  // Debounce search
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch pages dengan infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = usePages({
    search: debouncedSearch,
    status: statusFilter === "All" ? undefined : statusFilter,
  });

  // Delete mutation
  const deletePage = useDeletePage();
  const publishPage = useTogglePublishPage();

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten pages dari semua pages
  const allPages = data?.pages.flatMap((page: any) => page.data) || [];

  const handleCreatePage = () => {
    if (!newPageTitle.trim()) return;

    const slug = newPageSlug || newPageTitle.toLowerCase().replace(/\s+/g, "-");

    // Redirect ke canvas editor dengan page baru
    router.push(
      `/pages/editor?title=${encodeURIComponent(
        newPageTitle
      )}&slug=${slug}&new=true`
    );

    setShowCreateModal(false);
    setNewPageTitle("");
    setNewPageSlug("");
  };

  const handleEditPage = (page: any) => {
    router.push(`/pages/editor?id=${page._id}`);
  };

  const handleDeletePage = async (pageId: string, pageName: string) => {
    if (confirm(`Are you sure you want to delete "${pageName}"?`)) {
      try {
        await deletePage.mutateAsync(pageId);
        Notification("success", "Page deleted successfully!");
        // Refetch to update list
        refetch();
      } catch (error: any) {
        Notification("error", error.message || "Failed to delete page");
      }
    }
  };

  const handlePublishPage = async (pageId: string, pageName: string) => {
    if (confirm(`Are you sure you want to publish "${pageName}"?`)) {
      try {
        await publishPage.mutateAsync(pageId);
        Notification("success", "Page publish successfully!");
        // Refetch to update list
        refetch();
      } catch (error: any) {
        Notification("error", error.message || "Failed to publish page");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pages</h1>
          <p className="text-slate-600 mt-1">
            Create and manage dynamic pages with drag & drop components
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Page
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-slate-500" />
              <span className="capitalize">{statusFilter}</span>
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10">
                {["All", "Published", "Draft"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status as any);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl capitalize ${
                      statusFilter === status
                        ? "bg-indigo-50 text-indigo-600"
                        : ""
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">
            Failed to load pages. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && allPages.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {searchTerm ? "No pages found" : "No pages yet"}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm
                ? "Try adjusting your search or filters"
                : "Get started by creating your first page"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Page
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pages Grid */}
      {!isLoading && !isError && allPages.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allPages.map((page: any) => (
              <div
                key={page._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <h1 className="font-semibold text-gray-500 px-4 text-center">
                      {page.name}
                    </h1>
                    <button
                      onClick={() => handleEditPage(page)}
                      className="opacity-0 group-hover:opacity-100 bg-white text-slate-800 px-4 py-2 rounded-lg font-medium transition-all transform scale-95 group-hover:scale-100 absolute"
                    >
                      Edit Page
                    </button>
                    <span
                      className={`top-3 right-3 absolute inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        page.status === "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {page.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 truncate">
                      /{page.path}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePublishPage(page._id, page.name)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4 text-slate-500" />
                      </button>
                      <button
                        onClick={() => handleDeletePage(page._id, page.name)}
                        disabled={deletePage.isPending}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletePage.isPending ? (
                          <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Updated: {new Date(page.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          <div ref={observerTarget} className="flex justify-center py-8">
            {isFetchingNextPage && (
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            )}
            {!hasNextPage && allPages.length > 0 && (
              <p className="text-slate-500 text-sm">No more pages to load</p>
            )}
          </div>
        </>
      )}

      {/* Create Page Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Create New Page
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Page Title *
                </label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => {
                    setNewPageTitle(e.target.value);
                    if (!newPageSlug) {
                      setNewPageSlug(
                        e.target.value.toLowerCase().replace(/\s+/g, "-")
                      );
                    }
                  }}
                  placeholder="Enter page title"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="page-url-slug"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  URL: /{newPageSlug || "page-url-slug"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePage}
                disabled={!newPageTitle.trim()}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create & Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
