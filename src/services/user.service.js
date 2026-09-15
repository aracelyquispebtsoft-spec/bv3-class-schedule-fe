import { HEADERS, URL_USER, handleResponse } from './service'

export const getMe = async () => {
  const response = await fetch(`${URL_USER}/me`, { headers: HEADERS })
  return handleResponse(response)
}
