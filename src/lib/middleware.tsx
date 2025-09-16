/** @format */
"use client";

import {
  ReactNode,
  useEffect,
  useContext,
  createContext,
  useReducer,
} from "react";

import { useRouter } from "next/navigation";

import {
  GlobalState,
  GlobalActions,
  GlobalProviderProps,
  Actions,
  User,
  AuthTokens,
} from "src/interface/type";
import { LocalToken, LocalRefreshToken } from "./var";
import { cookies } from "@/lib/utils";
import AxiosClient from "./axios";

const initialState: GlobalState = {
  hasLogin: false,
  user: null,
  token: undefined,
  refreshToken: undefined,
  isLoading: true,
};

const GlobalContext = createContext<GlobalProviderProps | undefined>(undefined);

function globalReducer(state: GlobalState, action: Actions): GlobalState {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        hasLogin: !!action.payload.user,
        user: action.payload.user,
        token: action.payload.tokens?.access_token || state.token,
        refreshToken: action.payload.tokens?.refresh_token || state.refreshToken,
        isLoading: false,
      };
    case "SET_TOKENS":
      return {
        ...state,
        token: action.payload.access_token,
        refreshToken: action.payload.refresh_token || state.refreshToken,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
}

export async function Middleware({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(globalReducer, initialState);

  const actions: GlobalActions = {
    setAuth: (user: User | null, tokens?: AuthTokens) => {
      dispatch({ type: "SET_AUTH", payload: { user, tokens } });
      
      if (tokens) {
        AxiosClient.setTokens(tokens);
      }
    },

    setTokens: (tokens: AuthTokens) => {
      dispatch({ type: "SET_TOKENS", payload: tokens });
      AxiosClient.setTokens(tokens);
    },

    setLoading: (loading: boolean) => {
      dispatch({ type: "SET_LOADING", payload: loading });
    },

    logout: () => {
      dispatch({ type: "LOGOUT" });
      AxiosClient.clearTokens();
      
      if (typeof window !== "undefined") {
        localStorage.removeItem(LocalToken);
        localStorage.removeItem(LocalRefreshToken);
        cookies.remove(LocalToken);
        cookies.remove(LocalRefreshToken);
        router.push("/login");
      }
    },

    checkAuth: async (): Promise<boolean> => {
      try {
        actions.setLoading(true);
        
        if (!AxiosClient.isAuthenticated()) {
          actions.setLoading(false);
          return false;
        }

        // Verify token with backend
        const response = await AxiosClient.get("/auth/me");
        
        if (response.status === 200 && response.data.user) {
          actions.setAuth(response.data.user);
          return true;
        }
        
        actions.logout();
        return false;
      } catch (error) {
        console.error("Auth check failed:", error);
        actions.logout();
        return false;
      } finally {
        actions.setLoading(false);
      }
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check authentication on app load
    actions.checkAuth();
  }, []);

  return (
    <GlobalContext.Provider value={{ state, actions }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalProvider");
  }
  return context;
}