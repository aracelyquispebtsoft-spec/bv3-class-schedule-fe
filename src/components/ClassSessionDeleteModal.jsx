import { Alert, Button } from '@mui/material'
import ModalStandard from './shared/ModalStandard'

export default function ClassSessionDeleteModal({
  isOpen,
  session,
  onClose,
  onConfirm,
  error,
  loading,
}) {
  return (
    <ModalStandard
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar clase"
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

      {session && (
        <p className="text-slate-700 text-base">
          ¿Está seguro de eliminar la clase de{' '}
          <strong className="font-bold text-slate-900">{session.subject?.name}</strong>{' '}
          ({session.course?.name}, {session.teacher?.name})?
        </p>
      )}
    </ModalStandard>
  )
}