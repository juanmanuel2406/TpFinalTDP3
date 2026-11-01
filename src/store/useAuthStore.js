import { create } from 'zustand'
import { loginRequest, registrarUsuario } from '../api'

// Datos del token que usa el front
const camposUsuario = ['id', 'nombre', 'id_rol']

// Roles de la API: 1 Administrador, 2 Coordinador, 3 Alumno
export const ROLES = {
  ADMIN: 1,
  COORDINADOR: 2,
  ALUMNO: 3,
}

function decodificarToken(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const datos = JSON.parse(atob(payload))
    // filter: del token se queda solo con id, nombre e id_rol (descarta iat, etc.)
    return Object.fromEntries(
      Object.entries(datos).filter(([clave]) => camposUsuario.includes(clave))
    )
  } catch {
    return null
  }
}

// Arma el estado de la sesión a partir de los datos del usuario
function datosSesion(usuario) {
  return {
    usuario,
    esAdmin: usuario?.id_rol === ROLES.ADMIN,
    esCoordinador: usuario?.id_rol === ROLES.COORDINADOR,
    esAlumno: usuario?.id_rol === ROLES.ALUMNO,
  }
}

// Si ya había una sesión guardada, el store arranca con esos datos
const tokenGuardado = localStorage.getItem('token')

// Zustand: estado global de la sesión. Cualquier componente lo usa con useAuthStore()
export const useAuthStore = create((set) => ({
  token: tokenGuardado,
  ...datosSesion(decodificarToken(tokenGuardado)),

  iniciarSesion: async (datos) => {
    const resultado = await loginRequest(datos)
    if (resultado.login && resultado.token) {
      const datosUsuario = decodificarToken(resultado.token)
      localStorage.setItem('token', resultado.token)
      localStorage.setItem('usuario', JSON.stringify(datosUsuario))
      set({ token: resultado.token, ...datosSesion(datosUsuario) })
    }
    return resultado
  },

  registrar: async (datos) => registrarUsuario(datos),

  cerrarSesion: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    set({ token: null, ...datosSesion(null) })
  },
}))
