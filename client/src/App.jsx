import "./App.css";
import { useEffect } from "react";
import { useAuthContext } from "./contexts/AuthContext";
import { Routes, Route, useNavigate, useLocation } from "react-router";
import HeaderComponent from "./components/HeaderComponent";
import LoginComponent from "./auth/components/LoginComponent";
import RegisterComponent from "./auth/components/RegisterComponent";
import FooterComponent from "./components/FooterComponent";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const authData = useAuthContext();

  useEffect(() => {
    console.log("authData", authData);

    if (location.pathname.includes("/auth/register")) {
      return;
    }

    if (!authData || !authData.accessToken || !authData.refreshToken) {
      return navigate("/auth/login");
    }
  }, [authData, navigate, location.pathname]);

  return (
    <>
      <HeaderComponent />
      <Routes>
        <Route path="auth">
          <Route path="login" element={<LoginComponent />} />
          <Route path="register" element={<RegisterComponent />} />
        </Route>
      </Routes>
      <FooterComponent />
    </>
  );
}

export default App;
