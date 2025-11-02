/** @format */
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";

import {
  PromoListService,
  CreateService,
  DeleteService,
  ActivatePromoService,
  UpdateService,
} from "./handler";

export const usePromo = (): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ["promo_list"],
    queryFn: async () => {
      try {
        const { data, status } = await PromoListService();

        if (status !== 200) throw new Error();

        return data;
      } catch (e) {
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  return queryResult;
};

export const useCreatePromo = () => {
  return useMutation({
    mutationKey: ["create_promo"],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await CreateService(payload);

        if (response.status !== 201) throw new Error(response.message);

        return {
          data: response.data,
        };
      } catch (error: any) {
        throw new Error(error.message || "Success to Create Promo");
      }
    },
  });
};

export const useUpdatePromo = () => {
  return useMutation({
    mutationKey: ["update_promo"],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await UpdateService(id, data);

        if (response.status !== 200) throw new Error(response.message);

        return {
          data: response.message,
        };
      } catch (error: any) {
        throw new Error(error.message || "Success to Update Promo");
      }
    },
  });
};

export const useActivatePromo = () => {
  return useMutation({
    mutationKey: ["update_promo"],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await ActivatePromoService(id, data);

        if (response.status !== 200) throw new Error(response.message);

        return {
          data: response.message,
        };
      } catch (error: any) {
        throw new Error(error.message || "Success to Update Promo");
      }
    },
  });
};

export const useDelete = () => {
  return useMutation({
    mutationKey: ["delete_promo"],
    mutationFn: async (payload: string) => {
      try {
        const response: any = await DeleteService(payload);

        if (response.status !== 200) throw new Error(response.message);

        return {
          data: response.data,
        };
      } catch (error: any) {
        throw new Error(error.message || "Success to Delete User");
      }
    },
  });
};

// export const useUser = (params: string): UseQueryResult<any> => {
//   const queryResult = useQuery({
//     queryKey: ["user", params],
//     queryFn: async () => {
//       const response = await UserListService();
//       return {};
//     },
//     enabled: !!params,
//     refetchOnWindowFocus: false,
//   });

//   return queryResult;
// };
