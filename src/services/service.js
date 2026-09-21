import config from '../config/config'
import { getToken, removeToken } from '../utils/token'

export const API_URL = `${config.API_URL}/api`
export const URL_CLASSROOMS = `${API_URL}/classrooms`

/** One URL per resource. Must match the routes in the backend's index.routes.js. */
export const URL_USER = `${API_URL}/user`
export const URL_TEACHERS = `${API_URL}/teachers`
export const URL_AUTH_LOGIN = `${API_URL}/auth/login`
export const URL_SCHOOL = `${API_URL}/school`
export const URL_SUBJECTS = `${API_URL}/subjects`

/** Authorization is read on every request, so it always carries the current token. */
export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  get Authorization() {
    const token = getToken()
    return token ? `Bearer ${token}` : ''
  },
}

/** Returns body.data, or throws the backend error message. */
export const handleResponse = async (response) => {
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && getToken()) {
      removeToken()
      window.location.replace('/login')
    }

    throw new Error(body?.message || body?.error || `Error ${response.status}`)
  }

  return body?.data
}