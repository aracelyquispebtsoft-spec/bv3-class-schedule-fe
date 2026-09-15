/**
 * Hand-written sample data to build a page before its endpoint exists.
 * Each export has the same shape the API returns (fields named like the table
 * columns, as the backend decorators send them), so switching to the service
 * later does not change the components. Values match the backend seeders
 * (Colegio San Martín, CLS-17). Ids are fake: never use them in page logic.
 */

/** GET /api/user/me */
export const userData = {
  id: '01JYQZ8K3M4N5P6Q7R8S9T0V1W',
  firstname: 'User',
  lastname: 'Admin',
  email: 'user@admin.com',
  school: { id: '01JYQZ9A4B5C6D7E8F9G0H1J2K', name: 'Colegio San Martín' },
}

/** GET /api/time-slots (times without seconds) */
export const timeSlotsData = [
  { id: 1, start_time: '08:00', end_time: '10:00' },
  { id: 2, start_time: '10:00', end_time: '12:00' },
  { id: 3, start_time: '12:00', end_time: '14:00' },
  { id: 4, start_time: '14:00', end_time: '16:00' },
  { id: 5, start_time: '16:00', end_time: '18:00' },
  { id: 6, start_time: '18:00', end_time: '20:00' },
]

/** GET /api/teachers (sorted by name) */
export const teachersData = [
  { id: '01JZ1000000000000000000001', name: 'Ana Rojas', max_weekly_hours: 12 },
  { id: '01JZ1000000000000000000003', name: 'Carlos Vega', max_weekly_hours: 8 },
  { id: '01JZ1000000000000000000006', name: 'Diego Salas', max_weekly_hours: 4 },
  { id: '01JZ1000000000000000000002', name: 'Elena Suárez', max_weekly_hours: 10 },
  { id: '01JZ1000000000000000000004', name: 'Jorge Paz', max_weekly_hours: 8 },
  { id: '01JZ1000000000000000000005', name: 'Marta Ríos', max_weekly_hours: 8 },
]

/** GET /api/classrooms (type: COMMON | LAB | COMPUTER) */
export const classroomsData = [
  { id: '01JZ2000000000000000000001', name: 'A-101', capacity: 40, type: 'COMMON' },
  { id: '01JZ2000000000000000000002', name: 'A-102', capacity: 35, type: 'COMMON' },
  { id: '01JZ2000000000000000000003', name: 'B-12', capacity: 25, type: 'COMMON' },
  { id: '01JZ2000000000000000000004', name: 'LAB-1', capacity: 40, type: 'LAB' },
  { id: '01JZ2000000000000000000005', name: 'INF-1', capacity: 35, type: 'COMPUTER' },
]

/** GET /api/courses */
export const coursesData = [
  { id: '01JZ3000000000000000000001', name: '1°A', student_count: 32 },
  { id: '01JZ3000000000000000000002', name: '1°B', student_count: 28 },
  { id: '01JZ3000000000000000000003', name: '2°A', student_count: 34 },
  { id: '01JZ3000000000000000000004', name: '2°B', student_count: 24 },
]

/** GET /api/subjects (required_room_type: COMMON | LAB | COMPUTER) */
export const subjectsData = [
  { id: '01JZ4000000000000000000001', name: 'Matemática', weekly_hours: 6, required_room_type: 'COMMON' },
  { id: '01JZ4000000000000000000002', name: 'Lengua', weekly_hours: 6, required_room_type: 'COMMON' },
  { id: '01JZ4000000000000000000003', name: 'Historia', weekly_hours: 4, required_room_type: 'COMMON' },
  { id: '01JZ4000000000000000000004', name: 'Física', weekly_hours: 4, required_room_type: 'LAB' },
  { id: '01JZ4000000000000000000005', name: 'Química', weekly_hours: 2, required_room_type: 'LAB' },
  { id: '01JZ4000000000000000000006', name: 'Informática', weekly_hours: 4, required_room_type: 'COMPUTER' },
]

/**
 * GET /api/class-sessions (day: MONDAY … FRIDAY). Related records come nested,
 * with the same ids as the lists above. They follow every schedule rule: no
 * clashes, the course fits the room, the room type matches the subject and no
 * teacher goes over their cap. 1°A has 4 of its 6 Matemática hours.
 */
export const classSessionsData = [
  {
    id: '01JZ5000000000000000000001',
    day: 'MONDAY',
    time_slot: { id: 1, start_time: '08:00', end_time: '10:00' },
    subject: { id: '01JZ4000000000000000000001', name: 'Matemática' },
    teacher: { id: '01JZ1000000000000000000001', name: 'Ana Rojas' },
    classroom: { id: '01JZ2000000000000000000001', name: 'A-101' },
    course: { id: '01JZ3000000000000000000001', name: '1°A' },
  },
  {
    id: '01JZ5000000000000000000002',
    day: 'MONDAY',
    time_slot: { id: 1, start_time: '08:00', end_time: '10:00' },
    subject: { id: '01JZ4000000000000000000002', name: 'Lengua' },
    teacher: { id: '01JZ1000000000000000000002', name: 'Elena Suárez' },
    classroom: { id: '01JZ2000000000000000000003', name: 'B-12' },
    course: { id: '01JZ3000000000000000000004', name: '2°B' },
  },
  {
    id: '01JZ5000000000000000000003',
    day: 'MONDAY',
    time_slot: { id: 2, start_time: '10:00', end_time: '12:00' },
    subject: { id: '01JZ4000000000000000000001', name: 'Matemática' },
    teacher: { id: '01JZ1000000000000000000001', name: 'Ana Rojas' },
    classroom: { id: '01JZ2000000000000000000001', name: 'A-101' },
    course: { id: '01JZ3000000000000000000002', name: '1°B' },
  },
  {
    id: '01JZ5000000000000000000004',
    day: 'TUESDAY',
    time_slot: { id: 2, start_time: '10:00', end_time: '12:00' },
    subject: { id: '01JZ4000000000000000000002', name: 'Lengua' },
    teacher: { id: '01JZ1000000000000000000002', name: 'Elena Suárez' },
    classroom: { id: '01JZ2000000000000000000002', name: 'A-102' },
    course: { id: '01JZ3000000000000000000001', name: '1°A' },
  },
  {
    id: '01JZ5000000000000000000005',
    day: 'TUESDAY',
    time_slot: { id: 4, start_time: '14:00', end_time: '16:00' },
    subject: { id: '01JZ4000000000000000000006', name: 'Informática' },
    teacher: { id: '01JZ1000000000000000000006', name: 'Diego Salas' },
    classroom: { id: '01JZ2000000000000000000005', name: 'INF-1' },
    course: { id: '01JZ3000000000000000000001', name: '1°A' },
  },
  {
    id: '01JZ5000000000000000000006',
    day: 'WEDNESDAY',
    time_slot: { id: 1, start_time: '08:00', end_time: '10:00' },
    subject: { id: '01JZ4000000000000000000001', name: 'Matemática' },
    teacher: { id: '01JZ1000000000000000000001', name: 'Ana Rojas' },
    classroom: { id: '01JZ2000000000000000000001', name: 'A-101' },
    course: { id: '01JZ3000000000000000000001', name: '1°A' },
  },
  {
    id: '01JZ5000000000000000000007',
    day: 'THURSDAY',
    time_slot: { id: 3, start_time: '12:00', end_time: '14:00' },
    subject: { id: '01JZ4000000000000000000003', name: 'Historia' },
    teacher: { id: '01JZ1000000000000000000003', name: 'Carlos Vega' },
    classroom: { id: '01JZ2000000000000000000001', name: 'A-101' },
    course: { id: '01JZ3000000000000000000001', name: '1°A' },
  },
  {
    id: '01JZ5000000000000000000008',
    day: 'FRIDAY',
    time_slot: { id: 2, start_time: '10:00', end_time: '12:00' },
    subject: { id: '01JZ4000000000000000000004', name: 'Física' },
    teacher: { id: '01JZ1000000000000000000004', name: 'Jorge Paz' },
    classroom: { id: '01JZ2000000000000000000004', name: 'LAB-1' },
    course: { id: '01JZ3000000000000000000001', name: '1°A' },
  },
]
