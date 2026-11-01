import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import Boton from './Boton'
import Campo from './Campo'
import Mensaje from './Mensaje'
import PanelAcceso from './PanelAcceso'

function Login() {
  const navigate = useNavigate()
  const { iniciarSesion } = useAuthStore()
  const [form, setForm] = useState({ usuario: '', pass: '' })
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await iniciarSesion(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <PanelAcceso titulo="Ingresar" bajada="Entrá con tu usuario para ver las materias, inscribirte o gestionar a los alumnos según tu rol.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Campo
          label="Usuario"
          name="usuario"
          value={form.usuario}
          onChange={handleChange}
          autoComplete="username"
          required
        />
        <Campo
          label="Contraseña"
          name="pass"
          type="password"
          value={form.pass}
          onChange={handleChange}
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