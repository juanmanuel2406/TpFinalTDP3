import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

// Todos los enlaces de la barra. Cada uno dice para quién es:
// 'sesion' (cualquiera logueado), 'gestion' (admin o coordinador), 'alumno' o 'invitado' (sin sesión)
const enlaces = [
  { to: '/', texto: 'Materias', lado: 'izquierda', para: 'sesion' },
  { to: '/alumnos', texto: 'Alumnos', lado: 'izquierda', para: 'gestion' },
  { to: '/alumno', texto: 'Mi cursada', lado: 'izquierda', para: 'alumno' },
  { to: '/login', texto: 'Ingresar', lado: 'derecha', para: 'invitado' },
  { to: '/registro', texto: 'Crear cuenta', lado: 'derecha', para: 'invitado' },
]

const nombresRol = { 1: 'admin', 2: 'coordinador', 3: 'alumno' }

const estiloEnlace =
  'text-white font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sol'

function Navbar() {
  const { usuario, esAdmin, esCoordinador, esAlumno, cerrarSesion } = useAuthStore()

  // filter: según el token guardado, se queda solo con los enlaces que corresponden
  const enlacesVisibles = enlaces
    .filter((enlace) => {
      if (enlace.para === 'sesion') return Boolean(usuario)
      if (enlace.para === 'gestion') return esAdmin || esCoordinador
      if (enlace.para === 'alumno') return esAlumno
      if (enlace.para === 'invitado') return !usuario
      return true
    })
    // map: "Mi cursada" lleva al id del alumno logueado (/alumno/:id)
    .map((enlace) => (enlace.para === 'alumno' ? { ...enlace, to: `/alumno/${usuario.id}` } : enlace))

  const enlacesIzquierda = enlacesVisibles.filter((enlace) => enlace.lado === 'izquierda')
  const enlacesDerecha = enlacesVisibles.filter((enlace) => enlace.lado === 'derecha')

  return (
    <nav className="bg-violeta">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-white">
            Bedelía
          </Link>
          <ul className="flex items-center gap-1">
            {enlacesIzquierda.map((enlace) => (
              <li key={enlace.texto}>
                <Link to={enlace.to} className={estiloEnlace}>
                  {enlace.texto}
                </Link>
              </li>
            ))}
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
          {enlacesDerecha.map((enlace) => (
            <li key={enlace.texto}>
              <Link to={enlace.to} className={estiloEnlace}>
                {enlace.texto}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="franja h-2" aria-hidden="true" />
    </nav>
  )
}

export default Navbar
