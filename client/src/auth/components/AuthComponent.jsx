import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import {
  getAuthPageData,
  register,
  login,
  clearAuthError,
} from "../state/actions";
import { useNavigate } from "react-router";
import { ShoppingBag } from "lucide-react";
import "../styles/AuthComponent.css";

export default function AuthComponent() {
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [formState, setFormState] = useState({});
  const [loading, setLoading] = useState(false);

  function handleLogRegChange() {
    clearAuthError(dispatch);
    setFormState({});
    document.getElementById("auth-form").reset();
    setShowLoginForm(!showLoginForm);
  }

  async function handleSubmit(e) {
    try {
      setLoading(true);
      e.preventDefault();
      showLoginForm
        ? await login(dispatch, formState)
        : await register(dispatch, formState);
      return navigate("/auth/verification");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function createFormStructure() {
    const fields = state?.authPageData?.fields;

    if (!fields) {
      return null;
    }

    const fieldsToMapOver = showLoginForm
      ? fields?.filter(
          (field) => field.name === "email" || field.name === "password",
        )
      : fields;

    const createdElements = fieldsToMapOver?.map((field) => {
      switch (field.name) {
        case "email":
          return (
            <React.Fragment key={field.name}>
              <label htmlFor="email">{field.label}</label>
              <input
                type="email"
                id="email"
                required={true}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
              />
            </React.Fragment>
          );
        case "password":
          return (
            <React.Fragment key={field.name}>
              <label htmlFor="password">{field.label}</label>
              <input
                type="password"
                id="password"
                required={true}
                onChange={(e) =>
                  setFormState({ ...formState, password: e.target.value })
                }
              />
            </React.Fragment>
          );
        case "firstName":
          return (
            <React.Fragment key={field.name}>
              <label htmlFor={field?.name}>{field?.label}</label>
              <input
                type="text"
                id={field.name}
                required={true}
                onChange={(e) =>
                  setFormState({ ...formState, firstName: e.target.value })
                }
              />
            </React.Fragment>
          );
        case "lastName":
          return (
            <React.Fragment key={field.name}>
              <label htmlFor={field?.name}>{field?.label}</label>
              <input
                type="text"
                id={field.name}
                required={true}
                onChange={(e) =>
                  setFormState({ ...formState, lastName: e.target.value })
                }
              />
            </React.Fragment>
          );
      }
    });

    return <fieldset>{createdElements}</fieldset>;
  }

  useEffect(() => {
    getAuthPageData(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (state?.accessToken && state?.refreshToken) {
      return navigate("/");
    }
  }, [state?.accessToken, state?.refreshToken, navigate]);

  if (state?.authPageData) {
    return (
      <div className="auth-container">
        <div className="auth-brand-container">
          <ShoppingBag className="auth-brand-icon" size={25} />
          <h1>ShopFlow</h1>
        </div>
        <div className="auth-form-container">
          <form id="auth-form" onSubmit={(e) => handleSubmit(e)}>
            <div className="form-text">
              <h2>
                {showLoginForm
                  ? state?.authPageData?.loginPrimaryMessage
                  : state?.authPageData?.registerPrimaryMessage}
              </h2>
              <p>
                {showLoginForm
                  ? state?.authPageData?.loginSecondaryMessage
                  : state?.authPageData?.registerSecondaryMessage}
              </p>
            </div>
            {createFormStructure()}
            {state?.authError && (
              <p className="error-text">{state?.authError}</p>
            )}
            <button
              className={`submit-${loading ? "inactive" : "active"}`}
              type="submit"
              disabled={loading}
            >
              {showLoginForm
                ? state?.authPageData?.loginActionMessage
                : state?.authPageData?.registerActionMessage}
            </button>
            <div className="redirect-container">
              <span>
                {showLoginForm
                  ? state?.authPageData?.registerRedirectMessage
                  : state?.authPageData?.loginRedirectMessage}
              </span>
              <span className="redirect-span" onClick={handleLogRegChange}>
                {showLoginForm
                  ? state?.authPageData?.registerActionMessage
                  : state?.authPageData?.loginActionMessage}
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
