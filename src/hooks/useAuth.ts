/** @format */
"use client";

import { useMutation } from "@tanstack/react-query";
import { Login } from "./serviceAuth";
import { useGlobalState } from "src/lib/middleware";

export const useLogin = () => {
  const { actions } = useGlobalState();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (payload: { username: string; password: string }) => {
      try {
        const response: any = await Login(payload);

        if (response.status !== 200) throw new Error(response.message);

        return {
          user: response.user,
          tokens: {
            access_token: response.user.access_token,
            refresh_token: response.user.refresh_token,
          },
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to Login");
      }
    },
    onSuccess: (data) => {
      actions.setAuth(data.user, data.tokens);
    },
  });
};

export const useLogout = () => {
  const { actions } = useGlobalState();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      try {
        // Optional: Call logout endpoint
        // await AxiosClient.post("/auth/logout");
        return true;
      } catch (error) {
        // Even if logout fails on server, clear local state
        return true;
      }
    },
    onSettled: () => {
      actions.logout();
    },
  });
};

export const useRefreshToken = () => {
  const { actions } = useGlobalState();

  return useMutation({
    mutationKey: ["refresh-token"],
    mutationFn: async (refreshToken: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          }
        );

        if (!response.ok) {
          throw new Error("Token refresh failed");
        }

        const data = await response.json();
        return {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to refresh token");
      }
    },
    onSuccess: (tokens) => {
      actions.setTokens(tokens);
    },
    onError: () => {
      actions.logout();
    },
  });
};