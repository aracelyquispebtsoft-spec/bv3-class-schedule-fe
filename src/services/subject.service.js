import {
  HEADERS,
  URL_SUBJECTS,
  getPage as fetchPage,
  handleResponse,
} from "./service";

export const getAll = async () => {
  const response = await fetch(URL_SUBJECTS, {
    headers: HEADERS,
  });

  return handleResponse(response);
};

export const getOne = async (id) => {
  const response = await fetch(`${URL_SUBJECTS}/${id}`, {
    headers: HEADERS,
  });

  return handleResponse(response);
};

export const create = async (subject) => {
  const response = await fetch(URL_SUBJECTS, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(subject),
  });

  return handleResponse(response);
};

export const update = async (id, subject) => {
  const response = await fetch(`${URL_SUBJECTS}/${id}`, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify(subject),
  });

  return handleResponse(response);
};

export const remove = async (id) => {
  const response = await fetch(`${URL_SUBJECTS}/${id}`, {
    method: "DELETE",
    headers: HEADERS,
  });

  return handleResponse(response);
};

export const getPage = (page, limit) => {
  return fetchPage(URL_SUBJECTS, page, limit)
}