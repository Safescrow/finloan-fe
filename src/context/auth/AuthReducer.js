import { toast } from "react-toastify";
import { LOGIN_SUCCESS, LOGIN_FAIL, LOADING, CONFIRM_EMAIL } from "../types";

export default function authReducer(state, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.data.token);
      localStorage.setItem("user", JSON.stringify(action.payload.data));
      toast.success(action.payload.message, { position: "top-right" });
      window.location.href = `/dashboard`;
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        user: action.payload.data,
        loading: false,
      };
    case LOADING:
      toast.info("Loading", { position: "top-right" });
      return {
        ...state,
        loading: true,
      };
    case LOGIN_FAIL:
      localStorage.removeItem("token");
      toast.error(action.payload.message, { position: "top-right" });
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
      };
    case CONFIRM_EMAIL:
      localStorage.removeItem("token");
      toast.error(
        `${action.payload.message}. Check your email for activation link or contact your admin to resend email`,
        {
          position: "top-right",
          autoClose: 10000,
        }
      );
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
