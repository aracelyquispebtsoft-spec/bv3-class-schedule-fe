import { useState, useMemo, useEffect } from 'react'
import { courseService } from '../services/course.service'
import { getAll as getTeachers } from '../services/teacher.service'
import { getAll, getTimeSlots } from '../services/class-session.service'
import { getAll as getClassrooms } from '../services/classroom.service'

export function useSessionFilters() {
    const [coursesData, setCourses] = useState([])
    const [teachersData, setTeachers] = useState([])
    const [classroomsData, setClassrooms] = useState([])
    const [timeSlots, setTimeSlots] = useState([])
    const [classSessions, setClassSessions] = useState([])

    const [filterType, setFilterType] = useState('course')
    const [filterValue, setFilterValue] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isScheduleLoading, setIsScheduleLoading] = useState(false)
    const [error, setError] = useState('')
    const [scheduleError, setScheduleError] = useState('')

    const loadSchedule = async (type, value) => {
        if (!value) {
            setClassSessions([])
            return
        }

        try {
            setIsScheduleLoading(true)
            setScheduleError('')
            let filters = {}
            if (type === 'course') {
                filters = {
                course_id: value,
                }
            }

            if (type === 'teacher') {
                filters = {
                teacher_id: value,
                }
            }

            if (type === 'classroom') {
                filters = {
                classroom_id: value,
                }
            }

            const response = await getAll(filters)
            setClassSessions(response)
        } catch (error) {
            setClassSessions([])
            setScheduleError(error.message || 'No se pudo cargar el horario. Intenta nuevamente.')
        } finally {
            setIsScheduleLoading(false)
        }
    }

    useEffect(() => {
        const initialData = async () => {
            try {
                setIsLoading(true)
                setError('')

                const [coursesRes, teachersRes, classroomsRes, slotsRes] = await Promise.allSettled([
                    courseService.getAll(),
                    getTeachers(),
                    getClassrooms(),
                    getTimeSlots(),
                ])

                const failed = []

                const extract = (result, label) => {
                    if (result.status === 'fulfilled') {
                        const value = result.value
                        return Array.isArray(value) ? value : value?.data ?? []
                    }
                    failed.push(label)
                    return []
                }

                const courses = extract(coursesRes, 'cursos')
                const teachers = extract(teachersRes, 'docentes')
                const classrooms = extract(classroomsRes, 'aulas')
                const slots = extract(slotsRes, 'franjas horarias')

                setCourses(courses)
                setTeachers(teachers)
                setClassrooms(classrooms)
                setTimeSlots(slots)

                if (failed.length > 0) {
                    setError(`No se pudo cargar: ${failed.join(', ')}. Intenta nuevamente.`)
                    return
                }

                const firstCourseId = courses[0]?.id ?? ''
                setFilterType('course')
                setFilterValue(firstCourseId)
                await loadSchedule('course', firstCourseId)

            } catch (error) {
                setError(error.message || 'No se pudo cargar la información del horario.')
            } finally {
                setIsLoading(false)
            }
        }

        initialData()
    }, [])

    const filterOptions = useMemo(() => {
        if (filterType === 'course') {
        return coursesData.map((course) => ({
            value: course.id,
            label: course.name,
        }))
        }

        if (filterType === 'teacher') {
        return teachersData.map((teacher) => ({
            value: teacher.id,
            label: teacher.name,
        }))
        }

        return classroomsData.map((classroom) => ({
        value: classroom.id,
        label: classroom.name,
        }))
    }, [
        filterType,
        coursesData,
        teachersData,
        classroomsData,
    ])

    const handleFilterTypeChange = async (event) => {
        const value = event.target.value

        let firstValue = ''
        if (value === 'course') {
        firstValue = coursesData[0]?.id ?? ''
        }

        if (value === 'teacher') {
        firstValue = teachersData[0]?.id ?? ''
        }

        if (value === 'classroom') {
        firstValue = classroomsData[0]?.id ?? ''
        }

        setFilterType(value)
        setFilterValue(firstValue)
        await loadSchedule(value, firstValue)
    }

    const handleFilterValueChange = async (event) => {
        const value = event.target.value
        setFilterValue(value)
        await loadSchedule(filterType, value)
    }

    // TODO: implementar la funcionalidad de crear una clase (CLS-23)
    const handleCreateClass = () => {
        // Por ahora no hace nada; la creación de clases se implementa en CLS-23
    }

    const reloadSchedule = async () => {
        await loadSchedule(filterType, filterValue)
    }

    const getSessions = (day, timeSlotId) => {
        return classSessions.filter(
        (session) =>
            session.day === day &&
            session.time_slot?.id === timeSlotId
        )
    }

    const getSecondSelectLabel = () => {
        if (filterType === 'course') return 'Curso'
        if (filterType === 'teacher') return 'Docente'
        return 'Aula'
    }

    return {
        filterType,
        filterValue,
        filterOptions,
        isLoading,
        isScheduleLoading,
        error,
        scheduleError,
        timeSlotsData: timeSlots,
        handleFilterTypeChange,
        handleFilterValueChange,
        handleCreateClass,
        reloadSchedule,
        getSessions,
        getSecondSelectLabel,
    }
}