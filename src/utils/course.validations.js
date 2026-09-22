export const validateCouseField = (name, value) => {
    if (name === "name") {
        if(!value || typeof value !== "string" || value.trim() === ""){
            return "El nombre del curso es obligatorio."
        }
    }

    if(name === "student_count"){
        const count = Number(value)
        if(value === "" || value === null || value === undefined){
            return "La cantidad de estudiantes es obligatoria."
        }
        if(isNaN(count)){
            return "Debe ingresa un número válido."
        }
        if(count<=0){
            return "La cantidad de estudiantes debe ser mayor a 0"
        }
        if(!Number.isInteger(count)){
            return "La cantidad debe ser un número entero."
        }
        return ""
    }
}

export const validateCourseForm = (formData) => {
    const errros = {}
    const nameError = validateCouseField("name", formData.name)
    const studentCountError = validateCouseField("student_count", formData.student_count)

    if(nameError) errros.name = nameError
    if(studentCountError) errros.student_count = studentCountError

    return errros
} 