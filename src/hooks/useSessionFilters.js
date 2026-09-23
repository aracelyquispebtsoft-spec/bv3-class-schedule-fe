import { useState, useMemo, useEffect } from 'react'
import { courseService } from '../services/course.service'
import { getAll as getTeachers } from '../services/teacher.service'
import { classSessionsService } from '../services/class-session.service'

export function useSessionFilters({
    classSessionsData = [],
    classroomsData = [],
}) {
    const [coursesData, setCourses] = useState([])
    const [teachersData, setTeachers] = useState([])
    const [timeSlots, setTimeSlots] = useState([])

    const [filterType, setFilterType] = useState('course')
    const [filterValue, setFilterValue] = useState('')

    const [isLoading, setIsLoading] = useState(true)

    const [isScheduleLoading, setIsScheduleLoading] = useState(false)

    useEffect(() => {
        const initialData = async () => {
        try {
            setIsLoading(true)

            const [
            coursesRes,
            teachersRes,
            slotsRes,
            slotsSessions
            ] = await Promise.all([
            courseService.getAll(),
            getTeachers(),
            classSessionsService.getTimeSlots(),
            classSessionsService.getAll(),
            ])

            const courses = Array.isArray(coursesRes)
            ? coursesRes
            : coursesRes?.data ?? []

            const teachers = Array.isArray(teachersRes)
            ? teachersRes
            : teachersRes?.data ?? []

            const slots = Array.isArray(slotsRes)
            ? slotsRes
            : slotsRes?.data ?? []

            setCourses(courses)
            setTeachers(teachers)
            setTimeSlots(slots)

            setFilterValue(courses[0]?.id ?? '')
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

    const filteredSessions = useMemo(() => {
        return classSessionsData.filter((session) => {
        if (filterType === 'course') {
            return session.course?.id === filterValue
        }

        if (filterType === 'teacher') {
            return session.teacher?.id === filterValue
        }

        return session.classroom?.id === filterValue
        })
    }, [
        filterType,
        filterValue,
        classSessionsData,
    ])

    const handleFilterTypeChange = (event) => {
        const value = event.target.value

        setFilterType(value)

        if (value === 'course') {
        setFilterValue(coursesData[0]?.id ?? '')
        }

        if (value === 'teacher') {
        setFilterValue(teachersData[0]?.id ?? '')
        }

        if (value === 'classroom') {
        setFilterValue(classroomsData[0]?.id ?? '')
        }
    }

    const handleFilterValueChange = (event) => {
        setFilterValue(event.target.value)
    }

    const reloadSchedule = async () => {
        try {
            setIsScheduleLoading(true)

            await new Promise((resolve) => setTimeout(resolve, 800))

        } finally {
            setIsScheduleLoading(false)
        }
    }

    const handleCreateClass = async () => {
        setFilterType('course')
        setFilterValue(coursesData[0]?.id ?? '')

        await reloadSchedule()
    }

    const getSessions = (day, timeSlotId) => {
        return filteredSessions.filter(
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
        getSessions,
        getSecondSelectLabel,
    }
}