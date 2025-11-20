/** @format */

"use client";

import AxiosClient from "@/lib/axios";

const headers = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

interface PromoListParams {
  page?: number;
  promo_name?: string;
  is_active?: boolean | string;
  sort_order?: string;
}

export async function PromoListService(params: PromoListParams = {}) {
  try {
    // Build query string
    const queryParams = new URLSearchParams();

    if (params.page) {
      queryParams.append("page", params.page.toString());
    }

    if (params.promo_name) {
      queryParams.append("promo_name", params.promo_name);
    }

    if (params.is_active !== undefined && params.is_active !== "") {
      queryParams.append("is_active", params.is_active.toString());
    }

    if (params.sort_order) {
      queryParams.append("sort_order", params.sort_order);
    }

    const queryString = queryParams.toString();
    const url = `/promo/list${queryString ? `?${queryString}` : ""}`;

    const { data: response } = await AxiosClient.get(url);

    const { status, message, data, pagination } = response;

    if (status !== 200) throw new Error(message);

    return {
      status,
      message,
      data: {
        data,
        pagination,
      },
    };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}
export async function CreateService(payload: any) {
  try {
    const { data: response } = await AxiosClient.post(
      "/promo/add",
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
      `/promo/adjust/${id}`,
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

export async function ActivatePromoService(id: string, payload: any) {
  try {
    const { data: response } = await AxiosClient.put(
      `/promo/active/${id}`,
      payload
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
      `/promo/takedown/${payload}`
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
