import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registrarUsuario } from '../api'
import Boton from './Boton'
import Campo from './Campo'
import Mensaje from './Mensaje'
import PanelAcceso from './PanelAcceso'
const roles = [
  { id: 3, nombre: 'Alumno' },
  { id: 2, nombre: 'Coordinador' },
  { id: 1, nombre: 'Administrador' },
]

const formularioVacio = { nombre: '', mail: '', usuario: '', pass: '', rol: '3' }

function Registro() {
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState(formularioVacio)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)
  const [cargando, setCargando] = useState(false)

  const cambiarCampo = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const guardar = async (e) => {
    e.preventDefault()
    setError(null)
    setExito(null)
    setCargando(true)
    try {
      const resultado = await registrarUsuario({
        nombre: formulario.nombre,
        mail: formulario.mail,
        usuario: formulario.usuario,
        pass: formulario.pass,
        id_rol: Number(formulario.rol),
      })
      setExito(`${resultado.message}. Ya podés ingresar con tu usuario.`)
      setFormulario(formularioVacio)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <PanelAcceso titulo="Crear cuenta" bajada="Registrate como alumno para inscribirte en materias, o como coordinador o administrador para gestionar la cursada.">
      <form onSubmit={guardar} className="flex flex-col gap-4">
        <Campo label="Nombre y apellido" name="nombre" value={formulario.nombre} onChange={cambiarCampo} required />
        <Campo label="Mail" name="mail" type="email" value={formulario.mail} onChange={cambiarCampo} autoComplete="email" required />
        <Campo
          label="Usuario"
          name="usuario"
          value={formulario.usuario}
          onChange={cambiarCampo}
          autoComplete="username"
          minLength={3}
          required
        />
        <Campo
          label="Contraseña (mín. 4)"
          name="pass"
          type="password"
          value={formulario.pass}
          onChange={cambiarCampo}
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
                  checked={formulario.rol === String(rol.id)}
                  onChange={cambiarCampo}
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
