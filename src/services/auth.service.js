import { HEADERS, URL_AUTH_LOGIN, API_URL, handleResponse } from "./service";

export const login = async (email, password) => {
  const response = await fetch(URL_AUTH_LOGIN, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return handleResponse(response);
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};
