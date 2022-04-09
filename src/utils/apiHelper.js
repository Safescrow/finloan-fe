import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = "https://localhost:44353/api";
export const apiGet = (path, { headers, ...conf }, auth = true) =>
  new Promise((resolve, reject) => {
    const Authorization = auth && `Bearer ${localStorage.getItem("token")}`;
    const config = {
      ...conf,
      headers: {
        Authorization,
        "Content-Type": "application/json",
        ...headers,
      },
    };
    axios.get(`${baseUrl}${path}`, config).then(
      (res) => resolve(res),
      (err) => {
        if (err.response.status === 401) {
          toast.error("Session Expired", { position: "top-right" });
          window.location.href = "/authentication/sign-in";
        } else {
          reject(err);
        }
      }
    );
  });

export const paystackGet = (path) =>
  new Promise((resolve, reject) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios.get(path, config).then(
      (res) => resolve(res),
      (err) => {
        if (err.response.status === 401) {
          toast.error("Session Expired", { position: "top-right" });
          window.location.href = "/authentication/sign-in";
        } else {
          reject(err);
        }
      }
    );
  });

export const apiPost = (path, data, { headers, ...conf }, auth = true) =>
  new Promise((resolve, reject) => {
    const Authorization = auth && `Bearer ${localStorage.getItem("token")}`;
    const config = {
      ...conf,
      headers: {
        Authorization,
        "Content-Type": "application/json",
        ...headers,
      },
    };

    axios.post(`${baseUrl}${path}`, data, config).then(
      (res) => resolve(res),
      (err) => {
        if (err.response.status === 401) {
          toast.error("Session Expired", { position: "top-right" });
          window.location.href = "/authentication/sign-in";
        } else {
          reject(err);
        }
      }
    );
  });

export const apiPut = (path, data, conf = {}) =>
  new Promise((resolve, reject) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      ...conf,
    };
    axios.put(`${baseUrl}${path}`, data, config).then(
      (res) => resolve(res),
      (err) => {
        if (err.response.status === 401) {
          toast.error("Session Expired", { position: "top-right" });
          window.location.href = "/authentication/sign-in";
        } else {
          reject(err);
        }
      }
    );
  });

export const apiPatch = (path, data, conf = {}) =>
  new Promise((resolve, reject) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      ...conf,
    };
    axios.patch(`${baseUrl}${path}`, data, config).then(
      (res) => resolve(res),
      (err) => {
        if (err.response.status === 401) {
          toast.error("Session Expired", { position: "top-right" });
          window.location.href = "/authentication/sign-in";
        } else {
          reject(err);
        }
      }
    );
  });

export const apiDelete = (path, conf = {}) =>
  new Promise((resolve, reject) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      ...conf,
    };
    axios.delete(`${baseUrl}${path}`, config).then(
      (res) => resolve(res),
      (err) => {
        if (err.response.status === 401) {
          toast.error("Session Expired", { position: "top-right" });
          window.location.href = "/authentication/sign-in";
        } else {
          reject(err);
        }
      }
    );
  });

// export const errorHandler = (payload) => {};
