import {
  GET_AUTH_DATA_STARTED,
  GET_AUTH_DATA_SUCCESS,
  GET_AUTH_DATA_FAILED,
  REGISTER_STARTED,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  VERIFICATION_STARTED,
  VERIFICATION_SUCCESS,
  VERIFICATION_FAILED,
  LOGIN_STARTED,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  RESEND_STARTED,
  RESEND_SUCCESS,
  RESEND_FAILED,
  CLEAR_AUTH_ERROR,
} from "./types";

export const initialState = {
  loading: false,
  authPageDataError: null,
  authError: null,
  verificationError: null,
  email: null,
  authPageData: null,
  verificationData: null,
  resendSuccessMessage: null,
  accessToken: null,
  refreshToken: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case GET_AUTH_DATA_STARTED:
      return {
        ...state,
        loading: true,
        authPageDataError: null,
      };
    case GET_AUTH_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        authPageData: action.payload,
        authPageDataError: null,
      };
    case GET_AUTH_DATA_FAILED:
      return {
        ...state,
        loading: false,
        authPageDataError: action.payload,
        authPageData: null,
      };
    case REGISTER_STARTED:
      return {
        ...state,
        loading: true,
        authError: null,
        email: action.payload,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        authError: null,
        verificationData: action.payload,
      };
    case REGISTER_FAILED:
      return {
        ...state,
        loading: false,
        authError: action.payload,
        verificationData: null,
      };
    case VERIFICATION_STARTED:
      return {
        ...state,
        loading: true,
        verificationError: null,
      };
    case VERIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        verificationError: null,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case VERIFICATION_FAILED:
      return {
        ...state,
        loading: false,
        verificationError: action.payload,
        accessToken: null,
        refreshToken: null,
      };
    case LOGIN_STARTED:
      return {
        ...state,
        loading: true,
        authError: null,
        email: action.payload,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        authError: null,
        verificationData: action.payload,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        loading: false,
        authError: action.payload,
        verificationData: null,
      };
    case RESEND_STARTED:
      return {
        ...state,
        loading: true,
        verificationError: null,
        resendSuccessMessage: null,
      };
    case RESEND_SUCCESS:
      return {
        ...state,
        loading: false,
        verificationError: null,
        resendSuccessMessage: action.payload.resendSuccessMessage,
      };
    case RESEND_FAILED:
      return {
        ...state,
        loading: false,
        verificationError: action.payload,
        resendSuccessMessage: null,
      };
    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        authError: null,
      };
    default:
      return state;
  }
}
