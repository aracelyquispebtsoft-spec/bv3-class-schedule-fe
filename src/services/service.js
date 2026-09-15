import config from '../config/config'

export const API_URL = `${config.API_URL}/api`

/** One URL per resource. Must match the routes in the backend's index.routes.js. */
export const URL_USER = `${API_URL}/user`

export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

/** Returns body.data, or throws the backend error message. */
export const handleResponse = async (response) => {
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(body?.message || body?.error || `Error ${response.status}`)
  }

  return body?.data
}
