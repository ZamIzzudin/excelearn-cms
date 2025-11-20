/** @format */

import {
  useMutation,
  useQuery,
  UseQueryResult,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import {
  PageListService,
  PageDetailService,
  CreateService,
  UpdateService,
  TooglePublishService,
  DeleteService,
} from "./handler";

interface UsePagesParams {
  search?: string;
  status?: string;
  sort_order?: string;
}

/**
 * Hook untuk infinite list pages dengan search dan filter
 * @param params - Parameter untuk filter (search, status, sort_order)
 * @returns UseInfiniteQueryResult dengan data pages dan pagination
 *
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePages({
 *   search: "homepage",
 *   status: "published",
 *   sort_order: "desc"
 * });
 *
 * // Flatten all pages
 * const allPages = data?.pages.flatMap((page) => page.data) || [];
 */
export const usePages = (
  params: UsePagesParams = {}
): UseInfiniteQueryResult<any> => {
  const { search, status, sort_order = "desc" } = params;

  return useInfiniteQuery({
    queryKey: ["page_list", search, status, sort_order],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const {
          data,
          status: responseStatus,
          pagination,
        } = await PageListService({
          page: pageParam,
          search,
          status,
          sort_order,
        });

        if (responseStatus !== 200) throw new Error();

        return { data, pagination };
      } catch (e) {
        return { data: [], pagination: {} };
      }
    },
    getNextPageParam: (lastPage) => {
      // Return next page number if has_next is true, otherwise return undefined
      if (lastPage?.pagination?.has_next) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook untuk detail single page
 * @param param - ID page yang ingin diambil (string | null)
 * @returns UseQueryResult dengan data page detail
 *
 * @example
 * const { data: pageData, isLoading, isError } = usePageDetail("page_id_123");
 *
 * if (pageData) {
 *   console.log(pageData.name);
 *   console.log(pageData.template);
 * }
 */
export const usePageDetail = (param: string | null): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["page_detail", param],
    queryFn: async () => {
      try {
        const { data, status } = await PageDetailService(param!);

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

/**
 * Hook untuk create page baru
 * @returns UseMutationResult untuk create page
 *
 * @example
 * const createPage = useCreatePage();
 *
 * const handleCreate = async () => {
 *   const formData = new FormData();
 *   formData.append("name", "New Page");
 *   formData.append("path", "new-page");
 *   formData.append("status", "draft");
 *   formData.append("template", JSON.stringify([]));
 *   formData.append("metadata", JSON.stringify({}));
 *
 *   try {
 *     const result = await createPage.mutateAsync(formData);
 *     console.log("Created:", result.data);
 *     console.log("Message:", result.message);
 *   } catch (error) {
 *     console.error(error.message);
 *   }
 * };
 */
export const useCreatePage = () => {
  return useMutation({
    mutationKey: ["create_page"],
    mutationFn: async (payload: FormData) => {
      try {
        console.log(payload);
        const response: any = await CreateService(payload);

        if (response.status !== 201) throw new Error(response.message);

        return {
          data: response.data,
          message: response.message || "Page created successfully",
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to create page");
      }
    },
  });
};

/**
 * Hook untuk update page yang sudah ada
 * @returns UseMutationResult untuk update page
 *
 * @example
 * const updatePage = useUpdatePage();
 *
 * const handleUpdate = async (pageId: string) => {
 *   const formData = new FormData();
 *   formData.append("name", "Updated Name");
 *   formData.append("path", "updated-path");
 *   formData.append("status", "published");
 *   formData.append("template", JSON.stringify(template));
 *   formData.append("metadata", JSON.stringify(metadata));
 *
 *   try {
 *     const result = await updatePage.mutateAsync({
 *       id: pageId,
 *       data: formData
 *     });
 *     console.log("Message:", result.message);
 *   } catch (error) {
 *     console.error(error.message);
 *   }
 * };
 */
export const useUpdatePage = () => {
  return useMutation({
    mutationKey: ["update_page"],
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      try {
        const response: any = await UpdateService(id, data);

        if (response.status !== 200) throw new Error(response.message);

        return {
          data: response.data,
          message: response.message || "Page updated successfully",
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to update page");
      }
    },
  });
};

export const useTogglePublishPage = () => {
  return useMutation({
    mutationKey: ["publish_page"],
    mutationFn: async (payload: string) => {
      try {
        const response: any = await TooglePublishService(payload);

        if (response.status !== 200) throw new Error(response.message);

        return {
          data: response.data,
          message: response.message || "Page published successfully",
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to publish page");
      }
    },
  });
};

/**
 * Hook untuk delete page
 * @returns UseMutationResult untuk delete page
 *
 * @example
 * const deletePage = useDeletePage();
 *
 * const handleDelete = async (pageId: string) => {
 *   if (confirm("Are you sure?")) {
 *     try {
 *       const result = await deletePage.mutateAsync(pageId);
 *       console.log("Message:", result.message);
 *     } catch (error) {
 *       console.error(error.message);
 *     }
 *   }
 * };
 */
export const useDeletePage = () => {
  return useMutation({
    mutationKey: ["delete_page"],
    mutationFn: async (payload: string) => {
      try {
        const response: any = await DeleteService(payload);

        if (response.status !== 200) throw new Error(response.message);

        return {
          data: response.data,
          message: response.message || "Page deleted successfully",
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to delete page");
      }
    },
  });
};
