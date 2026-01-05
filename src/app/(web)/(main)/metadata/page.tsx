/** @format */

"use client";

import { useState } from "react";
import { Table, Button, Space, Tag, Popconfirm, Modal } from "antd";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { useMetadataList, useDeleteMetadata } from "./hook";
import MetadataForm from "./components/MetadataForm";
import Notification from "@/components/Notification";

export default function MetadataPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const { data: metadataList = [], isLoading, refetch } = useMetadataList();
  const { mutate: deleteMetadata, isPending: isDeleting } = useDeleteMetadata();

  const handleEdit = (record: any) => {
    setSelectedMetadata(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMetadata(id, {
      onSuccess: () => {
        Notification("success", "Metadata deleted successfully");
        refetch();
      },
      onError: (error: any) => {
        Notification("error", error.message || "Failed to delete metadata");
      },
    });
  };

  const handlePreview = (record: any) => {
    setPreviewData(record);
    setIsPreviewOpen(true);
  };

  const handleAddNew = () => {
    setSelectedMetadata(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMetadata(null);
  };

  const columns = [
    {
      title: "Page",
      dataIndex: "page",
      key: "page",
      width: 120,
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (text: string) => (
        <span className="text-slate-700 max-w-xs">{text}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 250,
      render: (text: string) => (
        <span className="text-slate-600 text-sm line-clamp-2">{text}</span>
      ),
    },
    {
      title: "Keywords",
      dataIndex: "keywords",
      key: "keywords",
      width: 150,
      render: (keywords: string[]) =>
        keywords && keywords.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {keywords.slice(0, 2).map((k, i) => (
              <Tag key={i} color="blue" className="text-xs">
                {k}
              </Tag>
            ))}
            {keywords.length > 2 && (
              <Tag className="text-xs">+{keywords.length - 2}</Tag>
            )}
          </div>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag
          color={status === "PUBLISHED" ? "green" : "orange"}
          className="text-xs font-semibold"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      width: 100,
      render: (lang: string) => <span className="text-slate-600">{lang}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            onClick={() => handlePreview(record)}
            icon={<Eye className="w-4 h-4" />}
          />
          <Button
            type="text"
            size="small"
            onClick={() => handleEdit(record)}
            icon={<Edit className="w-4 h-4" />}
          />
          <Popconfirm
            title="Delete Metadata"
            description="Are you sure you want to delete this metadata?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              size="small"
              disabled={isDeleting}
              icon={<Trash2 className="w-4 h-4" />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Metadata Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage SEO metadata for all static pages
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          onClick={handleAddNew}
          icon={<Plus className="w-5 h-5" />}
          className="h-12 px-6"
        >
          Add Metadata
        </Button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-900 text-sm">
          <span className="font-semibold">Tip:</span> Update metadata to improve
          SEO performance. Published metadata will be visible on the website.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table
          columns={columns}
          dataSource={metadataList}
          loading={isLoading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} metadata`,
          }}
          scroll={{ x: 1200 }}
        />
      </div>

      {/* Modal for Form */}
      <Modal
        title={selectedMetadata ? "Edit Metadata" : "Add New Metadata"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        className="metadata-modal"
      >
        <MetadataForm
          metadata={selectedMetadata}
          onSuccess={() => {
            handleCloseModal();
            refetch();
          }}
        />
      </Modal>

      {/* Preview Modal */}
      <Modal
        title="Metadata Preview"
        open={isPreviewOpen}
        onCancel={() => setIsPreviewOpen(false)}
        footer={null}
        width={800}
      >
        {previewData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Page
                </label>
                <p className="text-slate-900 font-semibold mt-1">
                  {previewData.page}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Status
                </label>
                <p className="mt-1">
                  <Tag
                    color={
                      previewData.status === "PUBLISHED" ? "green" : "orange"
                    }
                  >
                    {previewData.status}
                  </Tag>
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600">
                Title
              </label>
              <p className="text-slate-900 mt-1">{previewData.title}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600">
                Description
              </label>
              <p className="text-slate-700 mt-1">{previewData.description}</p>
            </div>

            {previewData.keywords && previewData.keywords.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  Keywords
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {previewData.keywords.map((k: string, i: number) => (
                    <Tag key={i} color="blue">
                      {k}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {previewData.og_image && (
              <div>
                <label className="text-sm font-semibold text-slate-600">
                  OG Image Preview
                </label>
                <img
                  src={previewData.og_image}
                  alt="OG Image"
                  className="mt-2 max-w-full h-auto rounded-lg border border-slate-200"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <label className="text-sm text-slate-600">OG Title</label>
                <p className="text-slate-700 text-sm mt-1">{previewData.og_title || "-"}</p>
              </div>
              <div>
                <label className="text-sm text-slate-600">Language</label>
                <p className="text-slate-700 text-sm mt-1">{previewData.language || "-"}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
