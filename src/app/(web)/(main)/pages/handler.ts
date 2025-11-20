/** @format */

import AxiosClient from "@/lib/axios";

const headers = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

interface PageListParams {
  page?: number;
  search?: string;
  status?: string;
  sort_order?: string;
}

/**
 * Service untuk mengambil list page dengan pagination
 * @param params - Parameter untuk filter dan pagination
 * @returns Promise dengan data page dan pagination info
 */
export async function PageListService(params?: PageListParams) {
  try {
    const { data: response } = await AxiosClient.get("/page/list", {
      params,
    });

    const { status, message, data, pagination } = response;

    if (status !== 200) throw new Error(message);

    return {
      status,
      message,
      data,
      pagination,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Failed to fetch page");
  }
}

/**
 * Service untuk mengambil detail single page
 * @param id - ID page
 * @returns Promise dengan data page detail
 */
export async function PageDetailService(id: string) {
  try {
    const { data: response } = await AxiosClient.get(`/page/detail/${id}`);

    const { status, message, data } = response;

    if (status !== 200) throw new Error(message);

    return {
      status,
      message,
      data,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Failed to fetch page detail");
  }
}

/**
 * Service untuk mengambil page layout by path (public)
 * @param path - Path page
 * @returns Promise dengan data page
 */
export async function PageLayoutService(path: string) {
  try {
    const { data: response } = await AxiosClient.get(`/page/public/${path}`);

    const { status, message, data } = response;

    if (status !== 200) throw new Error(message);

    return {
      status,
      message,
      data,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Failed to fetch page layout");
  }
}

/**
 * Service untuk create page baru
 * @param formData - FormData berisi data page (name, path, status, template, metadata, images)
 * @returns Promise dengan data page yang dibuat
 */
export async function CreateService(formData: FormData) {
  try {
    console.log("test");
    const { data: response } = await AxiosClient.post(
      "/page/add",
      formData,
      headers
    );

    console.log(formData);

    const { status, message, data } = response;

    if (status !== 201) throw new Error(message);

    return {
      status,
      message,
      data,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Failed to create page");
  }
}

/**
 * Service untuk update page yang sudah ada
 * @param id - ID page yang akan diupdate
 * @param formData - FormData berisi data page yang diupdate
 * @returns Promise dengan status update
 */
export async function UpdateService(id: string, formData: FormData) {
  try {
    const { data: response } = await AxiosClient.put(
      `/page/adjust/${id}`,
      formData,
      headers
    );

    const { status, message } = response;

    if (status !== 200) throw new Error(message);

    return {
      status,
      message,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Failed to update page");
  }
}

export async function TooglePublishService(id: string) {
  try {
    const { data: response } = await AxiosClient.put(`/page/pub/${id}`);

    const { status, message } = response;

    if (status !== 200) throw new Error(message);

    return {
      status,
      message,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Failed to delete page");
  }
}

/**
 * Service untuk delete page
 * @param id - ID page yang akan dihapus
 * @returns Promise dengan status delete
 */
export async function DeleteService(id: string) {
  try {
    const { data: response } = await AxiosClient.delete(`/page/takedown/${id}`);

    const { status, message } = response;

    if (status !== 200) throw new Error(message);

    return {
      status,
      message,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Failed to delete page");
  }
}
