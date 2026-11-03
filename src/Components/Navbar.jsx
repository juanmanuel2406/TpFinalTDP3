import { Link } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
const nombresRol = { 1: 'admin', 2: 'coordinador', 3: 'alumno' }

const estiloEnlace =
  'text-white font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sol'

function Navbar() {
  const { usuario, cerrarSesion } = useAuthStore()
  const esAdmin = usuario?.id_rol === 1
  const esCoordinador = usuario?.id_rol === 2
  const esAlumno = usuario?.id_rol === 3
  return (
    <nav className="bg-violeta">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-white">
            Sistema de Alumnos
          </Link>
          <ul className="flex items-center gap-1">
            {usuario && <li><Link to="/" className={estiloEnlace}>Materias</Link></li>}
            {(esAdmin || esCoordinador) && <li><Link to="/alumnos" className={estiloEnlace}>Alumnos</Link></li>}
            {esAlumno && <li><Link to={`/alumno/${usuario.id}`} className={estiloEnlace}>Mi cursada</Link></li>}
          </ul>
        </div>
        <ul className="flex items-center gap-1">
          {usuario && (
            <>
              <li className="flex items-center gap-2 bg-white/15 text-white font-semibold pl-1.5 pr-3 py-1 rounded-full">
                <span className="w-7 h-7 rounded-full bg-sol text-tinta font-extrabold grid place-items-center">
                  {usuario.nombre.charAt(0).toUpperCase()}
                </span>
                {usuario.nombre}
                <span className="text-xs font-bold bg-chicle text-tinta px-2 py-0.5 rounded-full">
                  {nombresRol[usuario.id_rol]}
                </span>
              </li>
              <li>
                <button onClick={cerrarSesion} className={`${estiloEnlace} cursor-pointer`}>
                  Salir
                </button>
              </li>
            </>
          )}
          {!usuario && (
            <>
              <li><Link to="/login" className={estiloEnlace}>Ingresar</Link></li>
              <li><Link to="/registro" className={estiloEnlace}>Crear cuenta</Link></li>
            </>
          )}
        </ul>
      </div>
      <div className="franja h-2" aria-hidden="true" />
    </nav>
  )
}

export default Navbar
