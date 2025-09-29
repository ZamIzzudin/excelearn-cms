/** @format */

"use client";

import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, User } from "lucide-react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

// Dummy blog data
const dummyBlogs = [
  {
    id: 1,
    title: "Getting Started with Our Platform",
    description: "Learn how to make the most of our platform with this comprehensive guide...",
    banner: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
    author: "Admin",
    status: "published",
    publishDate: "2024-01-15",
    views: 1250,
    excerpt: "A comprehensive guide to help you get started with our platform and maximize your productivity.",
  },
  {
    id: 2,
    title: "Best Practices for Team Collaboration",
    description: "Discover effective strategies for improving team collaboration and productivity...",
    banner: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    author: "Admin",
    status: "draft",
    publishDate: "2024-01-14",
    views: 0,
    excerpt: "Essential tips and strategies for building better team collaboration in your organization.",
  },
  {
    id: 3,
    title: "Advanced Features You Should Know",
    description: "Explore advanced features that can help you work more efficiently...",
    banner: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    author: "Admin",
    status: "published",
    publishDate: "2024-01-13",
    views: 890,
    excerpt: "Unlock the full potential of our platform with these advanced features and techniques.",
  },
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogData, setBlogData] = useState(dummyBlogs);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const router = useRouter();

  const filteredBlogs = blogData.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBlog = () => {
    router.push("/blog/editor?new=true");
  };

  const handleEditBlog = (blog: any) => {
    router.push(`/blog/editor?id=${blog.id}`);
  };

  const handleDeleteBlog = (blogId: number) => {
    setBlogData(prev => prev.filter(blog => blog.id !== blogId));
    setShowDeleteModal(null);
  };

  const handlePreviewBlog = (blog: any) => {
    // Open preview in new tab
    window.open(`/blog/preview/${blog.id}`, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "archived":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Blog Management</h1>
          <p className="text-slate-600 mt-1">
            Create and manage your blog posts
          </p>
        </div>
        <button
          onClick={handleCreateBlog}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Post
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search blog posts..."
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

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* Blog Banner */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={blog.banner}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                    blog.status
                  )}`}
                >
                  {blog.status}
                </span>
              </div>
            </div>

            {/* Blog Content */}
            <div className="p-6">
              <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                {blog.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {blog.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {dayjs(blog.publishDate).format("MMM DD, YYYY")}
                </div>
                {blog.status === "published" && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {blog.views} views
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePreviewBlog(blog)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => handleEditBlog(blog)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(blog.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Delete Blog Post
            </h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBlog(showDeleteModal)}
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