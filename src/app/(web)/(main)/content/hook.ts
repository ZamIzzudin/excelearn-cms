/** @format */

import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  PartnerListService,
  CreatePartnerService,
  UpdatePartnerService,
  DeletePartnerService,
  TestimonialListService,
  CreateTestimonialService,
  UpdateTestimonialService,
  DeleteTestimonialService,
  StatisticListService,
  UpdateStatisticService,
  SocmedListService,
  UpdateSocmedService,
} from "./handler";

export const usePartner = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["partner-list"],
    queryFn: async () => {
      try {
        const { data, status } = await PartnerListService();
        if (status !== 200) throw new Error();
        return data;
      } catch (e) {
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreatePartner = () => {
  return useMutation({
    mutationKey: ["create_partner"],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await CreatePartnerService(payload);
        if (response.status !== 201) throw new Error(response.message);
        return { data: response.data };
      } catch (error: any) {
        throw new Error(error.message || "Failed to create partner");
      }
    },
  });
};

export const useUpdatePartner = () => {
  return useMutation({
    mutationKey: ["update_partner"],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await UpdatePartnerService(id, data);
        if (response.status !== 200) throw new Error(response.message);
        return { data: response.data };
      } catch (error: any) {
        throw new Error(error.message || "Failed to update partner");
      }
    },
  });
};

export const useDeletePartner = () => {
  return useMutation({
    mutationKey: ["delete_partner"],
    mutationFn: async (id: string) => {
      try {
        const response: any = await DeletePartnerService(id);
        if (response.status !== 200) throw new Error(response.message);
        return { data: response.data };
      } catch (error: any) {
        throw new Error(error.message || "Failed to delete partner");
      }
    },
  });
};

export const useTestimonial = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["partner-list"],
    queryFn: async () => {
      try {
        const { data, status } = await TestimonialListService();
        if (status !== 200) throw new Error();
        return data;
      } catch (e) {
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateTestimonial = () => {
  return useMutation({
    mutationKey: ["create_partner"],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await CreateTestimonialService(payload);
        if (response.status !== 201) throw new Error(response.message);
        return { data: response.data };
      } catch (error: any) {
        throw new Error(error.message || "Failed to create partner");
      }
    },
  });
};

export const useUpdateTestimonial = () => {
  return useMutation({
    mutationKey: ["update_partner"],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await UpdateTestimonialService(id, data);
        if (response.status !== 200) throw new Error(response.message);
        return { data: response.data };
      } catch (error: any) {
        throw new Error(error.message || "Failed to update partner");
      }
    },
  });
};

export const useDeleteTestimonial = () => {
  return useMutation({
    mutationKey: ["delete_partner"],
    mutationFn: async (id: string) => {
      try {
        const response: any = await DeleteTestimonialService(id);
        if (response.status !== 200) throw new Error(response.message);
        return { data: response.data };
      } catch (error: any) {
        throw new Error(error.message || "Failed to delete partner");
      }
    },
  });
};

export const useStatistic = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["partner-list"],
    queryFn: async () => {
      try {
        const { data, status } = await StatisticListService();
        if (status !== 200) throw new Error();
        return data;
      } catch (e) {
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useUpdateStatistic = () => {
  return useMutation({
    mutationKey: ["update_partner"],
    mutationFn: async (data: any) => {
      try {
        const response: any = await UpdateStatisticService(data);
        if (response.status !== 200) throw new Error(response.message);
        return { data: response.data };
      } catch (error: any) {
        throw new Error(error.message || "Failed to update partner");
      }
    },
  });
};

export const useSocmed = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["socmed-list"],
    queryFn: async () => {
      try {
        const { data, status } = await SocmedListService();
        if (status !== 200) throw new Error();
        return data;
      } catch (e) {
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useUpdateSocmed = () => {
  return useMutation({
    mutationKey: ["update_socmed"],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await UpdateSocmedService(id, data);
        if (response.status !== 200) throw new Error(response.message);
        return { data: response.data };
      } catch (error: any) {
        throw new Error(error.message || "Failed to update social media");
      }
    },
  });
};


