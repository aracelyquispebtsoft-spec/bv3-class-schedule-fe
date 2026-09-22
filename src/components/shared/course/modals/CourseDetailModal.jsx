import { Button } from '@mui/material'
import ModalStandard from '../../ModalStandard'

export default function CourseDetailModal({ isOpen, course, onClose }) {
    return (
        <ModalStandard
        isOpen={isOpen}
        onClose={onClose}
        title="Detalle"
        actions={
            <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: '500', px: 2.5 }}
            >
            Cerrar
            </Button>
        }
        >
        {course && (
            <>
            <div className="grid grid-cols-2 items-center">
                <span className="text-slate-500">Nombre</span>
                <span className="text-slate-900 font-semibold">{course.name}</span>
            </div>
            <div className="grid grid-cols-2 items-center mt-3">
                <span className="text-slate-500">Estudiantes</span>
                <span className="text-slate-900 font-semibold">{course.student_count}</span>
            </div>
            </>
        )}
        </ModalStandard>
    )
}