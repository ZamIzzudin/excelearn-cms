/** @format */
"use client";

import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { Login } from "./serviceAuth";

import { LocalToken } from "src/lib/var";
import { cookies } from "@/lib/utils";

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (payload: { username: string; password: string }) => {
      try {
        const response: any = await Login(payload);

        if (response.status !== 200) throw new Error(response.message);

        window.localStorage.setItem(LocalToken, response.user.access_token);
        cookies.add(LocalToken, response.user.access_token);

        return {
          data: response.user,
          token: response.user.access_token,
        };
      } catch (error: any) {
        throw new Error(error.message || "Gagal Melakukan Login");
      }
    },
  });
};

export const useUser = (params: string): UseQueryResult<any> => {
  const queryResult = useQuery({
    queryKey: ["user", params],
    queryFn: async () => {
      return {};
    },
    enabled: !!params,
    refetchOnWindowFocus: false,
  });

  return queryResult;
};
