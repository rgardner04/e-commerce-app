import { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { verifyEmail, resendVerification } from "../state/actions";
import { useNavigate } from "react-router";
import { ShoppingBag } from "lucide-react";
import "../styles/VerificationComponent.css";

export default function VerificationComponent() {
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState([]);
  const [secondsBeforeResend, setSecondsBeforeResend] = useState(0);
  const [resendTimerRunning, setResendTimerRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleVerificationCodeChange(e, index) {
    const value = parseInt(e.target.value);
    const verificationCodeToUpdate = verificationCode;
    verificationCodeToUpdate[index] = value;
    setVerificationCode([...verificationCodeToUpdate]);
  }

  function renderVerificationCodeInputs() {
    const verificationCodeLength =
      state?.verificationData?.verificationCodeLength;
    if (!verificationCodeLength) {
      return;
    }

    let verificationCodeInputs = [];
    for (let i = 0; i < verificationCodeLength; i++) {
      verificationCodeInputs.push(
        <input
          key={i}
          id={`code-${i}`}
          type="number"
          min="0"
          max="9"
          required={true}
          onChange={(e) => handleVerificationCodeChange(e, i)}
        />,
      );
    }

    return verificationCodeInputs;
  }

  async function handleSubmit(e) {
    try {
      setLoading(true);
      e.preventDefault();
      const combinedCode = parseInt(verificationCode.join(""));
      await verifyEmail(dispatch, combinedCode);
      return navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      if (loading || secondsBeforeResend > 0) {
        return;
      }
      setLoading(true);
      await resendVerification(dispatch, state?.email);
      setSecondsBeforeResend(state?.verificationData?.secondsBeforeResend);
      setResendTimerRunning(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!resendTimerRunning) {
      return;
    }

    const id = setInterval(() => {
      setSecondsBeforeResend((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [resendTimerRunning]);

  useEffect(() => {
    if (secondsBeforeResend <= 0) {
      setResendTimerRunning(false);
    }
  }, [secondsBeforeResend]);

  if (state?.verificationData) {
    return (
      <div className="verification-container">
        <div className="verification-brand-container">
          <ShoppingBag className="verification-brand-icon" />
          <h1>ShopFlow</h1>
        </div>
        <div className="verification-form-container">
          <form id="verification-form" onSubmit={(e) => handleSubmit(e)}>
            <div className="form-text">
              <h2>{state?.verificationData?.verificationPrimaryMessage}</h2>
              <p>{state?.verificationData?.verificationSecondaryMessage}</p>
            </div>
            <fieldset>{renderVerificationCodeInputs()}</fieldset>
            {state?.verificationError && (
              <p className="error-text">{state?.verificationError}</p>
            )}
            <button
              className={`submit-${loading ? "inactive" : "active"}`}
              disabled={loading}
            >
              {state?.verificationData?.verificationActionMessage}
            </button>
            <div className="resend-container">
              <span>{state?.verificationData?.resendMessage}</span>
              <span className="resend-span" onClick={handleResend}>
                {secondsBeforeResend > 0
                  ? `${state?.verificationData?.resendActionMessage} in ${secondsBeforeResend}s`
                  : state?.verificationData?.resendActionMessage}
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
