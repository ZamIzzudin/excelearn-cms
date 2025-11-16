/** @format */

"use client";

import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, Copy } from "lucide-react";
import { useRouter } from "next/navigation";

// Dummy data untuk halaman yang sudah dibuat
const dummyPages = [
  {
    id: 1,
    title: "Homepage",
    slug: "homepage",
    status: "published",
    lastModified: "2024-01-15",
  },
  {
    id: 2,
    title: "About Us",
    slug: "about-us",
    status: "draft",
    lastModified: "2024-01-14",
  },
  {
    id: 3,
    title: "Services",
    slug: "services",
    status: "published",
    lastModified: "2024-01-13",
  },
  {
    id: 4,
    title: "Contact",
    slug: "contact",
    status: "published",
    lastModified: "2024-01-12",
  },
];

export default function PagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const router = useRouter();

  const filteredPages = dummyPages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePage = () => {
    if (!newPageTitle.trim()) return;

    const slug = newPageSlug || newPageTitle.toLowerCase().replace(/\s+/g, "-");
    console.log("Creating new page:", { title: newPageTitle, slug });

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
    router.push(
      `/pages/editor?id=${page.id}&title=${encodeURIComponent(
        page.title
      )}&slug=${page.slug}`
    );
  };

  const handleDuplicatePage = (page: any) => {
    console.log("Duplicating page:", page);
    router.push(
      `/pages/editor?duplicate=${page.id}&title=${encodeURIComponent(
        page.title + " Copy"
      )}&slug=${page.slug}-copy`
    );
  };

  const handleDeletePage = (pageId: number) => {
    console.log("Deleting page:", pageId);
    // Implement delete logic
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
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-500" />
            Filter
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPages.map((page) => (
          <div
            key={page.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* Thumbnail */}
            <div className="relative h-48 bg-slate-100">
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                <h1 className="font-semibold text-gray-500">{page.title}</h1>
                <button
                  onClick={() => handleEditPage(page)}
                  className="opacity-0 group-hover:opacity-100 bg-white text-slate-800 px-4 py-2 rounded-lg font-medium transition-all transform scale-95 group-hover:scale-100 absolute"
                >
                  Edit Page
                </button>
                <span
                  className={`top-5 right-5 absolute inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    page.status === "published"
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
                <span className="text-sm text-slate-500">/{page.slug}</span>

                <div className="flex items-center gap-2 justify-between">
                  <button
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4 text-slate-500" />
                  </button>
                  <button
                    onClick={() => handleDeletePage(page.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
