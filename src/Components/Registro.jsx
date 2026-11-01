import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import Boton from './Boton'
import Campo from './Campo'
import Mensaje from './Mensaje'
import PanelAcceso from './PanelAcceso'

// Roles que se pueden elegir al registrarse (los ids son los de la API)
const roles = [
  { id: 3, nombre: 'Alumno' },
  { id: 2, nombre: 'Coordinador' },
  { id: 1, nombre: 'Administrador' },
]

const formVacio = { nombre: '', mail: '', usuario: '', pass: '', rol: '3' }

function Registro() {
  const navigate = useNavigate()
  const { registrar } = useAuthStore()
  const [form, setForm] = useState(formVacio)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setExito(null)
    setCargando(true)
    try {
      const resultado = await registrar({
        nombre: form.nombre,
        mail: form.mail,
        usuario: form.usuario,
        pass: form.pass,
        id_rol: Number(form.rol),
      })
      setExito(`${resultado.message}. Ya podés ingresar con tu usuario.`)
      setForm(formVacio)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <PanelAcceso titulo="Crear cuenta" bajada="Registrate como alumno para inscribirte en materias, o como coordinador o administrador para gestionar la cursada.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Campo label="Nombre y apellido" name="nombre" value={form.nombre} onChange={handleChange} required />
        <Campo label="Mail" name="mail" type="email" value={form.mail} onChange={handleChange} autoComplete="email" required />
        <Campo
          label="Usuario"
          name="usuario"
          value={form.usuario}
          onChange={handleChange}
          autoComplete="username"
          minLength={3}
          required
        />
        <Campo
          label="Contraseña (mín. 4)"
          name="pass"
          type="password"
          value={form.pass}
          onChange={handleChange}
          autoComplete="new-password"
          minLength={4}
          required
        />
        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-sm font-bold mb-1.5">Rol</legend>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((rol) => (
              <label
                key={rol.id}
                className="flex items-center justify-center gap-2 font-semibold cursor-pointer rounded-xl border-2 border-tinta/15 px-2 py-2.5 text-sm has-[:checked]:border-violeta has-[:checked]:bg-violeta/5"
              >
                <input
                  type="radio"
                  name="rol"
                  value={rol.id}
                  checked={form.rol === String(rol.id)}
                  onChange={handleChange}
                  className="accent-violeta"
                />
                {rol.nombre}
              </label>
            ))}
          </div>
        </fieldset>

        <Mensaje tipo="error" texto={error} />
        <Mensaje tipo="exito" texto={exito} />

        <Boton label={cargando ? 'Creando cuenta...' : 'Crear cuenta'} type="submit" disabled={cargando} />
      </form>

      {exito && (
        <div className="mt-4">
          <Boton label="Ir a ingresar" variante="secundario" onClick={() => navigate('/login')} />
        </div>
      )}
    </PanelAcceso>
  )
}

export default Registro
