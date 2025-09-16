/** @format */

"use client";

import { useState } from "react";

import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import InputForm from "src/components/Form";
import Notification from "@/components/Notification";
import { Form } from "antd";

import dayjs from "dayjs";
import { useUser, useRegister, useDelete } from "./hook";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form] = Form.useForm();

  const { data = [], isLoading, refetch } = useUser();
  const { mutate: registerUser, isPending: registerPending } = useRegister();
  const { mutate: deleteUser, isPending: deletePending } = useDelete();

  const filteredUsers = data?.filter((user: any) =>
    user.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    try {
      await form.validateFields();

      const data = form.getFieldsValue();

      if (data.retype_password !== data.password)
        return Notification("error", "Password Not Match");

      registerUser(data, {
        onSuccess: () => {
          Notification("success", "Success to Register User");
          setShowAddModal(false);
          form.resetFields();
          refetch();
        },
        onError: () => {
          Notification("error", "Failed to Register User");
        },
      });
    } catch (e) {
      Notification("error", "Server Error");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      deleteUser(id, {
        onSuccess: () => {
          Notification("success", "Success to Register User");
          refetch();
        },
        onError: () => {
          Notification("error", "Failed to Delete User");
        },
      });
    } catch (e) {
      Notification("error", "Server Error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Users</h1>
          <p className="text-slate-600 mt-1">
            Manage your team members and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
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

      {/* Users Table */}
      {isLoading ? (
        <div className="animate-pulse bg-gray-100 w-full min-h-[30dvh] rounded-xl"></div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">
                    User
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">
                    Role
                  </th>

                  <th className="text-left py-4 px-6 font-medium text-slate-700">
                    Created At
                  </th>
                  <th className="text-right py-4 px-6 font-medium text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers?.map((user: any) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium text-sm">
                            {user?.username ? user?.username[0] : "A"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {user.display_name}
                          </p>
                          <p className="text-sm text-slate-500 capitalize">
                            {user?.username?.toLowerCase() || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "SUPERADMIN"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user?.role}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-600">
                      {dayjs(user.created_at).format("DD MMMM YYYY")}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-slate-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user?._id)}
                          type="button"
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Add New User
            </h2>
            <Form form={form} layout="vertical" requiredMark={false}>
              <InputForm
                type="text"
                name="display_name"
                label="Full Name"
                placeholder="Enter full name"
                required
              />
              <InputForm
                type="text"
                name="username"
                label="Username"
                placeholder="Enter username"
                required
              />
              <InputForm
                type="password"
                name="password"
                label="Password"
                placeholder="Enter password"
                required
              />
              <InputForm
                type="password"
                name="retype_password"
                label="Retype Password"
                placeholder="Retype password"
                required
              />

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddUser()}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Add User
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
