import FormStandard from '../FormStandard'

/**
 * Wrapper de FormStandard que oculta los botones por defecto 
 * para usar los botones personalizados del ModalStandard.
 */
function FormCourse({ children, ...props }) {
    return (
        <div className="[&_form>div:last-child]:hidden">
        <FormStandard {...props}>
            {children}
        </FormStandard>
        </div>
    )
}

export default FormCourse