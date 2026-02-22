import { useAuthContext } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function PrivateComponent({ children }) {
  const { state } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.accessToken || !state?.refreshToken) {
      return navigate("/auth");
    }
  }, [state?.accessToken, state?.refreshToken, navigate]);

  return children;
}
