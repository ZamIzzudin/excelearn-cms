/** @format */
"use client";

import { useRouter } from "next/navigation";
import { useGlobalState } from "src/lib/middleware";

import { useLogin } from "src/hooks/useAuth";

import { Form } from "antd";
import InputForm from "src/components/Form";
import Notification from "src/components/Notification";
import { User, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [formAction] = Form.useForm();

  const { actions } = useGlobalState();
  const { mutate, isPending } = useLogin();

  const handleLogin = async () => {
    formAction.validateFields();

    const payload = await formAction.getFieldsValue();

    mutate(payload, {
      onSuccess(resp) {
        actions.setAuth(resp.data);
        actions.setToken(resp.token);
        Notification("success", "Berhasil Login");
        router.push("/");
      },
      onError(error) {
        Notification("error", error.message || "Gagal Login");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Excelearn Internal
          </h1>
          <p className="text-slate-600">Sign in to your dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <Form
            form={formAction}
            onFinish={handleLogin}
            layout="vertical"
            className="space-y-6"
            requiredMark={false}
          >
            <InputForm
              type="text"
              name="username"
              placeholder="Enter your username"
              label="Username"
              icon={<User className="w-5 h-5 text-slate-400" />}
              required
              className="mb-0"
            />

            <InputForm
              type="password"
              name="password"
              placeholder="Enter your password"
              label="Password"
              icon={<Lock className="w-5 h-5 text-slate-400" />}
              required
              className="mb-0"
            />

            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </Form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            Secure dashboard access for authorized users only
          </p>
        </div>
      </div>
    </div>
  );
}
