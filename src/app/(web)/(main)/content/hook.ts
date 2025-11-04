/** @format */

import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  GetStatisticsService,
  UpdateStatisticsService,
  GetPartnersService,
  CreatePartnerService,
  UpdatePartnerService,
  DeletePartnerService,
  GetTestimonialsService,
  CreateTestimonialService,
  UpdateTestimonialService,
  DeleteTestimonialService,
  GetMetadataService,
  UpdateMetadataService,
} from "./handler";

export const useStatistics = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      try {
        const { data, status } = await GetStatisticsService();
        if (status !== 200) throw new Error();
        return data;
      } catch (e) {
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useUpdateStatistics = () => {
  return useMutation({
    mutationKey: ["update_statistics"],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await UpdateStatisticsService(payload);
        if (response.status !== 200) throw new Error(response.message);
        return { data: response.data };
      } catch (error: any) {
        throw new Error(error.message || "Failed to update statistics");
      }
    },
  });
};

export const usePartners = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      try {
        const { data, status } = await GetPartnersService();
        if (status !== 200) throw new Error();
        return data;
      } catch (e) {
        return [];
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

export const useTestimonials = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      try {
        const { data, status } = await GetTestimonialsService();
        if (status !== 200) throw new Error();
        return data;
      } catch (e) {
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useCreateTestimonial = () => {
  return useMutation({
    mutationKey: ["create_testimonial"],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await CreateTestimonialService(payload);
        if (response.status !== 201) throw new Error(response.message);
        return { data: response.data };
      } catch (error: any) {
        throw new Error(error.message || "Failed to create testimonial");
      }
    },
  });
};

export const useUpdateTestimonial = () => {
  return useMutation({
    mutationKey: ["update_testimonial"],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await UpdateTestimonialService(id, data);
        if (response.status !== 200) throw new Error(response.message);
        return { data: response.data };
      } catch (error: any) {
        throw new Error(error.message || "Failed to update testimonial");
      }
    },
  });
};

export const useDeleteTestimonial = () => {
  return useMutation({
    mutationKey: ["delete_testimonial"],
    mutationFn: async (id: string) => {
      try {
        const response: any = await DeleteTestimonialService(id);
        if (response.status !== 200) throw new Error(response.message);
        return { data: response.data };
      } catch (error: any) {
        throw new Error(error.message || "Failed to delete testimonial");
      }
    },
  });
};

export const useMetadata = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["metadata"],
    queryFn: async () => {
      try {
        const { data, status } = await GetMetadataService();
        if (status !== 200) throw new Error();
        return data;
      } catch (e) {
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useUpdateMetadata = () => {
  return useMutation({
    mutationKey: ["update_metadata"],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await UpdateMetadataService(payload);
        if (response.status !== 200) throw new Error(response.message);
        return { data: response.data };
      } catch (error: any) {
        throw new Error(error.message || "Failed to update metadata");
      }
    },
  });
};
