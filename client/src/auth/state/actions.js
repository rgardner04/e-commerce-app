import {
  GET_AUTH_DATA_STARTED,
  GET_AUTH_DATA_SUCCESS,
  GET_AUTH_DATA_FAILED,
  REGISTER_STARTED,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  LOGIN_STARTED,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  VERIFICATION_STARTED,
  VERIFICATION_SUCCESS,
  VERIFICATION_FAILED,
  RESEND_STARTED,
  RESEND_SUCCESS,
  RESEND_FAILED,
  CLEAR_AUTH_ERROR,
} from "./types";
import sendRequest from "../../utils/axiosUtil";

export async function getAuthPageData(dispatch) {
  try {
    dispatch({ type: GET_AUTH_DATA_STARTED, payload: {} });
    const responseData = await sendRequest("/auth/page-data", "GET");
    dispatch({
      type: GET_AUTH_DATA_SUCCESS,
      payload: responseData?.data,
    });
  } catch (error) {
    dispatch({
      type: GET_AUTH_DATA_FAILED,
      payload: error?.response?.data?.message,
    });
    throw error;
  }
}

export async function register(dispatch, formData) {
  try {
    dispatch({ type: REGISTER_STARTED, payload: formData?.email });
    const responseData = await sendRequest("/auth/register", "POST", formData);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: responseData?.data,
    });
  } catch (error) {
    dispatch({
      type: REGISTER_FAILED,
      payload: error?.response?.data?.message,
    });
    throw error;
  }
}

export async function login(dispatch, formData) {
  try {
    dispatch({ type: LOGIN_STARTED, payload: formData?.email });
    const responseData = await sendRequest("/auth/login", "POST", formData);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: responseData?.data,
    });
  } catch (error) {
    dispatch({ type: LOGIN_FAILED, payload: error?.response?.data?.message });
    throw error;
  }
}

export async function verifyEmail(dispatch, verificationCode) {
  try {
    dispatch({ type: VERIFICATION_STARTED, payload: {} });
    const responseData = await sendRequest("/auth/verify-email", "POST", {
      verificationCode,
    });
    dispatch({ type: VERIFICATION_SUCCESS, payload: responseData?.data });
  } catch (error) {
    dispatch({
      type: VERIFICATION_FAILED,
      payload: error?.response?.data?.message,
    });
    throw error;
  }
}

export async function resendVerification(dispatch, email) {
  try {
    dispatch({ type: RESEND_STARTED, payload: {} });
    const responseData = await sendRequest(
      "/auth/resend-verification",
      "POST",
      {
        email,
      },
    );
    dispatch({
      type: RESEND_SUCCESS,
      payload: responseData?.data,
    });
  } catch (error) {
    dispatch({ type: RESEND_FAILED, payload: error?.response?.data?.message });
    throw error;
  }
}

export function clearAuthError(dispatch) {
  dispatch({ type: CLEAR_AUTH_ERROR, payload: {} });
}
