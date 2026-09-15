# Horario de clases — frontend (React + Vite + MUI + Tailwind)

Frontend base del sistema de horarios de clases. Consume
[bv3-class-schedule-be](https://github.com/karenpacasibt/bv3-class-schedule-be).

## Estructura

```
src/
├── main.jsx                        # Entrypoint: monta <App />
├── App.jsx                         # Layout raiz (y ejemplo de rutas en el comentario)
├── index.css                       # Tailwind y estilos base
├── config/config.js                # Lectura de .env
├── services/
│   ├── service.js                  # URLs de cada recurso, HEADERS y handleResponse()
│   └── user.service.js             # Llamadas al API: getMe()
├── utils/token.js                  # Guardar / leer / borrar el token (localStorage)
├── routes/
│   ├── PrivateRoute.jsx            # Sin token → /login
│   └── PublicRoute.jsx             # Con token → /
├── pages/HomePage.jsx              # Pagina: pide los datos y los muestra
└── components/
    ├── shared/                     # Componentes base reutilizables (MUI + Tailwind)
    │   ├── TableData.jsx           # Tabla con titulo, barra, mensajes y paginacion
    │   ├── TableActions.jsx        # Botones editar / ver / eliminar de una fila
    │   ├── ModalStandard.jsx       # Modal con titulo, boton cerrar y acciones
    │   ├── FormStandard.jsx        # Formulario: grilla, alertas, Cancelar / Guardar
    │   ├── FormInput.jsx           # Campo de texto, fecha u hora
    │   └── FormSelect.jsx          # Lista desplegable
    ├── UserCard.jsx                # Muestra el usuario
    └── SchoolCard.jsx              # Muestra su colegio (o un aviso si no tiene)
```

## Flujo

```
Page → Service → Backend → handleResponse → Page → Component
```

- **Service**: arma la URL con las constantes de `service.js`, hace el `fetch`
  y lo pasa por `handleResponse`, que devuelve `body.data` o lanza un error con
  el mensaje del backend.
- **Page**: llama al service, guarda el resultado en el estado y decide que
  mostrar (cargando, error o los datos).
- **Component**: solo recibe datos por props y los dibuja. No llama al API.

## Arranque

Resumen de la **primera vez** (el detalle de cada paso esta abajo):

```bash
npm install            # 1. dependencias
cp .env.example .env   # 2. variables de entorno
npm run dev            # 3. arranca el proyecto
```

> Antes necesitas el backend corriendo, con las migraciones y los seeders
> ejecutados (ver paso 0).

### 0. Levanta el backend

Sigue el README de `bv3-class-schedule-be`. En resumen:

```bash
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

Verifica que <http://127.0.0.1:3000/api/user/me> responda con el usuario del
seeder y su colegio.

### 1. Instala las dependencias

```bash
npm install
```

> Instala desde la misma terminal con la que vas a correr el proyecto (Windows
> o WSL). Vite trae binarios distintos para cada sistema: si instalas en uno y
> corres en el otro, falla al arrancar. Si pasa, borra `node_modules` y vuelve
> a correr `npm install`.

### 2. Crea tu archivo `.env`

```bash
cp .env.example .env
```

`VITE_API_URL` es solo la URL del backend, sin `/api`:

```
VITE_API_URL=http://127.0.0.1:3000
```

Si el backend usa otro host o puerto, cambia `VITE_API_URL`.

### 3. Arranca el proyecto

```bash
npm run dev
```

Abre <http://localhost:5173>. Vas a ver el usuario del seeder
(`User Admin` / `user@admin.com`) y su colegio (`Colegio San Martín`).

### Problemas comunes

**`Error: Failed to fetch`**
El backend no esta corriendo o `VITE_API_URL` apunta a otro lado. Levanta el
backend y revisa tu `.env`.

**`Error: No query result for models User`**
El backend arranco pero no tiene datos. Corre `npm run seed` en el backend.

**Cambie el `.env` y no pasa nada**
Vite lee el `.env` solo al arrancar. Corta `npm run dev` y vuelve a correrlo.

## Endpoint consumido

```
GET /api/user/me
```

```json
{
  "data": {
    "id": "01JYQZ8K3M4N5P6Q7R8S9T0V1W",
    "firstname": "User",
    "lastname": "Admin",
    "email": "user@admin.com",
    "school": {
      "id": "01JYQZ9A4B5C6D7E8F9G0H1J2K",
      "name": "Colegio San Martín"
    }
  }
}
```

Si el usuario todavia no creo su colegio, `school` viene en `null` y
`SchoolCard` muestra un aviso.

## Componentes base

Estan en `src/components/shared/`, usan [MUI](https://mui.com/material-ui/) y
Tailwind, y solo tienen tema claro. Cada uno tiene un comentario breve (en
ingles) arriba del componente; el detalle y los ejemplos estan aca abajo.

| Componente | Para que sirve |
|---|---|
| `TableData` + `TableActions` | Listados con barra de herramientas, acciones por fila y paginacion |
| `ModalStandard` | Formularios de crear/editar, detalle y confirmacion de borrado |
| `FormStandard` + `FormInput` + `FormSelect` | Formularios con validacion, alertas y botones Cancelar / Guardar |

**Estilos:** Tailwind se usa en las etiquetas HTML (`div`, `h2`, `p`) para el
layout. Los componentes de MUI se ajustan con sus props (`variant`, `color`,
`size`) o con `sx`, no con clases de Tailwind.

### TableData

```jsx
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { Button, Chip, InputAdornment, TableCell, TableRow, TextField } from '@mui/material'
import TableActions from '../components/shared/TableActions'
import TableData from '../components/shared/TableData'

const columns = ['Día', 'Hora', 'Materia', 'Docente', 'Estado', 'Acciones']

<TableData
  title="Horario de clases"
  columns={columns}
  loading={loading}
  toolbar={
    <>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreate}>
        Agregar clase
      </Button>
      <TextField
        size="small"
        placeholder="Buscar por materia o docente"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
    </>
  }
>
  {sessions.map((row) => (
    <TableRow key={row.id} hover>
      <TableCell>{row.day}</TableCell>
      <TableCell>{row.start} - {row.end}</TableCell>
      <TableCell>{row.subject}</TableCell>
      <TableCell>{row.teacher}</TableCell>
      <TableCell>
        <Chip label={row.status} color="success" size="small" variant="outlined" />
      </TableCell>
      <TableCell>
        <TableActions
          onEdit={() => openEdit(row)}
          onView={() => openDetail(row)}
          onDelete={() => openDelete(row)}
        />
      </TableCell>
    </TableRow>
  ))}
</TableData>
```

- Se pasan **todas** las filas: la tabla pagina sola (5, 10 o 25 filas por
  pagina).
- Si no hay filas, la tabla muestra `emptyMessage` ("No hay registros").
- `TableActions` muestra solo los botones cuya funcion se pasa.
- En celular la tabla se desplaza de lado.

### ModalStandard

```jsx
import { Button } from '@mui/material'
import ModalStandard from '../components/shared/ModalStandard'

<ModalStandard isOpen={isOpen} onClose={() => setIsOpen(false)} title="Agregar clase">
  <FormStandard onSubmit={handleSubmit} onCancel={() => setIsOpen(false)}>...</FormStandard>
</ModalStandard>

<ModalStandard
  isOpen={Boolean(toDelete)}
  onClose={() => setToDelete(null)}
  title="Eliminar clase"
  actions={
    <>
      <Button color="inherit" onClick={() => setToDelete(null)}>Cancelar</Button>
      <Button variant="contained" color="error" onClick={handleDelete}>Eliminar</Button>
    </>
  }
>
  ¿Seguro que quieres eliminar esta clase?
</ModalStandard>
```

- Se cierra con la X, con Escape o con un clic fuera de la ventana.
- Con un `FormStandard` adentro no se pasa `actions`: los botones los pone el
  formulario.

### FormStandard, FormInput y FormSelect

```jsx
import FormInput from '../components/shared/FormInput'
import FormSelect from '../components/shared/FormSelect'
import FormStandard from '../components/shared/FormStandard'

<FormStandard
  title="Nueva clase"
  subtitle="Completa los datos del horario"
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  loading={saving}
  warning={overlap ? 'Existe un cruce de horario' : null}
  error={error}
>
  <FormSelect
    label="Materia"
    name="subject_id"
    required
    value={form.subject_id}
    onChange={handleChange}
    options={subjects.map((s) => ({ value: s.id, label: s.name }))}
    error={errors.subject_id}
  />
  <FormSelect label="Aula" name="classroom_id" value="" disabled />
  <div className="grid grid-cols-2 gap-4">
    <FormInput label="Hora de inicio" name="start" type="time" value={form.start} onChange={handleChange} />
    <FormInput label="Hora de fin" name="end" type="time" value={form.end} onChange={handleChange} color={overlap ? 'warning' : 'primary'} focused={overlap} />
  </div>
</FormStandard>
```

- Los campos van en 2 columnas (1 en celular). Para poner dos campos en una
  sola columna se envuelven en un `div` con `grid grid-cols-2 gap-4`.
- El formulario no valida solo (`noValidate`): la pagina revisa los datos en
  `handleSubmit` y le pasa el mensaje a cada campo con `error`.
- `warning` / `error` en `FormStandard` muestran la alerta amarilla o roja.
- Dentro de un `ModalStandard` no se pasa `title`: el titulo lo pone el modal.
- Fuera de un modal, se envuelve en una tarjeta:
  `<Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>...</Paper>`.

## Convenciones

- **Componentes base**: antes de armar una tabla, un modal o un formulario, se
  usan los de `components/shared/`. Si les falta algo, se extiende el
  componente base en vez de copiarlo.
- **Estilos**: Tailwind en las etiquetas HTML; props y `sx` en los componentes
  de MUI. Solo tema claro.
- **URLs**: nunca se escriben a mano en un service. Se usan las constantes de
  `services/service.js`. Cuando el backend registra un recurso nuevo en su
  `index.routes.js`, se agrega su constante ahi (`URL_TEACHERS`, ...).
- **Respuestas**: toda respuesta pasa por `handleResponse`. El service devuelve
  directamente `data`; la page nunca ve el `response`.
- **Nombres del CRUD** en cada service: `getAll`, `getOne`, `create`, `update`,
  `remove` (`delete` es palabra reservada). En la page se importan como
  namespace para que no choquen entre services:
  `import * as teacherService from '../services/teacher.service'`.
- **Archivos**: `<entidad>.service.js` (camelCase), `<Entidad>Page.jsx` y
  `<Entidad>Card.jsx` (PascalCase), un componente por archivo con
  `export default`.

## Rutas publicas y privadas

Se usa `react-router` (el mismo que `gym-fe`) y el token se guarda en
`localStorage` a traves de `utils/token.js`.

| Archivo | Que hace |
|---|---|
| `routes/PrivateRoute.jsx` | Sin token redirige a `/login`; con token muestra la pagina |
| `routes/PublicRoute.jsx` | Con token redirige a `/`; sin token muestra la pagina (login, registro) |
| `utils/token.js` | `setToken(token)`, `getToken()` y `removeToken()` |

Se usan envolviendo la pagina de cada ruta. Este es el mismo ejemplo que esta en
el comentario de `src/App.jsx`:

```jsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import PrivateRoute from './routes/PrivateRoute'
import PublicRoute from './routes/PublicRoute'

<BrowserRouter>
  <Routes>
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

    <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
    <Route path="/teachers" element={<PrivateRoute><TeacherPage /></PrivateRoute>} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
```

> **Pendiente:** todavia no se conectan en `App.jsx` porque el backend no tiene
> `POST /api/auth/login` y no existe `LoginPage`. Cuando el backend lo tenga:
>
> 1. Crear `pages/LoginPage.jsx`: llama al login y guarda el token con
>    `setToken(token)`.
> 2. Reemplazar el contenido de `App.jsx` por las rutas del ejemplo.
> 3. Cerrar sesion: `removeToken()` y navegar a `/login`.

Reglas:

- **Publicas** (`<PublicRoute>`): solo `/login` y `/register`.
- **Privadas** (`<PrivateRoute>`): todo lo demas.
- **Paths** en ingles y en plural, igual que el recurso del backend:
  `/teachers`, `/classrooms`, `/class-sessions`.
- El token solo se toca a traves de `utils/token.js`, nunca con
  `localStorage` directo.
- A diferencia de `gym-fe`, no hay roles (`allowedRoles`): los usuarios del
  backend todavia no tienen rol.

## Agregar una entidad nueva

Las proximas entidades salen de las tablas del backend: `teachers`,
`classrooms`, `courses`, `subjects` y `class_sessions`. Para cada una, una vez
que el backend tenga sus rutas:

1. `src/services/service.js` — agrega la constante de la URL.
2. `src/services/<entidad>.service.js` — una funcion por endpoint.
3. `src/pages/<Entidad>Page.jsx` — llama al service y usa `TableData`,
   `ModalStandard` y `FormStandard`.
4. Cuando las rutas esten conectadas: agrega su `<Route>` envuelta en
   `<PrivateRoute>` (ver [Rutas publicas y privadas](#rutas-publicas-y-privadas)).

Ejemplo, si el backend expone `/api/teachers`:

```js
/* src/services/service.js */
export const URL_TEACHERS = `${API_URL}/teachers`
```

```js
/* src/services/teacher.service.js */
import { HEADERS, URL_TEACHERS, handleResponse } from './service'

export const getAll = async () => {
  const response = await fetch(URL_TEACHERS, { headers: HEADERS })
  return handleResponse(response)
}

export const getOne = async (id) => {
  const response = await fetch(`${URL_TEACHERS}/${id}`, { headers: HEADERS })
  return handleResponse(response)
}

export const create = async (teacher) => {
  const response = await fetch(URL_TEACHERS, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(teacher),
  })
  return handleResponse(response)
}

export const update = async (id, teacher) => {
  const response = await fetch(`${URL_TEACHERS}/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(teacher),
  })
  return handleResponse(response)
}

export const remove = async (id) => {
  const response = await fetch(`${URL_TEACHERS}/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  })
  return handleResponse(response)
}
```
