import { Button } from '@mui/material'
import FormStandard from './shared/FormStandard'
import FormSelect from './shared/FormSelect'
import { DAY_OPTIONS } from '../utils/constants'

function ClassSessionForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  onDelete,
  isEditing,
  subjectOptions,
  teacherOptions,
  classroomOptions,
  courseOptions,
  timeSlotOptions,
  error,
  saving,
}) {
  return (
    <FormStandard
      onSubmit={onSubmit}
      onCancel={onCancel}
      error={error}
      loading={saving}
      submitText={isEditing ? 'Guardar Cambios' : 'Guardar'}
    >
      <FormSelect
        required
        label="Materia"
        name="subject_id"
        value={formData.subject_id}
        onChange={onChange}
        options={subjectOptions}
        disabled={saving}
      />

      <FormSelect
        required
        label="Docente"
        name="teacher_id"
        value={formData.teacher_id}
        onChange={onChange}
        options={teacherOptions}
        disabled={saving}
      />

      <FormSelect
        required
        label="Aula"
        name="classroom_id"
        value={formData.classroom_id}
        onChange={onChange}
        options={classroomOptions}
        disabled={saving}
      />

      <FormSelect
        required
        label="Curso"
        name="course_id"
        value={formData.course_id}
        onChange={onChange}
        options={courseOptions}
        disabled={saving}
      />

      <FormSelect
        required
        label="Día"
        name="day"
        value={formData.day}
        onChange={onChange}
        options={DAY_OPTIONS}
        disabled={saving}
      />

      <FormSelect
        required
        label="Franja"
        name="time_slot_id"
        value={formData.time_slot_id}
        onChange={onChange}
        options={timeSlotOptions}
        disabled={saving}
      />

      {isEditing && (
        <Button
          type="button"
          color="error"
          variant="outlined"
          onClick={onDelete}
          disabled={saving}
          sx={{ justifySelf: 'start', textTransform: 'none', fontWeight: 500 }}
        >
          Eliminar
        </Button>
      )}
    </FormStandard>
  )
}

export default ClassSessionForm