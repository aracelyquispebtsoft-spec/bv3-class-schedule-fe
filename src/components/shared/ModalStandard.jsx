import CloseIcon from '@mui/icons-material/Close'
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'

/**
 * Standard modal (MUI Dialog): title, close button, content and optional
 * footer actions. Closes with the X, Escape or a click outside.
 *
 * Usage:
 *   <ModalStandard isOpen={isOpen} onClose={close} title="Agregar clase">
 *     <FormStandard onSubmit={save} onCancel={close}>...</FormStandard>
 *   </ModalStandard>
 */
function ModalStandard({ isOpen, onClose, title, actions, children }) {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {title}
        <IconButton onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ paddingTop: '24px !important' }}>{children}</DialogContent>

      {actions && <DialogActions sx={{ px: 3, pb: 3 }}>{actions}</DialogActions>}
    </Dialog>
  )
}

export default ModalStandard
