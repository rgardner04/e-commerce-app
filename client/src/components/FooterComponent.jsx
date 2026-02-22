import { useAuthContext } from "../contexts/AuthContext";

export default function FooterComponent() {
  const { state } = useAuthContext();

  {
    state?.accessToken && state?.refreshToken ? (
      <footer>Will come back to this footer!</footer>
    ) : null;
  }
}
