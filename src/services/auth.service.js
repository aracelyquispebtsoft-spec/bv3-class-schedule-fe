import { HEADERS, URL_AUTH_LOGIN, handleResponse } from './service'

const FAKE_TOKEN = 'fake-jwt-token-12345'

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
export const register = async (userData) => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = { ...userData }
  delete user.password

  return {
    token: FAKE_TOKEN,
    user: {
      ...user,
      id: 'fake-user-id',
      school: null,
    },
  }
}
