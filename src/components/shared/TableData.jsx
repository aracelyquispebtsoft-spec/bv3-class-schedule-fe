import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Children, useState } from "react";

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
  emptyMessage = "No hay registros",
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  children,
}) {
  const isServerPaginated = total !== undefined;
  const [localPage, setLocalPage] = useState(0);
  const [localRowsPerPage, setLocalRowsPerPage] = useState(10);

  const rows = Children.toArray(children);
  const activePage = isServerPaginated ? page : localPage;
  const activeRowsPerPage = isServerPaginated ? rowsPerPage : localRowsPerPage;
  const lastPage = Math.max(0, Math.ceil(rows.length / activeRowsPerPage) - 1);
  const currentPage = isServerPaginated
    ? activePage
    : Math.min(activePage, lastPage);
  const visibleRows = isServerPaginated
    ? rows
    : rows.slice(
        currentPage * activeRowsPerPage,
        (currentPage + 1) * activeRowsPerPage,
      );
  const message = loading ? "Cargando..." : emptyMessage;

  const handleRowsPerPageChange = (event) => {
    const nextRowsPerPage = Number(event.target.value);
    if (isServerPaginated) {
      onRowsPerPageChange(nextRowsPerPage);
      return;
    }
    setLocalRowsPerPage(nextRowsPerPage);
    setLocalPage(0);
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      {(title || toolbar) && (
        <div className="flex flex-col gap-4 p-6">
          {title && (
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          )}
          {toolbar && (
            <div className="flex flex-wrap items-center gap-3">{toolbar}</div>
          )}
        </div>
      )}

      <TableContainer>
        <Table
          sx={{
            minWidth: 760,
            "& .MuiTableCell-root": { whiteSpace: "nowrap" },
          }}
        >
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              {columns.map((column) => (
                <TableCell key={column} sx={{ fontWeight: "bold" }}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading || rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
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
        count={isServerPaginated ? total : rows.length}
        page={currentPage}
        rowsPerPage={activeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={(_event, newPage) => {
          if (isServerPaginated) {
            onPageChange(newPage);
          } else {
            setLocalPage(newPage);
          }
        }}
        onRowsPerPageChange={handleRowsPerPageChange}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} de ${count}`
        }
      />
    </Paper>
  );
}

export default TableData;
