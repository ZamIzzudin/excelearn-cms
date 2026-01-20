/** @format */

import AxiosClient from "@/lib/axios";

const headers = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

interface ProductListParams {
  page?: number;
  product_category?: string;
  product_name?: string;
  sort_order?: string;
}

export async function ProductListService(params: ProductListParams = {}) {
  try {
    // Build query string
    const queryParams = new URLSearchParams();

    if (params.page) {
      queryParams.append("page", params.page.toString());
    }

    if (params.product_category) {
      queryParams.append("product_category", params.product_category);
    }

    if (params.product_name) {
      queryParams.append("product_name", params.product_name);
    }

    if (params.sort_order) {
      queryParams.append("sort_order", params.sort_order);
    }

    const queryString = queryParams.toString();
    const url = `/product/list${queryString ? `?${queryString}` : ""}`;

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
      headers,
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
      headers,
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
      `/product/takedown/${payload}`,
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
