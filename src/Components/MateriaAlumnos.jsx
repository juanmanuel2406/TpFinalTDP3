import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { darDeBajaInscripcion, getAlumnosDeMateria, getCarreras, getMateria } from '../api'
import useAuthStore from '../store/useAuthStore'
import { colorCarrera } from '../colores'
import Boton from './Boton'
import Mensaje from './Mensaje'

function MateriaAlumnos() {
  const { id } = useParams()
  const { usuario } = useAuthStore()
  const esAdmin = usuario?.id_rol === 1
  const [materia, setMateria] = useState(null)
  const [alumnos, setAlumnos] = useState([])
  const [carreras, setCarreras] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [recargar, setRecargar] = useState(0)

  useEffect(() => {
    let activo = true

    const obtenerInscriptos = async () => {
      try {
        setCargando(true)
        setError(null)
        const materia = await getMateria(id)
        const alumnos = await getAlumnosDeMateria(id)
        const carreras = await getCarreras()
        if (!activo) return
        setMateria(materia)
        setAlumnos(alumnos)
        setCarreras(carreras)
      } catch (err) {
        if (activo) setError(err.response?.data?.message || err.message)
      } finally {
        if (activo) setCargando(false)
      }
    }

    obtenerInscriptos()
    return () => {
      activo = false
    }
  }, [id, recargar])

  const alumnosFiltrados = alumnos.filter((alumno) => {
    const datos = `${alumno.nombre} ${alumno.mail}`.toLowerCase()
    const textoBuscado = busqueda.toLowerCase()
    return datos.includes(textoBuscado)
  })

  const indiceCarrera = carreras.findIndex((carrera) => carrera.id === materia?.idCarrera)
  const color = colorCarrera(indiceCarrera)

  const darDeBaja = async (alumno) => {
    if (!window.confirm(`¿Dar de baja a ${alumno.nombre} de "${materia.nombre}"?`)) return
    setError(null)
    setExito(null)
    try {
      await darDeBajaInscripcion({ id_alumno: alumno.id, id_materia: Number(id) })
      setExito(`${alumno.nombre} ya no está inscripto en ${materia.nombre}.`)
      setRecargar(recargar + 1)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <Link to="/" className="font-semibold text-violeta underline underline-offset-4 hover:text-chicle">
        Volver a materias
      </Link>

      <header className="mt-4 mb-8">
        {materia && (
          <span
            className={`${color.fondo} ${color.texto} inline-block mb-3 px-3 py-1 rounded-full border-2 border-tinta text-sm font-bold`}
          >
            {materia.carrera}
          </span>
        )}
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none">
          {materia ? materia.nombre : 'Materia'}
        </h1>
        <p className="mt-3 text-lg text-tinta/70">
          {cargando
            ? 'Buscando inscriptos...'
            : `${alumnos.length} ${alumnos.length === 1 ? 'alumno inscripto' : 'alumnos inscriptos'}`}
        </p>
      </header>

      <div className="flex flex-col gap-3 mb-6">
        <Mensaje tipo="error" texto={error} />
        <Mensaje tipo="exito" texto={exito} />
      </div>

      {alumnos.length > 0 && (
        <label className="block mb-4">
          <span className="sr-only">Buscar inscripto</span>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o mail..."
            className="w-full px-5 py-2.5 rounded-full border-2 border-tinta bg-white placeholder:text-tinta/40 focus:outline-none focus:ring-4 focus:ring-violeta/25"
          />
        </label>
      )}

      {cargando ? (
        <p className="text-lg font-semibold text-tinta/70 text-center py-8">Cargando inscriptos...</p>
      ) : alumnosFiltrados.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-tinta/30 bg-white px-8 py-12 text-center">
          <p className="text-2xl font-extrabold">
            {busqueda ? `Nada coincide con "${busqueda}"` : 'Nadie se inscribió todavía'}
          </p>
          <p className="mt-2 text-tinta/70">
            {busqueda ? 'Probá con otra palabra.' : 'Los alumnos se inscriben desde el listado de materias.'}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {alumnosFiltrados.map((alumno) => (
            <li
              key={alumno.id}
              className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border-2 border-tinta px-4 py-3"
            >
              <div className="flex flex-col">
                <span className="text-lg font-extrabold">{alumno.nombre}</span>
                <span className="text-sm text-tinta/70">{alumno.mail}</span>
                <Link
                  to={`/alumno/${alumno.id}`}
                  className="text-sm font-semibold text-violeta underline underline-offset-2 hover:text-chicle"
                >
                  Ver cursada
                </Link>
              </div>
              {esAdmin && (
                <Boton label="Dar de baja" variante="peligro" chico onClick={() => darDeBaja(alumno)} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MateriaAlumnos
