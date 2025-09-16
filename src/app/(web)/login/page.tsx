/** @format */
"use client";

import { useRouter } from "next/navigation";
import { useGlobalState } from "@/lib/middleware";

import { useLogin } from "@/hooks/useAuth";

import { Form } from "antd";
import InputForm from "@/components/Form";
import Notification from "@/components/Notification";

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
    <section className="min-h-[100dvh] min-w-[100dvw] flex items-center justify-center">
      <Form
        form={formAction}
        onFinish={handleLogin}
        layout="vertical"
        className="bg-white p-5 rounded flex flex-col items-center"
      >
        <h1 className="text-[24px] font-[600]">Login</h1>
        <InputForm
          type="text"
          name="username"
          placeholder="Masukkan username"
          label="Username"
        />
        <InputForm
          type="password"
          name="password"
          placeholder="Masukkan password"
          label="Password"
        />
        <button className="text-white bg-[#639b56] w-full py-2" type="submit">
          {isPending ? "Loading" : "Login"}
        </button>
      </Form>
    </section>
  );
}
