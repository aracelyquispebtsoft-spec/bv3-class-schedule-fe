import { Button } from '@mui/material'
import ModalStandard from '../../ModalStandard'

export default function ClassroomDetailModal({
  isOpen,
  classroom,
  onClose,
  typeLabels,
}) {
  return (
    <ModalStandard
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del aula"
      actions={
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            fontWeight: 500,
            px: 2.5,
          }}
        >
          Cerrar
        </Button>
      }
    >
      {classroom && (
        <div className="flex flex-col gap-4 py-2">
          <div>
            <p className="text-sm text-slate-500">Nombre</p>
            <p className="font-medium text-slate-900">
              {classroom.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Capacidad</p>
            <p className="font-medium text-slate-900">
              {classroom.capacity}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Tipo</p>
            <p className="font-medium text-slate-900">
              {typeLabels[classroom.type] || classroom.type}
            </p>
          </div>
        </div>
      )}
    </ModalStandard>
  )
}
