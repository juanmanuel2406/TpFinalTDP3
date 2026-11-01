import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearMateria, getCarreras } from '../api'
import Boton from './Boton'
import Campo from './Campo'
import Mensaje from './Mensaje'

function MateriaNueva({ onCreada }) {
  const navigate = useNavigate()
  const [carreras, setCarreras] = useState([])
  const [form, setForm] = useState({ nombre: '', carrera: '' })
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    console.log('MateriaNueva: Componente Montado')

    return () => {
      console.log('MateriaNueva: Componente Desmontado')
    }
  }, [])

  useEffect(() => {
    console.log('MateriaNueva: cambios en el formulario', form)
  }, [form])

  useEffect(() => {
    getCarreras()
      .then(setCarreras)
      .catch((err) => setError(err.message))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await crearMateria({
        nombre: form.nombre,
        id_carrera: Number(form.carrera),
      })
      if (onCreada) {
        onCreada()
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-tinta shadow-[6px_6px_0_var(--color-violeta)] overflow-hidden">
      <div className="franja h-2" aria-hidden="true" />
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex flex-col gap-5">
        <h2 className="text-2xl font-extrabold tracking-tight">Nueva materia</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Campo
            label="Nombre de la materia"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Programación I"
            minLength={2}
            maxLength={100}
            required
          />
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-sm font-bold">Carrera</span>
            <select
              name="carrera"
              value={form.carrera}
              onChange={handleChange}
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
