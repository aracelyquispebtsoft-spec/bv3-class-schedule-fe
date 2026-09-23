import { useEffect, useMemo, useState } from 'react'

import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'

import FormSelect from '../components/shared/FormSelect'
import ProgressCourseCard from '../components/progress/ProgressCourseCard'
import { getAll } from '../services/progress.service'

function ProgressPage() {
  const [progress, setProgress] = useState(null)
  const [selectedCourseId, setSelectedCourseId] =
    useState('all')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getAll()

        setProgress(response)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [])

  const courses = progress?.courses ?? []

  const courseOptions = useMemo(() => {
    return [
      {
        value: 'all',
        label: 'Todos los cursos',
      },
      ...courses.map(({ course }) => ({
        value: String(course.id),
        label: course.name,
      })),
    ]
  }, [courses])

  const filteredCourses = useMemo(() => {
    if (selectedCourseId === 'all') {
      return courses
    }

    return courses.filter(
      ({ course }) =>
        String(course.id) === selectedCourseId
    )
  }, [
    courses,
    selectedCourseId,
  ])

  const totalMissingHours = useMemo(() => {
    return courses.reduce(
      (courseTotal, courseItem) => {
        const courseMissingHours =
          courseItem.subjects.reduce(
            (subjectTotal, subjectItem) =>
              subjectTotal +
              subjectItem.missing_hours,
            0
          )

        return (
          courseTotal +
          courseMissingHours
        )
      },
      0
    )
  }, [courses])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 6,
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
        >
          Progreso del horario
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          Revisa las horas asignadas y las
          horas pendientes de cada materia.
        </Typography>
      </Box>

      {courses.length > 0 && (
        progress?.complete ? (
          <Alert severity="success">
            ¡El horario está completo!
          </Alert>
        ) : (
          <Alert severity="info">
            Faltan {totalMissingHours} h en total.
          </Alert>
        )
      )}

      <Box
        sx={{
          maxWidth: 320,
        }}
      >
        <FormSelect
          label="Curso"
          name="course"
          value={selectedCourseId}
          onChange={(event) =>
            setSelectedCourseId(
              event.target.value
            )
          }
          options={courseOptions}
        />
      </Box>


      {filteredCourses.length === 0 ? (
        <Alert severity="info">
          No hay información de progreso
          disponible.
        </Alert>
      ) : (
        <Stack spacing={3}>
          {filteredCourses.map(
            (courseItem) => (
              <ProgressCourseCard
                key={courseItem.course.id}
                course={courseItem.course}
                complete={courseItem.complete}
                subjects={courseItem.subjects}
              />
            )
          )}
        </Stack>
      )}
    </Box>
  )
}

export default ProgressPage