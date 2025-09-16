/** @format */
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";

import { DeleteService, RegisterService, UserListService } from "./handler";

export const useUser = (): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ["user_list"],
    queryFn: async () => {
      try {
        const { data, status } = await UserListService();

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

export const useRegister = () => {
  return useMutation({
    mutationKey: ["register_user"],
    mutationFn: async (payload: {
      username: string;
      password: string;
      display_name: string;
    }) => {
      try {
        const response: any = await RegisterService(payload);

        if (response.status !== 201) throw new Error(response.message);

        return {
          data: response.data,
        };
      } catch (error: any) {
        throw new Error(error.message || "Success to Register User");
      }
    },
  });
};

export const useDelete = () => {
  return useMutation({
    mutationKey: ["delete_user"],
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
