/** @format */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { LocalToken, LocalRefreshToken } from "./var";

interface ApiConfig {
  baseURL?: string;
  timeout?: number;
}

interface AuthTokens {
  access_token: string;
  refresh_token?: string;
}

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor(config: ApiConfig = {}) {
    this.instance = axios.create({
      baseURL:
        config.baseURL ||
        process.env.NEXT_PUBLIC_API ||
        "http://localhost:8000/api/v1",
      timeout: config.timeout || 10000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token to requests
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle token refresh
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.instance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            this.processQueue(null, newToken);
            
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.handleAuthError();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private getStoredToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(LocalToken) || this.getCookie(LocalToken);
    }
    return null;
  }

  private getStoredRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(LocalRefreshToken) || this.getCookie(LocalRefreshToken);
    }
    return null;
  }

  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  private setCookie(name: string, value: string, days: number = 7) {
    if (typeof document === "undefined") return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  }

  private removeCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = this.getStoredRefreshToken();
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post(
        `${this.instance.defaults.baseURL}/auth/refresh`,
        { refresh_token: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { access_token, refresh_token } = response.data;
      
      if (access_token) {
        this.setTokens({ access_token, refresh_token });
        return access_token;
      }

      throw new Error("Invalid refresh response");
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  private handleAuthError() {
    this.clearTokens();
    
    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  public setTokens(tokens: AuthTokens) {
    if (typeof window !== "undefined") {
      localStorage.setItem(LocalToken, tokens.access_token);
      this.setCookie(LocalToken, tokens.access_token);
      
      if (tokens.refresh_token) {
        localStorage.setItem(LocalRefreshToken, tokens.refresh_token);
        this.setCookie(LocalRefreshToken, tokens.refresh_token);
      }
    }
  }

  public clearTokens() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LocalToken);
      localStorage.removeItem(LocalRefreshToken);
      this.removeCookie(LocalToken);
      this.removeCookie(LocalRefreshToken);
    }
  }

  public isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  get api(): AxiosInstance {
    return this.instance;
  }

  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put<T>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.patch<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T>(url, config);
  }
}

const AxiosClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API || "http://localhost:8000/api/v1",
  timeout: 10000,
});

export default AxiosClient;