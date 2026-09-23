import { handleResponse, HEADERS, URL_SCHOOL } from './service'

export const create = async (schoolData) => {
  const response = await fetch(URL_SCHOOL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(schoolData),
  })

  return handleResponse(response)
}

export const update = async (id, schoolData) => {
  const response = await fetch(`${URL_SCHOOL}/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(schoolData),
  })

  return handleResponse(response)
}