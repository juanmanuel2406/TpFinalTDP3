import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { actualizarAlumno, crearAlumno, eliminarAlumno, getAlumnos } from '../api'
import useAuthStore from '../store/useAuthStore'
import { colorCarrera } from '../colores'
import Boton from './Boton'
import Campo from './Campo'
import Mensaje from './Mensaje'

const formularioVacio = { nombre: '', mail: '', usuario: '', pass: '' }

function Alumnos() {
  const { usuario } = useAuthStore()
  const esAdmin = usuario?.id_rol === 1
  const [alumnos, setAlumnos] = useState([])
  const [formulario, setFormulario] = useState(formularioVacio)
  const [busqueda, setBusqueda] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)
  const [cargando, setCargando] = useState(true)

  const [recargar, setRecargar] = useState(0)

  useEffect(() => {
    let activo = true

    const obtenerAlumnos = async () => {
      try {
        setCargando(true)
        setError(null)
        const alumnos = await getAlumnos()
        if (!activo) return
        setAlumnos(alumnos)
      } catch (err) {
        if (activo) setError(err.response?.data?.message || err.message)
      } finally {
        if (activo) setCargando(false)
      }
    }

    obtenerAlumnos()
    return () => {
      activo = false
    }
  }, [recargar])

  const alumnosFiltrados = alumnos.filter((alumno) =>
    [alumno.nombre, alumno.usuario, alumno.mail]
      .join(' ')
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  const cambiarCampo = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const guardar = async (e) => {
    e.preventDefault()
    setError(null)
    setExito(null)
    try {
      if (editandoId !== null) {
        await actualizarAlumno(editandoId, { nombre: formulario.nombre, mail: formulario.mail })
        setExito('Alumno actualizado.')
        setEditandoId(null)
      } else {
        await crearAlumno(formulario)
        setExito(`Alumno ${formulario.nombre} creado. Ya puede ingresar con el usuario ${formulario.usuario}.`)
      }
      setFormulario(formularioVacio)
      setRecargar(recargar + 1)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  const editarAlumno = (alumno) => {
    setError(null)
    setExito(null)
    setEditandoId(alumno.id)
    setFormulario({ nombre: alumno.nombre, mail: alumno.mail, usuario: alumno.usuario, pass: '' })
  }

  const darDeBaja = async (alumno) => {
    if (!window.confirm(`¿Dar de baja al alumno "${alumno.nombre}"?`)) return
    setError(null)
    setExito(null)
    try {
      await eliminarAlumno(alumno.id)
      setExito('Alumno dado de baja.')
      setRecargar(recargar + 1)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none">Alumnos</h1>
      <p className="mt-3 mb-8 text-lg text-tinta/70">
        {esAdmin
          ? 'Alta, edición y baja de los alumnos del instituto.'
          : 'Listado de alumnos activos. Entrá a cada uno para ver su cursada.'}
      </p>

      {esAdmin && (
        <form
          onSubmit={guardar}
          className="bg-white rounded-3xl border-2 border-tinta shadow-[6px_6px_0_var(--color-violeta)] p-6 mb-6 flex flex-col gap-4"
        >
          <h2 className="text-xl font-extrabold">
            {editandoId !== null ? `Editando a ${formulario.nombre}` : 'Nuevo alumno'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Campo label="Nombre y apellido" name="nombre" value={formulario.nombre} onChange={cambiarCampo} required />
            <Campo label="Mail" name="mail" type="email" value={formulario.mail} onChange={cambiarCampo} required />
            {editandoId === null && (
              <>
                <Campo label="Usuario" name="usuario" value={formulario.usuario} onChange={cambiarCampo} minLength={3} required />
                <Campo
                  label="Contraseña (mín. 4)"
                  name="pass"
                  type="password"
                  value={formulario.pass}
                  onChange={cambiarCampo}
                  minLength={4}
                  autoComplete="new-password"
                  required
                />
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Boton label={editandoId !== null ? 'Guardar cambios' : 'Crear alumno'} type="submit" />
            {editandoId !== null && (
              <Boton
                label="Cancelar"
                variante="secundario"
                onClick={() => {
                  setEditandoId(null)
                  setFormulario(formularioVacio)
                }}
              />
            )}
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3 mb-6">
        <Mensaje tipo="error" texto={error} />
        <Mensaje tipo="exito" texto={exito} />
      </div>

      <label className="block mb-4">
        <span className="sr-only">Buscar alumno</span>
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, usuario o mail..."
          className="w-full px-5 py-2.5 rounded-full border-2 border-tinta bg-white placeholder:text-tinta/40 focus:outline-none focus:ring-4 focus:ring-violeta/25"
        />
      </label>

      {cargando ? (
        <p className="text-lg font-semibold text-tinta/70 text-center py-8">Cargando alumnos...</p>
      ) : alumnosFiltrados.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-tinta/30 bg-white px-8 py-12 text-center">
          <p className="text-2xl font-extrabold">
            {busqueda ? `Nada coincide con "${busqueda}"` : 'Todavía no hay alumnos'}
          </p>
          <p className="mt-2 text-tinta/70">
            {busqueda
              ? 'Probá con otra palabra.'
              : esAdmin
                ? 'Cargá el primero con el formulario de arriba.'
                : 'Cuando el administrador cargue alumnos, van a aparecer acá.'}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {alumnosFiltrados.map((alumno) => {
            const color = colorCarrera(alumnos.findIndex((a) => a.id === alumno.id))
            return (
              <li
                key={alumno.id}
                className={`flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border-2 border-tinta px-4 py-3 ${
                  editandoId === alumno.id ? 'shadow-[4px_4px_0_var(--color-violeta)]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`${color.fondo} ${color.texto} w-11 h-11 shrink-0 rounded-full border-2 border-tinta grid place-items-center text-lg font-extrabold`}
                    aria-hidden="true"
                  >
                    {alumno.nombre.charAt(0).toUpperCase()}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-lg font-extrabold">{alumno.nombre}</span>
                    <span className="text-sm text-tinta/70">
                      {alumno.usuario} · {alumno.mail}
                    </span>
                    <Link
                      to={`/alumno/${alumno.id}`}
                      className="text-sm font-semibold text-violeta underline underline-offset-2 hover:text-chicle"
                    >
                      Ver cursada
                    </Link>
                  </div>
                </div>
                {esAdmin && (
                  <div className="flex gap-2">
                    <Boton label="Editar" variante="secundario" chico onClick={() => editarAlumno(alumno)} />
                    <Boton label="Dar de baja" variante="peligro" chico onClick={() => darDeBaja(alumno)} />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Alumnos
