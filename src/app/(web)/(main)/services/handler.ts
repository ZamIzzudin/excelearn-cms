/** @format */

import AxiosClient from "@/lib/axios";

const headers = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export async function ServiceListService() {
  try {
    const { data: response } = await AxiosClient.get("/service/list");

    const { status, message, data } = response;

    if (status !== 200) throw new Error(message);

    return {
      status,
      message,
      data,
    };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function ServiceDetailService(id: string) {
  try {
    const { data: response } = await AxiosClient.get(`/service/detail/${id}`);

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
      "/service/add",
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
      `/service/adjust/${id}`,
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
      `/service/takedown/${payload}`
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
