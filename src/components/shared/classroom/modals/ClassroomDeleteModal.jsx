import { Alert, Button } from '@mui/material'
import ModalStandard from '../../ModalStandard'

export default function ClassroomDeleteModal({
  isOpen,
  classroom,
  onClose,
  onConfirm,
  error,
  loading,
}) {
  return (
    <ModalStandard
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar aula"
      actions={
        <>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={loading}
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
            variant="contained"
            color="error"
            onClick={onConfirm}
            disabled={loading}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500,
              px: 2.5,
            }}
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

      {classroom && (
        <p className="text-slate-700 text-base">
          ¿Está seguro de eliminar esta aula{' '}
          <strong className="font-bold text-slate-900">
            {classroom.name}
          </strong>
          ?
        </p>
      )}
    </ModalStandard>
  )
}
