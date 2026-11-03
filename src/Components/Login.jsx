import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { loginRequest } from '../api'
import useAuthStore from '../store/useAuthStore'
import Boton from './Boton'
import Campo from './Campo'
import Mensaje from './Mensaje'
import PanelAcceso from './PanelAcceso'

function Login() {
  const navigate = useNavigate()
  const { iniciarSesion } = useAuthStore()
  const [formulario, setFormulario] = useState({ usuario: '', pass: '' })
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const cambiarCampo = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const guardar = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      const respuesta = await loginRequest(formulario)
      if (!respuesta.login || !respuesta.token || !respuesta.usuario) {
        throw new Error(respuesta.message || 'No se pudo iniciar sesion')
      }
      iniciarSesion(respuesta.usuario, respuesta.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <PanelAcceso titulo="Ingresar" bajada="Entrá con tu usuario para ver las materias, inscribirte o gestionar a los alumnos según tu rol.">
      <form onSubmit={guardar} className="flex flex-col gap-4">
        <Campo
          label="Usuario"
          name="usuario"
          value={formulario.usuario}
          onChange={cambiarCampo}
          autoComplete="username"
          required
        />
        <Campo
          label="Contraseña"
          name="pass"
          type="password"
          value={formulario.pass}
          onChange={cambiarCampo}
          autoComplete="current-password"
          required
        />

        <Mensaje tipo="error" texto={error} />

        <Boton label={cargando ? 'Ingresando...' : 'Ingresar'} type="submit" disabled={cargando} />
      </form>

      <p className="mt-6 text-tinta/70">
        ¿No tenés cuenta?{' '}
        <Link to="/registro" className="font-bold text-violeta underline underline-offset-4 hover:text-chicle">
          Creá una
        </Link>
      </p>
    </PanelAcceso>
  )
}

export default Login
