import { MenuItem, TextField } from '@mui/material'

/**
 * Select (MUI TextField select). `options` is [{ value, label }] and `value`
 * starts as ''. `error` is shown below the field.
 */
function FormSelect({ label, name, value, onChange, options = [], error, ...props }) {
  return (
    <TextField
      select
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={Boolean(error)}
      helperText={error}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default FormSelect
