/** @format */

"use server";

import AxiosClient from "@/lib/axios";

export async function Login(payload: { username: string; password: string }) {
  try {
    const { data } = await AxiosClient.post("/auth/login", payload);

    const { status, message, ...user } = data;

    if (status !== 200) throw new Error(message);

    return {
      status,
      message,
      user,
    };
  } catch (error: any) {
    return error.response.data;
  }
}
