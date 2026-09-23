import { HEADERS, URL_CLASSROOMS, getPage as fetchPage, handleResponse,} from './service'

export const getAll = async () => {
  const response = await fetch(URL_CLASSROOMS, {
    headers: HEADERS,
  })

  return handleResponse(response)
}

export const getOne = async (id) => {
  const response = await fetch(`${URL_CLASSROOMS}/${id}`, {
    headers: HEADERS,
  })

  return handleResponse(response)
}

export const create = async (classroom) => {
  const response = await fetch(URL_CLASSROOMS, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(classroom),
  })

  return handleResponse(response)
}

export const update = async (id, classroom) => {
  const response = await fetch(`${URL_CLASSROOMS}/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(classroom),
  })

  return handleResponse(response)
}

export const remove = async (id) => {
  const response = await fetch(`${URL_CLASSROOMS}/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  })

  return handleResponse(response)
}

export const getPage = (page, limit) => {
  return fetchPage(URL_CLASSROOMS, page, limit)
}