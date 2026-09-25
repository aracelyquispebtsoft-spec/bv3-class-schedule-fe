import { useState, useMemo, useEffect } from 'react'
import { courseService } from '../services/course.service'
import { getAll as getTeachers } from '../services/teacher.service'
import { getAll, getTimeSlots, create, update, remove } from '../services/class-session.service'
import { getAll as getClassrooms } from '../services/classroom.service'
import { getAll as getSubjects } from '../services/subject.service'

export function useSessionFilters() {
    const [coursesData, setCourses] = useState([])
    const [teachersData, setTeachers] = useState([])
    const [classroomsData, setClassrooms] = useState([])
    const [subjectsData, setSubjects] = useState([])
    const [timeSlots, setTimeSlots] = useState([])
    const [classSessions, setClassSessions] = useState([])

    const emptyForm = {
        subject_id: '',
        teacher_id: '',
        classroom_id: '',
        course_id: '',
        day: '',
        time_slot_id: '',
    }

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [editingSession, setEditingSession] = useState(null)
    const [formData, setFormData] = useState(emptyForm)
    const [formError, setFormError] = useState('')
    const [saving, setSaving] = useState(false)

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

                const [coursesRes, teachersRes, classroomsRes, subjectsRes, slotsRes] = await Promise.allSettled([
                    courseService.getAll(),
                    getTeachers(),
                    getClassrooms(),
                    getSubjects(),
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
                const subjects = extract(subjectsRes, 'materias')
                const slots = extract(slotsRes, 'franjas horarias')

                setCourses(courses)
                setTeachers(teachers)
                setClassrooms(classrooms)
                setSubjects(subjects)
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

    const reloadSchedule = async () => {
        await loadSchedule(filterType, filterValue)
    }

    const handleCreateClass = (prefill = {}) => {
        setEditingSession(null)
        setFormError('')
        setFormData({ ...emptyForm, ...prefill })
        setIsModalOpen(true)
    }

    const handleEditClass = (session) => {
        setEditingSession(session)
        setFormError('')
        setFormData({
            subject_id: session.subject?.id ?? '',
            teacher_id: session.teacher?.id ?? '',
            classroom_id: session.classroom?.id ?? '',
            course_id: session.course?.id ?? '',
            day: session.day ?? '',
            time_slot_id: session.time_slot?.id ?? '',
        })
        setIsModalOpen(true)
    }

    const handleFormChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const closeModal = () => {
        if (saving) return
        setIsModalOpen(false)
        setEditingSession(null)
        setFormError('')
    }

    const handleSubmitClass = async (event) => {
        event.preventDefault()
        try {
            setSaving(true)
            setFormError('')

            if (editingSession) {
                await update(editingSession.id, formData)
            } else {
                await create(formData)
            }

            setIsModalOpen(false)
            setEditingSession(null)
            await reloadSchedule()
        } catch (error) {
            setFormError(error.message || 'No se pudo guardar la clase.')
        } finally {
            setSaving(false)
        }
    }

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        if (saving) return
        setIsDeleteModalOpen(false)
    }

    const handleDeleteClass = async () => {
        if (!editingSession) return
        try {
            setSaving(true)
            setFormError('')
            await remove(editingSession.id)
            setIsDeleteModalOpen(false)
            setIsModalOpen(false)
            setEditingSession(null)
            await reloadSchedule()
        } catch (error) {
            setFormError(error.message || 'No se pudo eliminar la clase.')
            setIsDeleteModalOpen(false)
        } finally {
            setSaving(false)
        }
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

    const subjectOptions = useMemo(
        () => subjectsData.map((s) => ({ value: s.id, label: s.name })),
        [subjectsData]
    )
    const teacherOptions = useMemo(
        () => teachersData.map((t) => ({ value: t.id, label: t.name })),
        [teachersData]
    )
    const classroomOptions = useMemo(
        () => classroomsData.map((c) => ({ value: c.id, label: c.name })),
        [classroomsData]
    )
    const courseOptions = useMemo(
        () => coursesData.map((c) => ({ value: c.id, label: c.name })),
        [coursesData]
    )
    const timeSlotOptions = useMemo(
        () => timeSlots.map((t) => ({ value: t.id, label: `${t.start_time}–${t.end_time}` })),
        [timeSlots]
    )

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
        handleEditClass,
        reloadSchedule,
        getSessions,
        getSecondSelectLabel,
        isModalOpen,
        isDeleteModalOpen,
        editingSession,
        formData,
        formError,
        saving,
        handleFormChange,
        handleSubmitClass,
        closeModal,
        openDeleteModal,
        closeDeleteModal,
        handleDeleteClass,
        subjectOptions,
        teacherOptions,
        classroomOptions,
        courseOptions,
        timeSlotOptions,
    }
}