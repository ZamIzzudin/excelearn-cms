/** @format */

"use server";

import AxiosClient from "src/lib/axios";

export async function UserListService() {
  try {
    const { data: response } = await AxiosClient.get("/auth/list");

    const { status, message, data } = response;

    if (status !== 200) throw new Error(message);

    return {
      status,
      message,
      data,
    };
  } catch (error: any) {
    return error.response.data;
  }
}

export async function RegisterService(payload: {
  username: string;
  password: string;
  display_name: string;
}) {
  try {
    const { data: response } = await AxiosClient.post(
      "/auth/register",
      payload
    );

    const { status, message, data } = response;
    console.log(response);

    if (status !== 201) throw new Error(message);

    return {
      status,
      message,
      data,
    };
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
}

export async function UpdateService(payload: {
  username: string;
  password: string;
  display_name: string;
}) {
  try {
    const { data: response } = await AxiosClient.post(
      "/auth/register",
      payload
    );

    const { status, message, data } = response;
    console.log(response);

    if (status !== 201) throw new Error(message);

    return {
      status,
      message,
      data,
    };
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
}

export async function DeleteService(payload: string) {
  try {
    const { data: response } = await AxiosClient.delete(
      `/auth/takedown/${payload}`
    );

    const { status, message } = response;

    if (status !== 200) throw new Error(message);

    return {
      status,
      message,
    };
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
}
