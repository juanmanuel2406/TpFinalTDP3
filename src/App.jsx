import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Inicio from './Components/Inicio'
import Login from './Components/Login'
import Registro from './Components/Registro'
import Alumnos from './Components/Alumnos'
import AlumnoMaterias from './Components/AlumnoMaterias'
import MateriaAlumnos from './Components/MateriaAlumnos'
import { useAuthStore } from './store/useAuthStore'

// Sin sesión no se puede ver nada (la API pide token en todas las rutas)
function RequireSesion({ children }) {
  const { usuario } = useAuthStore()
  if (!usuario) return <Navigate to="/login" replace />
  return children
}

// Solo Administrador o Coordinador
function RequireGestion({ children }) {
  const { esAdmin, esCoordinador } = useAuthStore()
  if (!esAdmin && !esCoordinador) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <>
      <Navbar />
      <main className="px-4 sm:px-6 py-10 flex justify-center">
        <Routes>
          <Route
            path="/"
            element={
              <RequireSesion>
                <Inicio />
              </RequireSesion>
            }
          />
          <Route
            path="/carrera/:id"
            element={
              <RequireSesion>
                <Inicio />
              </RequireSesion>
            }
          />
          <Route
            path="/alumno/:id"
            element={
              <RequireSesion>
                <AlumnoMaterias />
              </RequireSesion>
            }
          />
          <Route
            path="/alumnos"
            element={
              <RequireSesion>
                <RequireGestion>
                  <Alumnos />
                </RequireGestion>
              </RequireSesion>
            }
          />
          <Route
            path="/materia/:id"
            element={
              <RequireSesion>
                <RequireGestion>
                  <MateriaAlumnos />
                </RequireGestion>
              </RequireSesion>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </main>
    </>
  )
}

export default App
