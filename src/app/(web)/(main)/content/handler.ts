/** @format */

import AxiosClient from "@/lib/axios";

const headers = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export async function PartnerListService() {
  try {
    const { data: response } = await AxiosClient.get("/partner/list");

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

export async function CreatePartnerService(payload: any) {
  try {
    const { data: response } = await AxiosClient.post(
      "/partner/add",
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

export async function UpdatePartnerService(id: string, payload: any) {
  try {
    const { data: response } = await AxiosClient.put(
      `/partner/adjust/${id}`,
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

export async function DeletePartnerService(payload: string) {
  try {
    const { data: response } = await AxiosClient.delete(
      `/partner/takedown/${payload}`
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

export async function TestimonialListService() {
  try {
    const { data: response } = await AxiosClient.get("/testimonial/list");

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

export async function CreateTestimonialService(payload: any) {
  try {
    const { data: response } = await AxiosClient.post(
      "/testimonial/add",
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

export async function UpdateTestimonialService(id: string, payload: any) {
  try {
    const { data: response } = await AxiosClient.put(
      `/testimonial/adjust/${id}`,
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

export async function DeleteTestimonialService(payload: string) {
  try {
    const { data: response } = await AxiosClient.delete(
      `/testimonial/takedown/${payload}`
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

export async function StatisticListService() {
  try {
    const { data: response } = await AxiosClient.get("/stat/detail");

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

export async function UpdateStatisticService(payload: any) {
  try {
    const { data: response } = await AxiosClient.put(
      `/stat/adjust`,
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

export async function SocmedListService() {
  try {
    const { data: response } = await AxiosClient.get("/socmed/list");

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

export async function UpdateSocmedService(id: string, payload: any) {
  try {
    const { data: response } = await AxiosClient.put(
      `/socmed/adjust/${id}`,
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

export async function AssetListService() {
  try {
    const { data: response } = await AxiosClient.get("/assets/list");

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

export async function UpdateAssetService(id: string, payload: FormData) {
  try {
    const { data: response } = await AxiosClient.put(
      `/assets/adjust/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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

export async function UpdateAssetUrlService(
  id: string,
  payload: { url?: string; fallback_url?: string }
) {
  try {
    const { data: response } = await AxiosClient.put(
      `/assets/adjust-url/${id}`,
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


