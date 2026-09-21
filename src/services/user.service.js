import { HEADERS, URL_USER, handleResponse } from './service'

export const getMe = async () => {
  const response = await fetch(`${URL_USER}/me`, {
    headers: HEADERS,
  })

  return handleResponse(response)
}

export const updateMe = async (userData) => {
  const response = await fetch(`${URL_USER}/me`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(userData),
  })

  return handleResponse(response)
}
