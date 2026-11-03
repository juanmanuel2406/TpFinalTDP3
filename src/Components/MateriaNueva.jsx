import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearMateria, getCarreras } from '../api'
import Boton from './Boton'
import Campo from './Campo'
import Mensaje from './Mensaje'

function MateriaNueva({ onCreada }) {
  const navigate = useNavigate()
  const [carreras, setCarreras] = useState([])
  const [formulario, setFormulario] = useState({ nombre: '', carrera: '' })
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    let activo = true

    const obtenerCarreras = async () => {
      try {
        setError(null)
        const carreras = await getCarreras()
        if (!activo) return
        setCarreras(carreras)
      } catch (err) {
        if (activo) setError(err.response?.data?.message || err.message)
      }
    }

    obtenerCarreras()
    return () => {
      activo = false
    }
  }, [])

  const cambiarCampo = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const guardar = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await crearMateria({
        nombre: formulario.nombre,
        id_carrera: Number(formulario.carrera),
      })
      if (onCreada) {
        onCreada()
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-tinta shadow-[6px_6px_0_var(--color-violeta)] overflow-hidden">
      <div className="franja h-2" aria-hidden="true" />
      <form onSubmit={guardar} className="p-6 sm:p-8 flex flex-col gap-5">
        <h2 className="text-2xl font-extrabold tracking-tight">Nueva materia</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Campo
            label="Nombre de la materia"
            name="nombre"
            value={formulario.nombre}
            onChange={cambiarCampo}
            placeholder="Ej: Programación I"
            minLength={2}
            maxLength={100}
            required
          />
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-sm font-bold">Carrera</span>
            <select
              name="carrera"
              value={formulario.carrera}
              onChange={cambiarCampo}
              required
              className="w-full px-4 py-2.5 rounded-xl border-2 border-tinta/15 bg-white font-semibold focus:outline-none focus:border-violeta focus:ring-4 focus:ring-violeta/20"
            >
              <option value="">Elegí una carrera</option>
              {carreras.map((carrera) => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Mensaje tipo="error" texto={error} />

        <div>
          <Boton label={cargando ? 'Guardando...' : 'Guardar materia'} type="submit" disabled={cargando} />
        </div>
      </form>
    </div>
  )
}

export default MateriaNueva
