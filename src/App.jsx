import HomePage from './pages/HomePage'

/**
 * Single page for now. Once the backend has POST /api/auth/login (and there is
 * a LoginPage), replace this with the routes, using the guards in src/routes:
 *
 *   <BrowserRouter>
 *     <Routes>
 *       <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
 *       <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
 *
 *       <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
 *       <Route path="/teachers" element={<PrivateRoute><TeacherPage /></PrivateRoute>} />
 *
 *       <Route path="*" element={<Navigate to="/" replace />} />
 *     </Routes>
 *   </BrowserRouter>
 *
 * - PublicRoute: only without a session (login, register). With one, goes to "/".
 * - PrivateRoute: requires a token. Without one, goes to "/login".
 */
function App() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Horario de clases</h1>
      <HomePage />
    </main>
  )
}

export default App
