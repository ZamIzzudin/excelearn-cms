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
} from "src/interface/type";
import { LocalToken, LocalRefreshToken } from "./var";
import { cookies } from "@/lib/utils";

const initialState = {
  hasLogin: false,
  user: {},
};

const GlobalContext = createContext<GlobalProviderProps | undefined>(undefined);

function globalReducer(state: GlobalState, action: Actions): GlobalState {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        hasLogin: true,
        user: action.payload,
      };
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload || "",
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
}

export async function Middleware({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(globalReducer, initialState);

  const actions: GlobalActions = {
    setAuth: (user: any | null) => {
      dispatch({ type: "SET_AUTH", payload: user });
    },

    setToken: (token: string) => {
      dispatch({ type: "SET_TOKEN", payload: token });
    },

    logout: () => {
      dispatch({ type: "LOGOUT" });
      if (typeof window !== "undefined") {
        localStorage.removeItem(LocalToken);
        cookies.remove(LocalToken);
        cookies.remove(LocalRefreshToken);
        router.push("/login");
      }
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
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
