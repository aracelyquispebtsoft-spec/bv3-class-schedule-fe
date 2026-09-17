import { HEADERS, URL_AUTH_LOGIN, handleResponse } from './service'

export const login = async (email, password) => {
  const response = await fetch(URL_AUTH_LOGIN, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      email,
      password,
    }),
  })

  return handleResponse(response)
}