import { useState, useMemo, useEffect } from 'react'
import { courseService } from '../services/course.service'
import { getAll as getTeachers } from '../services/teacher.service'
import { classSessionsService } from '../services/class-session.service'

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

    const loadSchedule = async (type, value) => {
        if (!value) {
            setClassSessions([])
            return
        }

        try {
            setIsScheduleLoading(true)
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

            const response = await classSessionsService.getAll(filters)
            const sessions = Array.isArray(response)
                ? response
                : response?.data ?? []

            setClassSessions(sessions)
        } catch (error) {
            setClassSessions([])
        } finally {
            setIsScheduleLoading(false)
        }
    }

    useEffect(() => {
        const initialData = async () => {
            try {
                setIsLoading(true)

                const [
                    coursesRes,
                    teachersRes,
                    classroomsRes,
                    slotsRes,
                ] = await Promise.all([
                    courseService.getAll(),
                    getTeachers(),
                    classSessionsService.getClassrooms(),
                    classSessionsService.getTimeSlots(),
                ])

                const courses = Array.isArray(coursesRes)
                    ? coursesRes
                    : coursesRes?.data ?? []

                const teachers = Array.isArray(teachersRes)
                    ? teachersRes
                    : teachersRes?.data ?? []

                const classrooms = Array.isArray(classroomsRes)
                    ? classroomsRes
                    : classroomsRes?.data ?? []

                const slots = Array.isArray(slotsRes)
                    ? slotsRes
                    : slotsRes?.data ?? []

                setCourses(courses)
                setTeachers(teachers)
                setClassrooms(classrooms)
                setTimeSlots(slots)

                const firstCourseId = courses[0]?.id ?? ''

                setFilterType('course')
                setFilterValue(firstCourseId)

                await loadSchedule('course', firstCourseId)

            } catch (error) {

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

    const reloadSchedule = async () => {
        await loadSchedule(filterType, filterValue)
    }

    const handleCreateClass = async () => {
        const firstCourseId = coursesData[0]?.id ?? ''
        setFilterType('course')
        setFilterValue(firstCourseId)
        await loadSchedule('course', firstCourseId)
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
        timeSlotsData: timeSlots,
        handleFilterTypeChange,
        handleFilterValueChange,
        handleCreateClass,
        reloadSchedule,
        getSessions,
        getSecondSelectLabel,
    }
}