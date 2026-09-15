import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { IconButton, Tooltip } from '@mui/material'

/** Row actions: edit, view and delete. Each button shows only if its handler is passed. */
function TableActions({ onEdit, onView, onDelete }) {
  return (
    <div className="flex gap-1">
      {onEdit && (
        <Tooltip title="Editar">
          <IconButton color="primary" onClick={onEdit}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {onView && (
        <Tooltip title="Ver">
          <IconButton onClick={onView}>
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title="Eliminar">
          <IconButton color="error" onClick={onDelete}>
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}

export default TableActions
