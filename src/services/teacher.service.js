import {
  HEADERS,
  URL_TEACHERS,
  getPage as fetchPage,
  handleResponse,
} from "./service";

export const getAll = async () => {
  const response = await fetch(URL_TEACHERS, { headers: HEADERS });
  return handleResponse(response);
};

export const getOne = async (id) => {
  const response = await fetch(`${URL_TEACHERS}/${id}`, { headers: HEADERS });
  return handleResponse(response);
};

export const create = async (teacher) => {
  const response = await fetch(URL_TEACHERS, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(teacher),
  });
  return handleResponse(response);
};

export const update = async (id, teacher) => {
  const response = await fetch(`${URL_TEACHERS}/${id}`, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify(teacher),
  });
  return handleResponse(response);
};

export const remove = async (id) => {
  const response = await fetch(`${URL_TEACHERS}/${id}`, {
    method: "DELETE",
    headers: HEADERS,
  });
  return handleResponse(response);
};

export const getPage = (page, limit) => {
  return fetchPage(URL_TEACHERS, page, limit);
};
