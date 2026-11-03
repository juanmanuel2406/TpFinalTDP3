import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  darDeBajaInscripcion,
  getAlumno,
  getCarreras,
  getMaterias,
  getMateriasDeAlumno,
  inscribir,
} from '../api'
import useAuthStore from '../store/useAuthStore'
import TarjetaMateria from './TarjetaMateria'
import Boton from './Boton'
import Mensaje from './Mensaje'

function AlumnoMaterias() {
  const { id } = useParams()
  const { usuario } = useAuthStore()
  const esAdmin = usuario?.id_rol === 1
  const esCoordinador = usuario?.id_rol === 2
  const [alumno, setAlumno] = useState(null)
  const [materias, setMaterias] = useState([])
  const [todasLasMaterias, setTodasLasMaterias] = useState([])
  const [carreras, setCarreras] = useState([])
  const [materiaElegida, setMateriaElegida] = useState('')
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [recargar, setRecargar] = useState(0)

  const esPropio = String(usuario.id) === id
  useEffect(() => {
    let activo = true

    const obtenerCursada = async () => {
      try {
        setCargando(true)
        setError(null)
        const alumno = await getAlumno(id)
        const materias = await getMateriasDeAlumno(id)
        const carreras = await getCarreras()
        let todasLasMaterias = []
        if (esAdmin) {
          todasLasMaterias = await getMaterias()
        }
        if (!activo) return
        setAlumno(alumno)
        setMaterias(materias)
        setCarreras(carreras)
        setTodasLasMaterias(todasLasMaterias)
      } catch (err) {
        if (activo) setError(err.response?.data?.message || err.message)
      } finally {
        if (activo) setCargando(false)
      }
    }

    obtenerCursada()
    return () => {
      activo = false
    }
  }, [id, recargar, esAdmin])

  const materiasDisponibles = todasLasMaterias.filter(
    (materia) => !materias.some((cursada) => cursada.id === materia.id)
  )
  const indiceColor = (idCarrera) => carreras.findIndex((carrera) => carrera.id === idCarrera)

  const inscribirMateria = async (e) => {
    e.preventDefault()
    setError(null)
    setExito(null)
    try {
      await inscribir({ id_alumno: Number(id), id_materia: Number(materiaElegida) })
      setExito('Inscripción registrada.')
      setMateriaElegida('')
      setRecargar(recargar + 1)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  const darDeBaja = async (materia) => {
    const pregunta = esPropio
      ? `¿Darte de baja de "${materia.nombre}"?`
      : `¿Dar de baja a ${alumno.nombre} de "${materia.nombre}"?`
    if (!window.confirm(pregunta)) return
    setError(null)
    setExito(null)
    try {
      await darDeBajaInscripcion({ id_alumno: Number(id), id_materia: materia.id })
      setExito(`Baja de ${materia.nombre} registrada.`)
      setRecargar(recargar + 1)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  const puedeDarDeBaja = esAdmin || esPropio

  return (
    <div className="w-full max-w-6xl">
      {(esAdmin || esCoordinador) && (
        <Link to="/alumnos" className="font-semibold text-violeta underline underline-offset-4 hover:text-chicle">
          Volver a alumnos
        </Link>
      )}

      <header className="mt-4 mb-8">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none">
          {esPropio ? 'Mi cursada' : alumno ? alumno.nombre : 'Cursada'}
        </h1>
        <p className="mt-3 text-lg text-tinta/70">
          {cargando
            ? 'Buscando materias...'
            : `${materias.length} ${materias.length === 1 ? 'materia' : 'materias'}${
                materias.length > 0 ? ` de ${materias[0].carrera}` : ''
              }${alumno && !esPropio ? ` · ${alumno.mail}` : ''}`}
        </p>
      </header>

      {esAdmin && !cargando && alumno && (
        <form
          onSubmit={inscribirMateria}
          className="bg-white rounded-3xl border-2 border-tinta shadow-[6px_6px_0_var(--color-violeta)] p-6 mb-8 flex flex-col sm:flex-row sm:items-end gap-3"
        >
          <label className="flex flex-col gap-1.5 flex-1">
            <span className="text-sm font-bold">Inscribir en una materia</span>
            <select
              value={materiaElegida}
              onChange={(e) => setMateriaElegida(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border-2 border-tinta/15 bg-white font-semibold focus:outline-none focus:border-violeta focus:ring-4 focus:ring-violeta/20"
            >
              <option value="">Elegí una materia</option>
              {materiasDisponibles.map((materia) => (
                <option key={materia.id} value={materia.id}>
                  {materia.nombre} ({materia.carrera})
                </option>
              ))}
            </select>
          </label>
          <Boton label="Inscribir" type="submit" />
        </form>
      )}

      {(error || exito) && (
        <div className="mb-6 flex flex-col gap-3">
          <Mensaje tipo="error" texto={error} />
          <Mensaje tipo="exito" texto={exito} />
        </div>
      )}

      {cargando ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 rounded-2xl border-2 border-dashed border-tinta/20 bg-white/60" />
          ))}
        </div>
      ) : materias.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-tinta/30 bg-white px-8 py-14 text-center">
          <p className="text-2xl font-extrabold">
            {esPropio ? 'Todavía no te inscribiste en ninguna materia' : 'No está inscripto en ninguna materia'}
          </p>
          <p className="mt-2 text-tinta/70">
            {esPropio ? (
              <>
                Elegí tus materias en{' '}
                <Link to="/" className="font-bold text-violeta underline underline-offset-4 hover:text-chicle">
                  el listado de materias
                </Link>
                .
              </>
            ) : esAdmin ? (
              'Inscribilo con el formulario de arriba.'
            ) : (
              'Cuando se inscriba, sus materias van a aparecer acá.'
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materias.map((materia, indice) => (
            <TarjetaMateria
              key={materia.id}
              materia={materia}
              indiceColor={indiceColor(materia.idCarrera)}
              demora={Math.min(indice, 8) * 60}
            >
              {puedeDarDeBaja && (
                <Boton label="Dar de baja" variante="peligro" chico onClick={() => darDeBaja(materia)} />
              )}
            </TarjetaMateria>
          ))}
        </div>
      )}
    </div>
  )
}

export default AlumnoMaterias
