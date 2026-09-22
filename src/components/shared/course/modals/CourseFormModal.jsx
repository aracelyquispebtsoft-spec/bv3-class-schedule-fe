import { Button } from '@mui/material'
import ModalStandard from '../../ModalStandard'
import FormInput from '../../FormInput'
import FormCourse from '../FormCourse'

export default function CourseFormModal({ isOpen, isEditing, formData, onClose, onChange, onSubmit, errors, serverError, saving }) {
    return (
        <ModalStandard
        isOpen={isOpen}
        onClose={onClose}
        title={isEditing ? 'Editar curso' : 'Agregar curso'}
        actions={
            <>
            <Button
                variant="outlined"
                color="inherit"
                onClick={onClose}
                disabled={saving}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 500, px: 2.5 }}
            >
                Cancelar
            </Button>
            <Button
                type="button"
                disabled={saving}
                onClick={(e) => {
                    const form = e.currentTarget.closest('.MuiDialog-root')?.querySelector('form')
                    if (form) form.requestSubmit()}}
                variant="contained"
                sx={{bgcolor: 'grey.900',
                    '&:hover': { bgcolor: 'grey.800' },
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2.5,}}
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
        <FormCourse onSubmit={onSubmit} error={serverError} loading={saving} >
            <FormInput
            required
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="2°A"
            error={errors?.name}
            disabled={saving}
            />
            <FormInput
            required
            label="Cantidad de estudiantes"
            name="student_count"
            type="number"
            value={formData.student_count}
            onChange={onChange}
            error={errors?.student_count}
            helperText={errors?.student_count || "Mayor que 0"}
            placeholder="34"
            disabled={saving}
            />
        </FormCourse>
        </ModalStandard>
    )
}