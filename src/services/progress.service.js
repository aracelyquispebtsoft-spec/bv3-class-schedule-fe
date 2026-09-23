import {
  URL_PROGRESS,
  HEADERS,
  handleResponse,
} from './service'


export const getAll = async () => {
  const response = await fetch(
    URL_PROGRESS,
    {
      method: 'GET',
      headers: HEADERS,
    }
  )

  return handleResponse(response)
}