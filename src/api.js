import axios from 'axios'

const BASE_URL = ''

// fetch: para las consultas (GET). En esta API todas piden el token
async function consultar(url) {
  const token = localStorage.getItem('token')
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  try {
    const respuesta = await fetch(`${BASE_URL}${url}`, { headers })
    const data = await respuesta.json()
    if (!respuesta.ok) {
      const err = new Error(data.message || 'Error de conexión con el servidor')
      err.status = respuesta.status
      throw err
    }
    return data
  } catch (error) {
    if (error.status) throw error
    throw new Error('Error de conexión con el servidor')
  }
}

// axios: para las peticiones que mandan datos (POST, PUT, DELETE)
async function request(url, opciones = {}) {
  const token = localStorage.getItem('token')
  const config = { url: `${BASE_URL}${url}`, method: opciones.method, ...opciones }
  if (token) {
    config.headers = { Authorization: `Bearer ${token}`, ...opciones.headers }
  }

  try {
    const respuesta = await axios(config)
    return respuesta.data
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.message ||
      'Error de conexión con el servidor'
    const err = new Error(mensaje)
    err.status = error.response?.status
    throw err
  }
}

// Usuarios
export const loginRequest = (datos) =>
  request('/usuarios/login', { method: 'POST', data: datos })

export const registrarUsuario = (datos) =>
  request('/usuarios', { method: 'POST', data: datos })

// Carreras
export const getCarreras = () =>
  consultar('/carreras')

// Materias
export const getMaterias = () =>
  consultar('/materias')

export const getMateria = (id) =>
  consultar(`/materias/${id}`)

export const crearMateria = (datos) =>
  request('/materias', { method: 'POST', data: datos })

export const eliminarMateria = (id) =>
  request(`/materias/${id}`, { method: 'DELETE' })

export const getAlumnosDeMateria = (id) =>
  consultar(`/materias/${id}/alumnos`)

// Alumnos
export const getAlumnos = () =>
  consultar('/alumnos')

export const getAlumno = (id) =>
  consultar(`/alumnos/${id}`)

export const crearAlumno = (datos) =>
  request('/alumnos', { method: 'POST', data: datos })

export const actualizarAlumno = (id, datos) =>
  request(`/alumnos/${id}`, { method: 'PUT', data: datos })

export const eliminarAlumno = (id) =>
  request(`/alumnos/${id}`, { method: 'DELETE' })

export const getMateriasDeAlumno = (id) =>
  consultar(`/alumnos/${id}/materias`)

// Inscripciones
export const inscribir = (datos) =>
  request('/inscripciones', { method: 'POST', data: datos })

export const darDeBajaInscripcion = (datos) =>
  request('/inscripciones', { method: 'DELETE', data: datos })
