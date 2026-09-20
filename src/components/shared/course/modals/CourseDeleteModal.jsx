import { Alert, Button } from '@mui/material'
import ModalStandard from '../../ModalStandard'

export default function CourseDeleteModal({ isOpen, course, onClose, onConfirm, error, loading }) {
    return (
        <ModalStandard
        isOpen={isOpen}
        onClose={onClose}
        title="Eliminar"
        actions={
            <>
            <Button
                variant="outlined"
                color="inherit"
                onClick={onClose}
                disabled={loading}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 500, px: 2.5 }}
            >
                Cancelar
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={onConfirm}
                disabled={loading}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 500, px: 2.5 }}
            >
                {loading ? 'Eliminando...' : 'Eliminar'}
            </Button>
            </>
        }
        >
        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        )}
        {course && (
            <p className="text-slate-700 text-base">
                ¿Seguro que quieres eliminar el curso{' '}
                <strong className="font-bold text-slate-900">{course.name}</strong>?
            </p>
        )}
        </ModalStandard>
    )
}