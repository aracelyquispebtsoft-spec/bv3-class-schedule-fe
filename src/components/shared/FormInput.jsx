import { TextField } from '@mui/material'

/**
 * Text field (MUI TextField) for text, email, number, password, date and time.
 * `error` is shown below the field; other props go straight to the TextField.
 */
function FormInput({ label, name, type = 'text', value, onChange, error, ...props }) {
  const shrinkLabel = type === 'date' || type === 'time'

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      error={Boolean(error)}
      helperText={error}
      slotProps={shrinkLabel ? { inputLabel: { shrink: true } } : undefined}
      {...props}
    />
  )
}

export default FormInput
