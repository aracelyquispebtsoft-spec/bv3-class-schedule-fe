const TOKEN_KEY = 'token'

/** Session token helpers (localStorage). The only place that touches the stored token. */
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const removeToken = () => localStorage.removeItem(TOKEN_KEY)
