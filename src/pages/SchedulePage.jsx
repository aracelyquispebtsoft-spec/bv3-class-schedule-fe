import { useMemo, useState } from 'react'
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
  timeSlotsData,
  teachersData,
  classroomsData,
  coursesData,
} from '../data/dummy.data'

import { DAY_OPTIONS, filterTypes } from '../utils/constants'
import { useSessionFilters } from '../hooks/useSessionFilters';

function SchedulePage() {
  const {
    filterType,
    filterValue,
    filterOptions,
    handleFilterTypeChange,
    handleFilterValueChange,
    handleCreateClass,
    getSessions,
    getSecondSelectLabel
  } = useSessionFilters({
    coursesData,
    teachersData,
    classroomsData,
    classSessionsData
  });

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
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
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
              sx={{
                width: 180,
                '& .MuiInputBase-root': {
                  height: 44,
                },
              }}
            />

            <FormSelect
              label={getSecondSelectLabel()}
              name="filterValue"
              value={filterValue}
              onChange={handleFilterValueChange}
              options={filterOptions}
              sx={{
                width: 180,
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
            }}
          >
            Agregar clase
          </Button>
        </Box>

        <TableContainer sx={{ px: 3, pb: 3 }}>
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
                              {session.course.name} · {session.teacher.name}
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
      </Paper>
    </>
  )
}

export default SchedulePage