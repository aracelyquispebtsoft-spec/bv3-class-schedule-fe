import {
  handlePageResponse,
  handleResponse,
  API_URL,
  HEADERS,
} from "./service";

const URL_COURSE = "/courses";

export const courseService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}${URL_COURSE}`, {
      method: "GET",
      headers: HEADERS,
    });
    return handleResponse(response);
  },

  getPage: async (page, limit) => {
    const response = await fetch(
      `${API_URL}${URL_COURSE}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: HEADERS,
      },
    );
    return handlePageResponse(response);
  },

  getOne: async (id) => {
    const response = await fetch(`${API_URL}${URL_COURSE}/${id}`, {
      method: "GET",
      headers: HEADERS,
    });
    return handleResponse(response);
  },

  create: async (dataCourse) => {
    const response = await fetch(`${API_URL}${URL_COURSE}`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(dataCourse),
    });
    return handleResponse(response);
  },

  update: async (id, dataCourse) => {
    const response = await fetch(`${API_URL}${URL_COURSE}/${id}`, {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify(dataCourse),
    });
    return handleResponse(response);
  },

  destroy: async (id) => {
    const response = await fetch(`${API_URL}${URL_COURSE}/${id}`, {
      method: "DELETE",
      headers: HEADERS,
    });
    return handleResponse(response);
  },
};
