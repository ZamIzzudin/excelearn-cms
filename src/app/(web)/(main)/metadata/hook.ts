/** @format */

import {
  useMutation,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  MetadataListService,
  MetadataDetailService,
  MetadataByPageService,
  CreateMetadata,
  UpdateMetadata,
  PublishMetadata,
  DeleteMetadata,
} from "./handler";

export const useMetadataList = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["metadata_list"],
    queryFn: async () => {
      try {
        const { data, status } = await MetadataListService();

        if (status !== 200) throw new Error();

        return data;
      } catch (e) {
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useMetadataDetail = (id: string): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["metadata_detail", id],
    queryFn: async () => {
      try {
        const { data, status } = await MetadataDetailService(id);

        if (status !== 200) throw new Error();

        return data;
      } catch (e) {
        return null;
      }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useMetadataByPage = (page: string): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["metadata_by_page", page],
    queryFn: async () => {
      try {
        const { data, status } = await MetadataByPageService(page);

        if (status !== 200) throw new Error();

        return data;
      } catch (e) {
        return null;
      }
    },
    enabled: !!page,
    refetchOnWindowFocus: false,
  });
};

export const useCreateMetadata = () => {
  return useMutation({
    mutationKey: ["create_metadata"],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await CreateMetadata(payload);

        if (response.status !== 201) throw new Error(response.message);

        return {
          data: response.data,
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to Add Metadata");
      }
    },
  });
};

export const useUpdateMetadata = () => {
  return useMutation({
    mutationKey: ["update_metadata"],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await UpdateMetadata(id, data);

        if (response.status !== 200) throw new Error(response.message);

        return {
          data: response.data,
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to Update Metadata");
      }
    },
  });
};

export const usePublishMetadata = () => {
  return useMutation({
    mutationKey: ["publish_metadata"],
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      try {
        const response: any = await PublishMetadata(id, status);

        if (response.status !== 200) throw new Error(response.message);

        return {
          data: response.data,
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to Publish Metadata");
      }
    },
  });
};

export const useDeleteMetadata = () => {
  return useMutation({
    mutationKey: ["delete_metadata"],
    mutationFn: async (id: string) => {
      try {
        const response: any = await DeleteMetadata(id);

        if (response.status !== 200) throw new Error(response.message);

        return {
          data: response.data,
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to Delete Metadata");
      }
    },
  });
};
