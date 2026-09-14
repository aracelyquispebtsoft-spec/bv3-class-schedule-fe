# Scaffolding frontend (React + Vite)

Frontend base que consume [bc-scaffolding-be](https://github.com/btsoftOrg/bc-scaffolding-be).

## Estructura

```
src/
├── main.jsx                  # Entrypoint: monta <App />
├── App.jsx                   # Layout raiz
├── index.css                 # Estilos globales
├── config/config.js          # Lectura de .env
├── services/user.service.js  # Llamadas al API: getMe()
├── pages/HomePage.jsx        # Pagina: pide los datos y los muestra
└── components/UserCard.jsx   # Componente que muestra un usuario
```

## Flujo

```
Page → Service → Backend → Page → Component
```

## Arranque

### 1. Levanta el backend

Sigue el README de `bc-scaffolding-be` y verifica que responda
<http://127.0.0.1:3000/api/user/me>.

### 2. Instala las dependencias

```bash
npm install
```

### 3. Crea tu archivo `.env`

```bash
cp .env.example .env
```

`VITE_API_URL` es solo la URL del backend, sin `/api`:

```
VITE_API_URL=http://127.0.0.1:3000
```

Si el backend usa otro host o puerto, cambia `VITE_API_URL`.

### 4. Arranca el proyecto

```bash
npm run dev
```

Abre <http://localhost:5173>. Vas a ver el usuario del seeder
(`User Admin` / `user@admin.com`).

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
    "email": "user@admin.com"
  }
}
```

## Agregar una entidad nueva

1. `src/services/<entidad>.service.js`
2. `src/components/<Componente>.jsx`
3. `src/pages/<Pagina>.jsx`
