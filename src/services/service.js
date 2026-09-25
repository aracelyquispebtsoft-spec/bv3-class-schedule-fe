import config from "../config/config";
import { getToken, removeToken } from "../utils/token";

export const API_URL = `${config.API_URL}/api`;

/** One URL per resource. Must match the routes in the backend's index.routes.js. */
export const URL_USER = `${API_URL}/user`
export const URL_TEACHERS = `${API_URL}/teachers`
export const URL_AUTH_LOGIN = `${API_URL}/auth/login`
export const URL_SCHOOL = `${API_URL}/school`
export const URL_SUBJECTS = `${API_URL}/subjects`
export const URL_PROGRESS = `${API_URL}/progress`
export const URL_CLASSROOMS = `${API_URL}/classrooms`
export const URL_TIME_SLOTS = `${API_URL}/time-slots`
export const URL_CLASS_SESSION = `${API_URL}/class-sessions`

/** Authorization is read on every request, so it always carries the current token. */
export const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  get Authorization() {
    const token = getToken();
    return token ? `Bearer ${token}` : "";
  },
};

const getErrorMessage = (body, status) =>
  body?.message ||
  body?.error ||
  (Array.isArray(body?.errors) ? body.errors.join(", ") : null) ||
  `Error ${status}`;

const parseResponse = async (response) => {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && getToken()) {
      removeToken();
      window.location.replace("/login");
    }

    throw new Error(getErrorMessage(body, response.status));
  }

  return body;
};

export const handleResponse = async (response) => {
  const body = await parseResponse(response);
  return body?.data;
};

export const handlePageResponse = async (response) => {
  const body = await parseResponse(response);
  return {
    data: body?.data || [],
    meta: body?.meta || { page: 1, limit: 10, total: 0, total_pages: 0 },
  };
};

export const getPage = async (url, page, limit) => {
  const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
    headers: HEADERS,
  });
  return handlePageResponse(response);
};
