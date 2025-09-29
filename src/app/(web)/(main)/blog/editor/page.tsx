/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, Eye, ArrowLeft, Upload, Calendar } from "lucide-react";
import InputForm from "src/components/Form";
import Notification from "src/components/Notification";
import { Form } from "antd";
import dayjs from "dayjs";

export default function BlogEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [blogData, setBlogData] = useState<any>({});

  const isNewBlog = searchParams.get("new") === "true";
  const blogId = searchParams.get("id");

  useEffect(() => {
    if (blogId && !isNewBlog) {
      // Load existing blog data
      // In real app, this would be an API call
      const dummyBlog = {
        id: parseInt(blogId),
        title: "Sample Blog Post",
        description: "This is a sample blog post content with rich text formatting...",
        banner: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
        excerpt: "A brief excerpt of the blog post",
        status: "draft",
        publishDate: dayjs().format("YYYY-MM-DD"),
        tags: ["technology", "tutorial"],
        metaTitle: "Sample Blog Post - SEO Title",
        metaDescription: "SEO description for the blog post",
      };
      
      setBlogData(dummyBlog);
      form.setFieldsValue(dummyBlog);
    }
  }, [blogId, isNewBlog, form]);

  const handleSaveBlog = async (values: any) => {
    try {
      setIsLoading(true);
      
      // Here you would save to your backend
      console.log("Saving blog:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Notification("success", isNewBlog ? "Blog post created successfully" : "Blog post updated successfully");
      
      if (isNewBlog) {
        router.push("/blog");
      }
    } catch (error) {
      Notification("error", "Failed to save blog post");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    const formData = form.getFieldsValue();
    console.log("Preview blog:", formData);
    // Open preview in new tab
    window.open("/blog/preview/temp", "_blank");
  };

  const handlePublish = async () => {
    try {
      const values = await form.validateFields();
      await handleSaveBlog({ ...values, status: "published" });
    } catch (error) {
      Notification("error", "Please fill in all required fields");
    }
  };

  const handleSaveDraft = async () => {
    try {
      const values = form.getFieldsValue();
      await handleSaveBlog({ ...values, status: "draft" });
    } catch (error) {
      Notification("error", "Failed to save draft");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {isNewBlog ? "Create New Post" : "Edit Blog Post"}
            </h1>
            <p className="text-slate-600 mt-1">
              {isNewBlog ? "Write and publish your new blog post" : "Update your blog post"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-5 h-5" />
            Preview
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Calendar className="w-5 h-5" />
            )}
            Publish
          </button>
        </div>
      </div>

      {/* Editor Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <Form form={form} onFinish={handleSaveBlog} layout="vertical">
              <InputForm
                type="text"
                name="title"
                label="Blog Title"
                placeholder="Enter your blog title"
                required
                className="mb-6"
              />

              <InputForm
                type="textarea"
                name="excerpt"
                label="Excerpt"
                placeholder="Brief description of your blog post"
                className="mb-6"
              />

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Content *
                </label>
                <div className="border border-slate-200 rounded-xl min-h-[400px] p-4">
                  <textarea
                    name="description"
                    placeholder="Write your blog content here... (In a real app, this would be a rich text editor like TinyMCE or Quill)"
                    className="w-full h-96 resize-none border-none outline-none"
                    defaultValue={blogData.description}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Rich text editor would be integrated here for better formatting
                </p>
              </div>

              <InputForm
                type="file"
                name="banner"
                label="Featured Image"
                accept="image/*"
                className="mb-6"
              />
            </Form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Publish Settings
            </h3>
            
            <Form form={form} layout="vertical">
              <InputForm
                type="select"
                name="status"
                label="Status"
                options={[
                  { label: "Draft", value: "draft" },
                  { label: "Published", value: "published" },
                  { label: "Archived", value: "archived" },
                ]}
                className="mb-4"
              />

              <InputForm
                type="date"
                name="publishDate"
                label="Publish Date"
                className="mb-4"
              />

              <InputForm
                type="text"
                name="tags"
                label="Tags"
                placeholder="technology, tutorial, guide"
                className="mb-4"
              />
            </Form>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              SEO Settings
            </h3>
            
            <Form form={form} layout="vertical">
              <InputForm
                type="text"
                name="metaTitle"
                label="Meta Title"
                placeholder="SEO title for search engines"
                className="mb-4"
              />

              <InputForm
                type="textarea"
                name="metaDescription"
                label="Meta Description"
                placeholder="SEO description for search engines"
                className="mb-4"
              />
            </Form>
          </div>

          {/* Preview Card */}
          {blogData.title && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Preview
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                {blogData.banner && (
                  <img
                    src={blogData.banner}
                    alt={blogData.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-4">
                  <h4 className="font-medium text-slate-800 mb-2 line-clamp-2">
                    {blogData.title}
                  </h4>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {blogData.excerpt}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}