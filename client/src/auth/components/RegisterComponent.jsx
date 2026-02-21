import { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import "../styles/auth.css";

export default function RegisterComponent() {
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

  function handleRegisterSubmit(e) {
    e.preventDefault();
    console.log("handleRegisterSubmit called with formState:", formState);
  }

  function handleLoginRedirect() {
    return navigate("/auth/login");
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1 className="auth-heading">Create an account</h1>
        <div className="auth-redirect-container">
          <span className="auth-redirect-span">Already have an account?</span>
          <button className="auth-redirect-btn" onClick={handleLoginRedirect}>
            Log in
          </button>
        </div>
        <form className="auth-form" onSubmit={(e) => handleRegisterSubmit(e)}>
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
          <fieldset className="first-name-fieldset">
            <label className="first-name-label" htmlFor="first-name-input">
              First Name
            </label>
            <input
              type="text"
              className="first-name-input"
              id="first-name-input"
              required={true}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  firstName: e.target.value,
                });
              }}
            />
          </fieldset>
          <fieldset className="last-name-fieldset">
            <label className="last-name-label" htmlFor="last-name-input">
              Last Name
            </label>
            <input
              type="text"
              className="last-name-input"
              id="last-name-input"
              required={true}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  lastName: e.target.value,
                });
              }}
            />
          </fieldset>
          <fieldset className="age-fieldset">
            <label className="age-label" htmlFor="age-input">
              Age
            </label>
            <input
              type="number"
              className="age-input"
              id="age-input"
              required={true}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  age: parseInt(e.target.value),
                });
              }}
            />
          </fieldset>
          <fieldset className="street-fieldset">
            <label className="street-label" htmlFor="street-input">
              Street
            </label>
            <input
              type="text"
              className="street-input"
              id="street-input"
              required={true}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  street: e.target.value,
                });
              }}
            />
          </fieldset>
          <fieldset className="city-fieldset">
            <label className="city-label" htmlFor="city-input">
              City
            </label>
            <input
              type="text"
              className="city-input"
              id="city-input"
              required={true}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  city: e.target.value,
                });
              }}
            />
          </fieldset>
          <fieldset className="state-fieldset">
            <label className="state-label" htmlFor="state-input">
              State
            </label>
            <input
              type="text"
              className="state-input"
              id="state-input"
              required={true}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  state: e.target.value,
                });
              }}
            />
          </fieldset>
          <fieldset className="zip-code-fieldset">
            <label className="zi-code-label" htmlFor="zip-code-input">
              Zip Code
            </label>
            <input
              type="number"
              className="zip-code-input"
              id="zip-code-input"
              required={true}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  zipCode: parseInt(e.target.value),
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
