/** @format */

import {
  useMutation,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  ServiceListService,
  ServiceDetailService,
  CreateService,
  UpdateService,
  DeleteService,
} from "./handler";

export const useServices = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["service_list"],
    queryFn: async () => {
      try {
        const { data, status } = await ServiceListService();

        if (status !== 200) throw new Error();

        return data;
      } catch (e) {
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useServiceDetail = (param: string): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["service_detail", param],
    queryFn: async () => {
      try {
        const { data, status } = await ServiceDetailService(param);

        if (status !== 200) throw new Error();

        return data;
      } catch (e) {
        return {};
      }
    },
    enabled: !!param,
    refetchOnWindowFocus: false,
  });
};

export const useCreateService = () => {
  return useMutation({
    mutationKey: ["create_service"],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await CreateService(payload);

        if (response.status !== 201) throw new Error(response.message);

        return {
          data: response.data,
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to Add Service");
      }
    },
  });
};

export const useUpdateService = () => {
  return useMutation({
    mutationKey: ["update_service"],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await UpdateService(id, data);

        if (response.status !== 200) throw new Error(response.message);

        return {
          data: response.data,
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to Update Service");
      }
    },
  });
};

export const useDeleteService = () => {
  return useMutation({
    mutationKey: ["delete_service"],
    mutationFn: async (payload: string) => {
      try {
        const response: any = await DeleteService(payload);

        if (response.status !== 200) throw new Error(response.message);

        return {
          data: response.data,
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to Delete Service");
      }
    },
  });
};
