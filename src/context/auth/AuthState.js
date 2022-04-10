import React, { useReducer } from "react";
import PropTypes from "prop-types";
import AuthContext from "./AuthContext";
import { apiPost } from "../../utils/apiHelper";
import AuthReducer from "./AuthReducer";
import { LOGIN_SUCCESS, LOGIN_FAIL, LOADING, CONFIRM_EMAIL, LOGOUT } from "../types";

// AuthState Provider Component

const AuthState = ({ children }) => {
  const initialState = {
    token: localStorage?.getItem("token"),
    isAuthenticated: null,
    user: JSON.parse(localStorage?.getItem("user")),
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  // Action creators
  // NOTE: These could be moved to a separate file like in redux
  // but they remain here for ease of students transitioning

  // Login User
  const login = async (formData) => {
    dispatch({
      type: LOADING,
      payload: true,
    });
    try {
      await apiPost("/account/login", formData, config, false).then(
        (res) => {
          dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
          });
        },
        (err) => {
          if (err.response.data.message === "Account not Activated") {
            dispatch({
              type: CONFIRM_EMAIL,
              payload: err.response.data,
            });
          } else {
            dispatch({
              type: LOGIN_FAIL,
              payload: err.response.data,
            });
          }
        }
      );
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response,
      });
    }
  };

  const logout = () => {
    dispatch({
      type: LOGOUT,
      payload: true,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        logout,
        error: state.error,
        state,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export default AuthState;

AuthState.propTypes = {
  children: PropTypes.node.isRequired,
};
