import AddIcon from "@mui/icons-material/Add";
import { Button, TableCell, TableRow } from "@mui/material";
import { useState } from "react";

import FormInput from "../components/shared/FormInput";
import FormSelect from "../components/shared/FormSelect";
import FormStandard from "../components/shared/FormStandard";
import ModalStandard from "../components/shared/ModalStandard";
import TableActions from "../components/shared/TableActions";
import TableData from "../components/shared/TableData";
import * as subjectService from "../services/subject.service";
import { CLASSROOM_TYPES } from "../utils/constants";
import { usePaginatedList } from '../hooks/usePaginatedList'

const emptyForm = {
  name: "",
  weekly_hours: "",
  required_room_type: "",
};

const roomTypeLabels = {
  COMMON: "Común",
  LAB: "Laboratorio",
  COMPUTER: "Informática",
};

const roomTypeOptions = CLASSROOM_TYPES.map((type) => ({
  value: type,
  label: roomTypeLabels[type],
}));

function SubjectPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [viewing, setViewing] = useState(null);

  const [toDelete, setToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const {
    items: subjects,
    loading,
    error,
    page,
    rowsPerPage,
    total,
    onPageChange,
    onRowsPerPageChange,
    reload,
  } = usePaginatedList(subjectService.getPage)

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (subject) => {
    setEditing(subject);
    setForm({
      name: subject.name,
      weekly_hours: String(subject.weekly_hours),
      required_room_type: subject.required_room_type,
    });
    setFormErrors({});
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setFormError(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: null,
    }));

    setFormError(null);
  };

  const validate = () => {
    const nextErrors = {};
    const weeklyHours = Number(form.weekly_hours);

    if (!form.name.trim()) {
      nextErrors.name = "El nombre es obligatorio";
    }

    if (
      !form.weekly_hours ||
      !Number.isInteger(weeklyHours) ||
      weeklyHours <= 0
    ) {
      nextErrors.weekly_hours = "Las horas deben ser mayores que 0";
    } else if (weeklyHours % 2 !== 0) {
      nextErrors.weekly_hours = "Las horas por semana deben ser un número par";
    }

    if (!form.required_room_type) {
      nextErrors.required_room_type = "El tipo de aula es obligatorio";
    }

    setFormErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    setFormError(null);

    const payload = {
      name: form.name.trim(),
      weekly_hours: Number(form.weekly_hours),
      required_room_type: form.required_room_type,
    };

    try {
      if (editing) {
        await subjectService.update(editing.id, payload);
      } else {
        await subjectService.create(payload);
      }

      closeModal();
      reload();
    } catch (requestError) {
      setFormError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);

    try {
      await subjectService.remove(toDelete.id);
      setToDelete(null);
      reload();
    } catch (requestError) {
      setDeleteError(requestError.message);
    } finally {
      setDeleting(false);
    }
  };

  if (error) {
    return <p className="text-red-700">Error: {error}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Materias</h1>
        <p className="text-slate-500">Listado del colegio</p>
      </div>

      <TableData
        title="Materias"
        columns={['Nombre', 'Horas por semana', 'Tipo de aula', 'Acciones']}
        loading={loading}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        toolbar={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            Agregar materia
          </Button>
        }
      >
        {subjects.map((subject) => (
          <TableRow key={subject.id} hover>
            <TableCell>{subject.name}</TableCell>
            <TableCell>{subject.weekly_hours} h</TableCell>
            <TableCell>{roomTypeLabels[subject.required_room_type]}</TableCell>
            <TableCell>
              <TableActions
                onEdit={() => openEdit(subject)}
                onView={() => setViewing(subject)}
                onDelete={() => setToDelete(subject)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableData>

      <ModalStandard
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? "Editar materia" : "Agregar materia"}
      >
        <FormStandard
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitText="Guardar"
          loading={saving}
          loadingText="Guardando..."
          error={formError}
        >
          <FormInput
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={formErrors.name}
            required
          />

          <div className="flex flex-col gap-1">
            <FormInput
              label="Horas por semana"
              name="weekly_hours"
              type="number"
              value={form.weekly_hours}
              onChange={handleChange}
              error={formErrors.weekly_hours}
              required
            />

            {!formErrors.weekly_hours && (
              <p className="text-xs text-slate-500">Número par, mayor que 0</p>
            )}
          </div>

          <FormSelect
            label="Tipo de aula"
            name="required_room_type"
            value={form.required_room_type}
            onChange={handleChange}
            options={roomTypeOptions}
            error={formErrors.required_room_type}
            required
          />
        </FormStandard>
      </ModalStandard>

      <ModalStandard
        isOpen={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Detalle"
      >
        {viewing && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-slate-500">Nombre</p>
              <p className="font-semibold text-slate-900">{viewing.name}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Horas por semana</p>
              <p className="font-semibold text-slate-900">
                {viewing.weekly_hours} h
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Tipo de aula</p>
              <p className="font-semibold text-slate-900">
                {roomTypeLabels[viewing.required_room_type]}
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setViewing(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </ModalStandard>

      <ModalStandard
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Eliminar materia"
        actions={
          <>
            <Button
              color="inherit"
              onClick={() => setToDelete(null)}
              disabled={deleting}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p>
            ¿Seguro que quieres eliminar la materia{" "}
            <strong>{toDelete?.name}</strong>?
          </p>

          {deleteError && <p className="text-red-700">{deleteError}</p>}
        </div>
      </ModalStandard>
    </div>
  );
}

export default SubjectPage;
