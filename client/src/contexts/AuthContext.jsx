import { createContext, useReducer, useContext } from "react";

export const AuthContext = createContext(null);
export const AuthDispatchContext = createContext(null);

export function AuthProvider({ children }) {
  const [authData, dispatch] = useReducer(authReducer, initialAuthData);

  return (
    <AuthContext value={authData}>
      <AuthDispatchContext value={dispatch}>{children}</AuthDispatchContext>
    </AuthContext>
  );
}

function authReducer(authData, action) {
  switch (action.type) {
    case "verifyEmail":
      return {
        ...authData,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
      };
  }
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export function useAuthDispatchContext() {
  return useContext(AuthDispatchContext);
}

const initialAuthData = {
  accessToken: null,
  refreshToken: null,
};
