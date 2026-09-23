import { useEffect, useMemo, useState } from 'react'

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'

import { getProgress } from '../services/progress.service'

const getProgressPercentage = (
  assignedHours,
  requiredHours
) => {
  if (requiredHours <= 0) {
    return 100
  }

  return Math.min(
    (assignedHours / requiredHours) * 100,
    100
  )
}


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

        const response = await getProgress()

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


      {progress?.complete ? (
        <Alert severity="success">
          ¡El horario está completo!
        </Alert>
      ) : (
        <Alert severity="info">
          Faltan {totalMissingHours} h en total.
        </Alert>
      )}


      <FormControl
        fullWidth
        sx={{
          maxWidth: 320,
        }}
      >
        <InputLabel id="course-filter-label">
          Curso
        </InputLabel>

        <Select
          labelId="course-filter-label"
          id="course-filter"
          value={selectedCourseId}
          label="Curso"
          onChange={(event) =>
            setSelectedCourseId(
              event.target.value
            )
          }
        >
          <MenuItem value="all">
            Todos los cursos
          </MenuItem>

          {courses.map(({ course }) => (
            <MenuItem
              key={course.id}
              value={String(course.id)}
            >
              {course.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


      {filteredCourses.length === 0 ? (
        <Alert severity="info">
          No hay información de progreso
          disponible.
        </Alert>
      ) : (
        <Stack spacing={3}>
          {filteredCourses.map(
            ({
              course,
              complete,
              subjects,
            }) => (
              <Card
                key={course.id}
                variant="outlined"
              >
                <CardContent>
                  <Stack spacing={3}>
                    <Box>
                      <Typography
                        variant="h6"
                        component="h2"
                      >
                        {course.name}
                      </Typography>

                      {complete && (
                        <Typography
                          variant="body2"
                          color="success.main"
                          sx={{
                            fontWeight: 600,
                            mt: 0.5,
                          }}
                        >
                          Curso completo
                        </Typography>
                      )}
                    </Box>


                    {subjects.map(
                      ({
                        subject,
                        required_hours,
                        assigned_hours,
                        missing_hours,
                      }) => {
                        const percentage =
                          getProgressPercentage(
                            assigned_hours,
                            required_hours
                          )

                        const isComplete =
                          missing_hours === 0

                        return (
                          <Box
                            key={subject.id}
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                              }}
                            >
                              {subject.name}
                            </Typography>


                            {isComplete ? (
                              <Typography
                                variant="body2"
                                color="success.main"
                                sx={{
                                  fontWeight: 600,
                                }}
                              >
                                Completa
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {assigned_hours} h de{' '}
                                {required_hours} · faltan{' '}
                                {missing_hours} h
                              </Typography>
                            )}


                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                              }}
                            />
                          </Box>
                        )
                      }
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )
          )}
        </Stack>
      )}
    </Box>
  )
}


export default ProgressPage