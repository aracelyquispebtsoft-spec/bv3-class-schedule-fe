import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import { Children, useState } from 'react'

/**
 * Standard table (MUI Table) with client-side pagination. The page renders
 * every row with <TableRow> and <TableCell>; this adds the header, the
 * loading/empty message and the pagination.
 *
 * Usage:
 *   <TableData title="Horario de clases" columns={['Día', 'Materia']}>
 *     {rows.map((row) => <TableRow key={row.id}>...</TableRow>)}
 *   </TableData>
 */
function TableData({
  title,
  toolbar,
  columns,
  loading = false,
  emptyMessage = 'No hay registros',
  children,
}) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const rows = Children.toArray(children)
  const lastPage = Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1)
  const currentPage = Math.min(page, lastPage)
  const visibleRows = rows.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
  const message = loading ? 'Cargando...' : emptyMessage

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value))
    setPage(0)
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      {(title || toolbar) && (
        <div className="flex flex-col gap-4 p-6">
          {title && <h2 className="text-2xl font-bold text-slate-900">{title}</h2>}
          {toolbar && <div className="flex flex-wrap items-center gap-3">{toolbar}</div>}
        </div>
      )}

      <TableContainer>
        <Table sx={{ minWidth: 760, '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              {columns.map((column) => (
                <TableCell key={column} sx={{ fontWeight: 'bold' }}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading || rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  {message}
                </TableCell>
              </TableRow>
            ) : (
              visibleRows
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={(_event, newPage) => setPage(newPage)}
        onRowsPerPageChange={handleRowsPerPageChange}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </Paper>
  )
}

export default TableData
