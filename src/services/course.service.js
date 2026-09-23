import {
  HEADERS,
  URL_COURSES,
  getPage as fetchPage,
  handleResponse,
} from "./service";

export const courseService = {
  getAll: async () => {
    const response = await fetch(URL_COURSES, {
      method: "GET",
      headers: HEADERS,
    });
    return handleResponse(response);
  },

  getPage: (page, limit) => {
    return fetchPage(URL_COURSES, page, limit)
  },

  getOne: async (id) => {
    const response = await fetch(`${URL_COURSES}/${id}`, {
      method: "GET",
      headers: HEADERS,
    });
    return handleResponse(response);
  },

  create: async (dataCourse) => {
    const response = await fetch(URL_COURSES, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(dataCourse),
    });
    return handleResponse(response);
  },

  update: async (id, dataCourse) => {
    const response = await fetch(`${URL_COURSES}/${id}`, {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify(dataCourse),
    });
    return handleResponse(response);
  },

  destroy: async (id) => {
    const response = await fetch(`${URL_COURSES}/${id}`, {
      method: "DELETE",
      headers: HEADERS,
    });
    return handleResponse(response);
  },
};
