export const create = async (schoolData) => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: 'fake-school-id',
    name: schoolData.name,
  }
}