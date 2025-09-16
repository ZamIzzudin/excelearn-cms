/** @format */

export interface GlobalState {
  hasLogin: boolean;
  user: User | null;
  token?: string;
  refreshToken?: string;
  isLoading: boolean;
}

export interface GlobalActions {
  setAuth: (user: User | null, tokens?: AuthTokens) => void;
  setTokens: (tokens: AuthTokens) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export interface GlobalProviderProps {
  state: GlobalState;
  actions: GlobalActions;
}

export interface User {
  _id: string;
  username: string;
  display_name: string;
  role: string;
  created_at: string;
  updated_at?: string;
}
export type Actions =
  | { type: "SET_AUTH"; payload: { user: User | null; tokens?: AuthTokens } }
  | { type: "SET_TOKENS"; payload: AuthTokens }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOGOUT" };
  refresh_token?: string;
}