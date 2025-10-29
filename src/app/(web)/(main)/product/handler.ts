/** @format */

import AxiosClient from "@/lib/axios";

const headers = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export async function ProductListService() {
  try {
    const { data: response } = await AxiosClient.get("/product/list");

    const { status, message, data } = response;

    if (status !== 200) throw new Error(message);

    return {
      status,
      message,
      data,
    };
  } catch (error: any) {
    console.log(error);
    return error.message;
  }
}

export async function ProductDetailService(id: string) {
  try {
    const { data: response } = await AxiosClient.get(`/product/detail/${id}`);

    const { status, message, data } = response;

    if (status !== 200) throw new Error(message);

    return {
      status,
      message,
      data,
    };
  } catch (error: any) {
    console.log(error);
    return error.message;
  }
}

export async function CreateService(payload: any) {
  try {
    const { data: response } = await AxiosClient.post(
      "/product/add",
      payload,
      headers
    );

    const { status, message, data } = response;

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

export async function UpdateService(id: string, payload: any) {
  try {
    const { data: response } = await AxiosClient.put(
      `/product/adjust/${id}`,
      payload,
      headers
    );

    const { status, message, data } = response;

    if (status !== 200) throw new Error(message);

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
      `/product/takedown/${payload}`
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
