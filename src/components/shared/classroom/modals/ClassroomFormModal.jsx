import { Button } from '@mui/material'
import ModalStandard from '../../ModalStandard'
import FormInput from '../../FormInput'
import FormSelect from '../../FormSelect'
import FormClassroom from '../FormClassroom'

export default function ClassroomFormModal({
  isOpen,
  isEditing,
  formData,
  onClose,
  onChange,
  onSubmit,
  errors,
  serverError,
  saving,
  typeOptions,
}) {
  return (
    <ModalStandard
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar aula' : 'Nueva aula'}
      actions={
        <>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={saving}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500,
              px: 2.5,
            }}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            disabled={saving}
            onClick={(e) => {
              const form = e.currentTarget
                .closest('.MuiDialog-root')
                ?.querySelector('form')

              if (form) form.requestSubmit()
            }}
            variant="contained"
            sx={{
              bgcolor: 'grey.900',
              '&:hover': { bgcolor: 'grey.800' },
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500,
              px: 2.5,
            }}
          >
            {saving
              ? 'Guardando...'
              : isEditing
                ? 'Guardar Cambios'
                : 'Guardar'}
          </Button>
        </>
      }
      >
      <FormClassroom
        onSubmit={onSubmit}
        error={serverError}
        loading={saving}
      >
        <FormInput
          required
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={onChange}
          error={errors?.name}
          disabled={saving}
        />

        <FormInput
          required
          label="Capacidad"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={onChange}
          error={errors?.capacity}
          inputProps={{ min: 1 }}
          disabled={saving}
        />

        <FormSelect
          required
          label="Tipo"
          name="type"
          value={formData.type}
          onChange={onChange}
          options={typeOptions}
          error={errors?.type}
          disabled={saving}
        />
      </FormClassroom>
    </ModalStandard>
  )
}
