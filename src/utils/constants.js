export const CLASSROOM_TYPES = [
  'COMMON',
  'LAB',
  'COMPUTER',
]

export const DAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
]

export const DAY_LABELS = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles' ,
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
}

export const DAY_OPTIONS = DAYS.map(day => ({
  value: day,
  label: DAY_LABELS[day]
}))

export const filterTypes = [
  { value: 'course', label: 'Curso' },
  { value: 'teacher', label: 'Docente' },
  { value: 'classroom', label: 'Aula' },
]