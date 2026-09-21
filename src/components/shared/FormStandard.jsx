import { Alert, Button } from '@mui/material'

/**
 * Standard form: optional title, 2-column field grid (1 on mobile), alerts and
 * Cancel / Save buttons. The page validates and passes each field its error.
 *
 * Usage:
 *   <FormStandard title="Nueva clase" onSubmit={save} onCancel={close} warning={warning}>
 *     <FormSelect ... />
 *     <FormInput ... />
 *   </FormStandard>
 */
function FormStandard({
  title,
  subtitle,
  onSubmit,
  onCancel,
  submitText = 'Guardar',
  loadingText = 'Guardando..',
  loading = false,
  warning,
  error,
  children,
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {title && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="text-slate-500">{subtitle}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>

      {warning && <Alert severity="warning">{warning}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        {onCancel && (
          <Button variant="outlined" color="inherit" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? loadingText : submitText}
        </Button>
      </div>
    </form>
  )
}

export default FormStandard
