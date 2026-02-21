import { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import "../styles/auth.css";

export default function LoginComponent() {
  const authData = useAuthContext();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({});

  useEffect(() => {
    if (authData && authData.accessToken && authData.refreshToken) {
      return navigate("/");
    }
  }, [authData, navigate]);

  useEffect(() => {
    console.log("formState", formState);
  }, [formState]);

  function handleLoginSubmit(e) {
    e.preventDefault();
    console.log("handleLoginSubmit called with formState:", formState);
  }

  function handleRegisterRedirect() {
    return navigate("/auth/register");
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1 className="auth-heading">Log in to your account</h1>
        <div className="auth-redirect-container">
          <span className="auth-redirect-span">New to E-commerce?</span>
          <button
            className="auth-redirect-btn"
            onClick={handleRegisterRedirect}
          >
            Create account
          </button>
        </div>
        <form className="auth-form" onSubmit={(e) => handleLoginSubmit(e)}>
          <fieldset className="email-fieldset">
            <label className="email-label" htmlFor="email-input">
              Email
            </label>
            <input
              type="email"
              className="email-input"
              id="email-input"
              required={true}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  email: e.target.value,
                })
              }
            />
          </fieldset>
          <fieldset className="password-fieldset">
            <label className="password-label" htmlFor="password-input">
              Password
            </label>
            <input
              type="password"
              className="password-input"
              id="password-input"
              required={true}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  password: e.target.value,
                });
              }}
            />
          </fieldset>
          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
