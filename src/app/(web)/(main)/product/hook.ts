/** @format */

import {
  useMutation,
  useQuery,
  UseQueryResult,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import {
  ProductListService,
  ProductDetailService,
  CreateService,
  UpdateService,
  DeleteService,
} from "./handler";

interface UseProductsParams {
  product_category?: string;
  product_name?: string;
  sort_order?: string;
}

export const useProducts = (
  params: UseProductsParams = {}
): UseInfiniteQueryResult<any> => {
  const { product_category, product_name, sort_order = "desc" } = params;

  return useInfiniteQuery({
    queryKey: ["product_list", product_category, product_name, sort_order],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const { data, status } = await ProductListService({
          page: pageParam,
          product_category,
          product_name,
          sort_order,
        });

        if (status !== 200) throw new Error();

        return data;
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

export const useProductsDetail = (param: string): UseQueryResult<any> => {
  return useQuery({
    queryKey: ["product_detail"],
    queryFn: async () => {
      try {
        const { data, status } = await ProductDetailService(param);

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

export const useCreateProduct = () => {
  return useMutation({
    mutationKey: ["create_product"],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await CreateService(payload);

        if (response.status !== 201) throw new Error(response.message);

        return {
          data: response.data,
        };
      } catch (error: any) {
        throw new Error(error.message || "Success to Add Product");
      }
    },
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationKey: ["update_product"],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await UpdateService(id, data);

        if (response.status !== 200) throw new Error(response.message);

        return {
          data: response.data,
        };
      } catch (error: any) {
        throw new Error(error.message || "Success to Update Product");
      }
    },
  });
};

export const useDelete = () => {
  return useMutation({
    mutationKey: ["delete_product"],
    mutationFn: async (payload: string) => {
      try {
        const response: any = await DeleteService(payload);

        if (response.status !== 200) throw new Error(response.message);

        return {
          data: response.data,
        };
      } catch (error: any) {
        throw new Error(error.message || "Success to Delete Product");
      }
    },
  });
};
