import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { eliminarMateria, getCarreras, getMaterias, getMateriasDeAlumno, inscribir } from '../api'
import { useAuthStore } from '../store/useAuthStore'
import { colorCarrera } from '../colores'
import MateriaNueva from './MateriaNueva'
import TarjetaMateria from './TarjetaMateria'
import Boton from './Boton'
import Mensaje from './Mensaje'

const estiloEnlaceBoton =
  'bg-white text-tinta border-2 border-tinta shadow-[0_3px_0_var(--color-tinta)] hover:bg-sol px-4 py-1.5 text-sm font-bold rounded-full transition-all duration-150 active:translate-y-[3px] active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-chicle/50'

function Inicio() {
  // useParams: en /carrera/:id toma el id de la URL (en "/" viene undefined)
  const { id } = useParams()
  const { usuario, esAdmin, esCoordinador, esAlumno } = useAuthStore()
  const [materias, setMaterias] = useState([])
  const [carreras, setCarreras] = useState([])
  const [misMaterias, setMisMaterias] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [formularioVisible, setFormularioVisible] = useState(false)
  const [recargar, setRecargar] = useState(0)

  useEffect(() => {
    let activo = true
    getCarreras()
      .then((cars) => {
        if (activo) setCarreras(cars)
      })
      .catch((err) => {
        if (activo) setError(err.message)
      })
    return () => {
      activo = false
    }
  }, [])

  // Trae las materias y, si es alumno, también las materias en las que ya está inscripto
  useEffect(() => {
    let activo = true
    Promise.all([getMaterias(), esAlumno ? getMateriasDeAlumno(usuario.id) : []])
      .then(([mats, propias]) => {
        if (!activo) return
        setMaterias(mats)
        setMisMaterias(propias)
      })
      .catch((err) => {
        if (activo) setError(err.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [recargar, esAlumno, usuario])

  useEffect(() => {
    console.log('Formulario de nueva materia:', formularioVisible ? 'visible' : 'oculto')
  }, [formularioVisible])

  // find: busca la carrera del id de la URL para mostrar su nombre
  const carreraActual = carreras.find((carrera) => String(carrera.id) === id)

  // filter: primero por la carrera de la URL y después por lo que se escribió en el buscador
  const materiasFiltradas = materias
    .filter((materia) => !id || String(materia.idCarrera) === id)
    .filter((materia) => materia.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  // map: ids de las materias del alumno, para marcar las tarjetas con "Inscripto"
  const idsInscriptas = misMaterias.map((materia) => materia.id)

  // findIndex: la posición de la carrera define su color
  const indiceColor = (idCarrera) => carreras.findIndex((carrera) => carrera.id === idCarrera)

  const handleInscribir = async (materia) => {
    setError(null)
    setExito(null)
    try {
      await inscribir({ id_alumno: usuario.id, id_materia: materia.id })
      setExito(`Te inscribiste en ${materia.nombre}.`)
      setRecargar(recargar + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEliminar = async (materia) => {
    if (!window.confirm(`¿Dar de baja la materia "${materia.nombre}"?`)) return
    setError(null)
    setExito(null)
    try {
      await eliminarMateria(materia.id)
      setExito('Materia dada de baja.')
      setRecargar(recargar + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  const estiloChip = (activo, color) =>
    `px-4 py-1.5 rounded-full border-2 border-tinta font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violeta/30 ${
      activo ? `${color.fondo} ${color.texto} shadow-[3px_3px_0_var(--color-tinta)]` : 'bg-white hover:bg-tinta/5'
    }`

  return (
    <div className="w-full max-w-6xl">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none">
            {carreraActual ? carreraActual.nombre : 'Materias'}
          </h1>
          <p className="mt-3 text-lg text-tinta/70">
            {cargando
              ? 'Buscando materias...'
              : `${materiasFiltradas.length} ${materiasFiltradas.length === 1 ? 'materia' : 'materias'}${
                  carreraActual ? ' en esta carrera' : ' en todas las carreras'
                }`}
          </p>
        </div>
        {esAdmin && (
          <Boton
            label={formularioVisible ? 'Cerrar formulario' : '+ Nueva materia'}
            variante={formularioVisible ? 'secundario' : 'principal'}
            onClick={() => setFormularioVisible(!formularioVisible)}
          />
        )}
      </header>

      {formularioVisible && (
        <div className="mb-10">
          <MateriaNueva
            onCreada={() => {
              setFormularioVisible(false)
              setRecargar(recargar + 1)
            }}
          />
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
        <nav aria-label="Carreras" className="flex flex-wrap gap-2 flex-1">
          <Link to="/" className={estiloChip(!id, colorCarrera(-1))}>
            Todas
          </Link>
          {carreras.map((carrera, indice) => (
            <Link
              key={carrera.id}
              to={`/carrera/${carrera.id}`}
              className={estiloChip(String(carrera.id) === id, colorCarrera(indice))}
            >
              {carrera.nombre}
            </Link>
          ))}
        </nav>
        <label className="relative lg:w-72">
          <span className="sr-only">Buscar materia</span>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar materia..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full border-2 border-tinta bg-white placeholder:text-tinta/40 focus:outline-none focus:ring-4 focus:ring-violeta/25"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 fill-none stroke-tinta stroke-[2.5]"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" strokeLinecap="round" />
          </svg>
        </label>
      </div>

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
      ) : materiasFiltradas.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-tinta/30 bg-white px-8 py-14 text-center">
          <p className="text-2xl font-extrabold">
            {busqueda ? `Nada coincide con "${busqueda}"` : 'Todavía no hay materias acá'}
          </p>
          <p className="mt-2 text-tinta/70">
            {busqueda
              ? 'Probá con otra palabra o borrá la búsqueda.'
              : esAdmin
                ? 'Cargá la primera con el botón "+ Nueva materia".'
                : 'Cuando el administrador cargue materias, van a aparecer acá.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materiasFiltradas.map((materia, indice) => {
            const inscripto = idsInscriptas.includes(materia.id)
            return (
              <TarjetaMateria
                key={materia.id}
                materia={materia}
                indiceColor={indiceColor(materia.idCarrera)}
                demora={Math.min(indice, 8) * 60}
                inscripto={inscripto}
              >
                {esAlumno && !inscripto && (
                  <Boton label="Inscribirme" chico onClick={() => handleInscribir(materia)} />
                )}
                {(esAdmin || esCoordinador) && (
                  <Link to={`/materia/${materia.id}`} className={estiloEnlaceBoton}>
                    Ver alumnos
                  </Link>
                )}
                {esAdmin && (
                  <Boton label="Dar de baja" variante="peligro" chico onClick={() => handleEliminar(materia)} />
                )}
              </TarjetaMateria>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Inicio
