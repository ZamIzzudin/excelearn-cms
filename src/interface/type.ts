/** @format */

export interface GlobalState {
  hasLogin: boolean;
  user: any;
  token?: string;
}

export interface GlobalActions {
  setAuth: (user: any | null) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export interface GlobalProviderProps {
  state: GlobalState;
  actions: GlobalActions;
}

export type Actions =
  | { type: "SET_AUTH"; payload: any | null }
  | { type: "SET_TOKEN"; payload: string }
  | { type: "LOGOUT" };
