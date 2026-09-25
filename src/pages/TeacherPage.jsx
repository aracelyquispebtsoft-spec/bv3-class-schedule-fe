import AddIcon from "@mui/icons-material/Add";
import { Button, TableCell, TableRow } from "@mui/material";
import { useState } from "react";
import FormInput from "../components/shared/FormInput";
import FormStandard from "../components/shared/FormStandard";
import ModalStandard from "../components/shared/ModalStandard";
import TableActions from "../components/shared/TableActions";
import TableData from "../components/shared/TableData";
import * as teacherService from "../services/teacher.service";
import { usePaginatedList } from '../hooks/usePaginatedList'

const emptyForm = { name: "", max_weekly_hours: "" };

function TeacherPage() {
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
    items: teachers,
    loading,
    error,
    page,
    rowsPerPage,
    total,
    onPageChange,
    onRowsPerPageChange,
    reload,
  } = usePaginatedList(teacherService.getPage)

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (teacher) => {
    setEditing(teacher);
    setForm({
      name: teacher.name,
      max_weekly_hours: String(teacher.max_weekly_hours),
    });
    setFormErrors({});
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "El nombre es obligatorio";
    }

    const hours = Number(form.max_weekly_hours);
    if (!form.max_weekly_hours || Number.isNaN(hours) || hours <= 0) {
      errors.max_weekly_hours = "Ingresa un número mayor que 0";
    } else if (hours % 2 !== 0) {
      errors.max_weekly_hours = "Debe ser un número par";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    setFormError(null);

    const payload = {
      name: form.name.trim(),
      max_weekly_hours: Number(form.max_weekly_hours),
    };

    try {
      if (editing) {
        await teacherService.update(editing.id, payload);
      } else {
        await teacherService.create(payload);
      }
      closeModal();
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);

    try {
      await teacherService.remove(toDelete.id);
      setToDelete(null);
      reload();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (error) return <p className="text-red-700">Error: {error}</p>;

  return (
    <div className="flex flex-col gap-4">
      <TableData
        title="Docentes"
        columns={['Nombre', 'Tope semanal', 'Acciones']}
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
            Agregar docente
          </Button>
        }
      >
        {teachers.map((teacher) => (
          <TableRow key={teacher.id} hover>
            <TableCell>{teacher.name}</TableCell>
            <TableCell>{teacher.max_weekly_hours} h</TableCell>
            <TableCell>
              <TableActions
                onEdit={() => openEdit(teacher)}
                onView={() => setViewing(teacher)}
                onDelete={() => setToDelete(teacher)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableData>

      <ModalStandard
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? "Editar docente" : "Agregar docente"}
      >
        <FormStandard
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={saving}
          error={formError}
        >
          <FormInput
            label="Nombre"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            error={formErrors.name}
          />
          <div className="flex flex-col gap-1">
            <FormInput
              label="Tope de horas por semana"
              name="max_weekly_hours"
              type="number"
              required
              value={form.max_weekly_hours}
              onChange={handleChange}
              error={formErrors.max_weekly_hours}
            />
            {!formErrors.max_weekly_hours && (
              <p className="text-xs text-slate-500">Número par, mayor que 0</p>
            )}
          </div>
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
              <p className="text-sm text-slate-500">Tope semanal</p>
              <p className="font-semibold text-slate-900">
                {viewing.max_weekly_hours} h
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
        title="Eliminar docente"
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
            ¿Seguro que quieres eliminar a <strong>{toDelete?.name}</strong>?
          </p>
          {deleteError && <p className="text-red-700">{deleteError}</p>}
        </div>
      </ModalStandard>
    </div>
  );
}

export default TeacherPage;
