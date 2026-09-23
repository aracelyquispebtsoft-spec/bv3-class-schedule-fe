import {
  Paper,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'

import FormSelect from '../components/shared/FormSelect'

import {
  classSessionsData,
  classroomsData,
} from '../data/dummy.data'

import {
  DAY_OPTIONS,
  filterTypes,
} from '../utils/constants'

import { useSessionFilters } from '../hooks/useSessionFilters'

function SchedulePage() {
  const {
    filterType,
    filterValue,
    filterOptions,
    isLoading,
    isScheduleLoading,
    timeSlotsData,
    handleFilterTypeChange,
    handleFilterValueChange,
    handleCreateClass,
    getSessions,
    getSecondSelectLabel,
  } = useSessionFilters({
    classSessionsData,
    classroomsData,
  })

  return (
    <>
      <h1 className="text-3xl font-bold text-slate-900">
        Horario
      </h1>

      <h3 className="text-md text-gray-500 mt-2 mb-5">
        Semana tipo del curso, docente o aula elegido
      </h3>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              md: 'row',
            },
            alignItems: {
              xs: 'stretch',
              md: 'center',
            },
            justifyContent: 'space-between',
            gap: 2,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              alignItems: {
                xs: 'stretch',
                sm: 'center',
              },
              gap: 1.5,
            }}
          >
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Ver por
            </span>

            <FormSelect
              name="filterType"
              value={filterType}
              onChange={handleFilterTypeChange}
              options={filterTypes}
              disabled={isLoading}
              sx={{
                width: {
                  xs: '100%',
                  sm: 180,
                },
                '& .MuiInputBase-root': {
                  height: 44,
                },
              }}
            />

            <FormSelect
              label={
                isLoading
                  ? 'Cargando...'
                  : getSecondSelectLabel()
              }
              name="filterValue"
              value={filterValue}
              onChange={handleFilterValueChange}
              options={filterOptions}
              disabled={isLoading}
              sx={{
                width: {
                  xs: '100%',
                  sm: 180,
                },
                '& .MuiInputBase-root': {
                  height: 44,
                },
              }}
            />
          </Box>

          <Button
            type="button"
            variant="contained"
            onClick={handleCreateClass}
            disabled={isLoading}
            startIcon={<AddIcon />}
            sx={{
              bgcolor: 'grey.900',
              '&:hover': {
                bgcolor: 'grey.800',
              },
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              px: 2,
              height: 44,
              mt: {
                xs: 1.5,
                md: 0,
              },
              alignSelf: {
                xs: 'flex-start',
                md: 'auto',
              },
            }}
          >
            Agregar clase
          </Button>
        </Box>

        {isLoading ? (
          <Box
            sx={{
              p: 8,
              textAlign: 'center',
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            Cargando horario...
          </Box>
        ) : (
          <TableContainer
            sx={{
              px: 3,
              pb: 3,
              position: 'relative',
            }}
          >
            {isScheduleLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255,255,255,0.7)',
                }}
              >
                <span className="text-sm text-gray-500 font-medium">
                  Actualizando horario...
                </span>
              </Box>
            )}

            <Table
              sx={{
                minWidth: 1000,
                border: '1px solid',
                borderColor: 'divider',
                tableLayout: 'fixed',
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: 130,
                      fontWeight: 600,
                      textAlign: 'center',
                      bgcolor: 'grey.50',
                    }}
                  >
                    Franja
                  </TableCell>

                  {DAY_OPTIONS.map((day) => (
                    <TableCell
                      key={day.value}
                      align="center"
                      sx={{
                        fontWeight: 600,
                        bgcolor: 'grey.50',
                      }}
                    >
                      {day.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {timeSlotsData.map((timeSlot) => (
                  <TableRow key={timeSlot.id}>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 500,
                        color: 'text.secondary',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {timeSlot.start_time}–{timeSlot.end_time}
                    </TableCell>

                    {DAY_OPTIONS.map((day) => {
                      const sessions = getSessions(
                        day.value,
                        timeSlot.id
                      )

                      return (
                        <TableCell
                          key={`${day.value}-${timeSlot.id}`}
                          sx={{
                            height: 90,
                            verticalAlign: 'top',
                            p: 1,
                          }}
                        >
                          {sessions.map((session) => (
                            <Box
                              key={session.id}
                              sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                bgcolor: 'grey.50',
                                p: 1.25,
                              }}
                            >
                              <p className="text-sm font-semibold text-slate-900">
                                {session.subject.name}
                              </p>

                              <p className="text-xs text-slate-600 mt-1">
                                {session.course.name}
                                {' · '}
                                {session.teacher.name}
                              </p>

                              <p className="text-xs text-slate-500">
                                {session.classroom.name}
                              </p>
                            </Box>
                          ))}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </>
  )
}

export default SchedulePage