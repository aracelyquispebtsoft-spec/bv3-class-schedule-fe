import config from '../config/config'

export const getMe = async () => {
  const response = await fetch(`${config.API_URL}/api/user/me`)
  const body = await response.json()

  if (!response.ok) {
    throw new Error(body.message || body.error)
  }

  return body.data
}
