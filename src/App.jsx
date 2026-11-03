import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Inicio from './Components/Inicio'
import Login from './Components/Login'
import Registro from './Components/Registro'
import Alumnos from './Components/Alumnos'
import AlumnoMaterias from './Components/AlumnoMaterias'
import MateriaAlumnos from './Components/MateriaAlumnos'
import useAuthStore from './store/useAuthStore'

function App() {
  const { usuario } = useAuthStore()
  const puedeGestionar = usuario?.id_rol === 1 || usuario?.id_rol === 2

  return (
    <>
      <Navbar />
      <main className="px-4 sm:px-6 py-10 flex justify-center">
        <Routes>
          <Route path="/" element={usuario ? <Inicio /> : <Navigate to="/login" replace />} />
          <Route path="/carrera/:id" element={usuario ? <Inicio /> : <Navigate to="/login" replace />} />
          <Route path="/alumno/:id" element={usuario ? <AlumnoMaterias /> : <Navigate to="/login" replace />} />
          <Route path="/alumnos" element={puedeGestionar ? <Alumnos /> : <Navigate to="/" replace />} />
          <Route path="/materia/:id" element={puedeGestionar ? <MateriaAlumnos /> : <Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </main>
    </>
  )
}

export default App
