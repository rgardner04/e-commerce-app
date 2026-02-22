import { createContext, useReducer, useContext } from "react";
import { reducer, initialState } from "../auth/state/reducer";

export const AuthContext = createContext(null);

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AuthContext value={{ state, dispatch }}>{children}</AuthContext>;
}
