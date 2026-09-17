const FAKE_TOKEN = 'fake-jwt-token-12345'

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