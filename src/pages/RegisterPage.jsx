import { useState } from "react";
import { Link, useNavigate } from "react-router";

import FormInput from "../components/shared/FormInput";
import FormStandard from "../components/shared/FormStandard";
import { register } from "../services/auth.service";
import { setToken } from "../utils/token";

const initialForm = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
};

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: null }));
    setError(null);
  };

  const validate = () => {
    const nextErrors = {};

    Object.entries(form).forEach(([name, value]) => {
      if (!value.trim()) nextErrors[name] = "Este campo es obligatorio";
    });

    if (form.password && form.password.length < 8) {
      nextErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    return nextErrors;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { token } = await register(form);
      setToken(token);
      navigate("/school/new", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg items-center px-6 py-10">
      <div className="w-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <FormStandard
          title="Crear cuenta"
          subtitle="Regístrate para comenzar a organizar tu horario."
          onSubmit={handleSubmit}
          submitText="Crear cuenta"
          loading={loading}
          error={error}
        >
          <FormInput
            label="Nombre"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            error={errors.firstname}
            required
          />
          <FormInput
            label="Apellido"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            error={errors.lastname}
            required
          />
          <FormInput
            label="Correo"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <FormInput
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            helperText={errors.password || "Mínimo 8 caracteres"}
            required
          />
        </FormStandard>

        <p className="mt-5 text-sm text-slate-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-slate-900 underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
