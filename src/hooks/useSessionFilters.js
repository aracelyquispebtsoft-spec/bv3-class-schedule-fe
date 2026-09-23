import { useState, useMemo } from 'react';

export function useSessionFilters({
    coursesData = [],
    teachersData = [],
    classroomsData = [],
    classSessionsData = []
}) {
    const [filterType, setFilterType] = useState('course');
    const [filterValue, setFilterValue] = useState(coursesData[0]?.id);

    const filterOptions = useMemo(() => {
        if (filterType === 'course') {
            return coursesData.map((course) => ({
                value: course.id,
                label: course.name,
            }));
        }

        if (filterType === 'teacher') {
            return teachersData.map((teacher) => ({
                value: teacher.id,
                label: teacher.name,
        }));
    }

        return classroomsData.map((classroom) => ({
            value: classroom.id,
            label: classroom.name,
        }));
    }, [filterType, coursesData, teachersData, classroomsData]);

    const filteredSessions = useMemo(() => {
        return classSessionsData.filter((session) => {
        if (filterType === 'course') {
            return session.course.id === filterValue;
        }
        if (filterType === 'teacher') {
            return session.teacher.id === filterValue;
        }
        return session.classroom.id === filterValue;
        });
    }, [filterType, filterValue, classSessionsData]);

    const handleFilterTypeChange = (event) => {
        const value = event.target.value;
        setFilterType(value);

        if (value === 'course') setFilterValue(coursesData[0]?.id);
        if (value === 'teacher') setFilterValue(teachersData[0]?.id);
        if (value === 'classroom') setFilterValue(classroomsData[0]?.id);
    };

    const handleFilterValueChange = (event) => {
        setFilterValue(event.target.value);
    };

    const handleCreateClass = () => {
        alert('Agregar clase');
    };

    const getSessions = (day, timeSlotId) => {
        return filteredSessions.filter(
        (session) =>
            session.day === day && session.time_slot.id === timeSlotId
        );
    };

    const getSecondSelectLabel = () => {
        if (filterType === 'course') return 'Curso';
        if (filterType === 'teacher') return 'Docente';
        return 'Aula';
    };

    return {
        filterType,
        filterValue,
        filterOptions,
        handleFilterTypeChange,
        handleFilterValueChange,
        handleCreateClass,
        getSessions,
        getSecondSelectLabel,
    };
}
