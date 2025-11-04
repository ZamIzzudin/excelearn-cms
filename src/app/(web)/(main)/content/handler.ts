/** @format */

import AxiosClient from "@/lib/axios";

const headers = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export async function GetStatisticsService() {
  try {
    const { data: response } = await AxiosClient.get("/content/statistics");
    const { status, message, data } = response;
    if (status !== 200) throw new Error(message);
    return { status, message, data };
  } catch (error: any) {
    console.log(error);
    return error.message;
  }
}

export async function UpdateStatisticsService(payload: any) {
  try {
    const { data: response } = await AxiosClient.put("/content/statistics", payload);
    const { status, message, data } = response;
    if (status !== 200) throw new Error(message);
    return { status, message, data };
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
}

export async function GetPartnersService() {
  try {
    const { data: response } = await AxiosClient.get("/content/partners");
    const { status, message, data } = response;
    if (status !== 200) throw new Error(message);
    return { status, message, data };
  } catch (error: any) {
    console.log(error);
    return error.message;
  }
}

export async function CreatePartnerService(payload: any) {
  try {
    const { data: response } = await AxiosClient.post("/content/partners", payload, headers);
    const { status, message, data } = response;
    if (status !== 201) throw new Error(message);
    return { status, message, data };
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
}

export async function UpdatePartnerService(id: string, payload: any) {
  try {
    const { data: response } = await AxiosClient.put(`/content/partners/${id}`, payload, headers);
    const { status, message, data } = response;
    if (status !== 200) throw new Error(message);
    return { status, message, data };
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
}

export async function DeletePartnerService(id: string) {
  try {
    const { data: response } = await AxiosClient.delete(`/content/partners/${id}`);
    const { status, message } = response;
    if (status !== 200) throw new Error(message);
    return { status, message };
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
}

export async function GetTestimonialsService() {
  try {
    const { data: response } = await AxiosClient.get("/content/testimonials");
    const { status, message, data } = response;
    if (status !== 200) throw new Error(message);
    return { status, message, data };
  } catch (error: any) {
    console.log(error);
    return error.message;
  }
}

export async function CreateTestimonialService(payload: any) {
  try {
    const { data: response } = await AxiosClient.post("/content/testimonials", payload, headers);
    const { status, message, data } = response;
    if (status !== 201) throw new Error(message);
    return { status, message, data };
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
}

export async function UpdateTestimonialService(id: string, payload: any) {
  try {
    const { data: response } = await AxiosClient.put(`/content/testimonials/${id}`, payload, headers);
    const { status, message, data } = response;
    if (status !== 200) throw new Error(message);
    return { status, message, data };
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
}

export async function DeleteTestimonialService(id: string) {
  try {
    const { data: response } = await AxiosClient.delete(`/content/testimonials/${id}`);
    const { status, message } = response;
    if (status !== 200) throw new Error(message);
    return { status, message };
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
}

export async function GetMetadataService() {
  try {
    const { data: response } = await AxiosClient.get("/content/metadata");
    const { status, message, data } = response;
    if (status !== 200) throw new Error(message);
    return { status, message, data };
  } catch (error: any) {
    console.log(error);
    return error.message;
  }
}

export async function UpdateMetadataService(payload: any) {
  try {
    const { data: response } = await AxiosClient.put("/content/metadata", payload);
    const { status, message, data } = response;
    if (status !== 200) throw new Error(message);
    return { status, message, data };
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
}
