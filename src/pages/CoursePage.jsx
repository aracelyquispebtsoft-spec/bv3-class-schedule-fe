import { TableCell, TableRow, Button, Snackbar, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TableActions from '../components/shared/TableActions'
import TableData from '../components/shared/TableData'
import CourseFormModal from '../components/shared/course/modals/CourseFormModal'
import CourseDetailModal from '../components/shared/course/modals/CourseDetailModal'
import CourseDeleteModal from '../components/shared/course/modals/CourseDeleteModal'
import { useCourses } from '../hooks/useCourses'

const columns = ['Nombre', 'Estudiantes', 'Acciones']

function CoursePage() {
  const {
    courses,
    loading,
    formModal,
    detailModal,
    deleteModal,
    handleOpenCreate,
    handleOpenEdit,
    handleView,
    handleOpenDelete,
    successMessage,
    closeSuccess,
  } = useCourses()

  return (
    <>
      <h2 className="text-3xl font-bold text-slate-900">Cursos</h2>
      <h3 className="text-md text-gray-500 mt-2 mb-5">Listado del colegio</h3>

      <TableData
        columns={columns}
        title={
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl font-bold text-slate-900">Cursos</h2>
            <Button
              type="button"
              variant="contained"
              onClick={handleOpenCreate}
              sx={{
                bgcolor: 'grey.900',
                '&:hover': { bgcolor: 'grey.800' },
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
              }}
              startIcon={<AddIcon />}
            >
              Agregar Curso
            </Button>
          </div>
        }
        loading={loading}
        emptyMessage="No hay registro de cursos"
      >
        {courses.map((course) => (
          <TableRow key={course.id} hover>
            <TableCell>{course.name}</TableCell>
            <TableCell>{course.student_count}</TableCell>
            <TableCell>
              <TableActions
                onView={() => handleView(course)}
                onEdit={() => handleOpenEdit(course)}
                onDelete={() => handleOpenDelete(course)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableData>

      <CourseFormModal {...formModal} />
      <CourseDetailModal {...detailModal} />
      <CourseDeleteModal {...deleteModal} />
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={closeSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
      >
        <Alert severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default CoursePage