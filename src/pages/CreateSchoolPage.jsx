import { useState } from 'react'
import { useNavigate } from 'react-router'

import FormInput from '../components/shared/FormInput'
import FormStandard from '../components/shared/FormStandard'
import * as schoolService from '../services/school.service'

function CreateSchoolPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('El nombre del colegio es obligatorio')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await schoolService.create({ name: name.trim() })
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <FormStandard
          title="Crea tu colegio"
          subtitle="Antes de empezar, registra el colegio que vas a organizar."
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        >
          <FormInput
            label="Nombre del colegio"
            name="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setError(null)
            }}
            error={error && !name.trim() ? error : null}
            required
          />
        </FormStandard>
      </div>
    </div>
  )
}

export default CreateSchoolPage