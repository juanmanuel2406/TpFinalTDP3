import axios from 'axios'

function autorizacion() {
  const token = localStorage.getItem('token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function loginRequest(datos) {
  const respuesta = await axios.post('/usuarios/login', datos)
  return respuesta.data
}

export async function registrarUsuario(datos) {
  const respuesta = await axios.post('/usuarios', datos)
  return respuesta.data
}

export async function getCarreras() {
  const respuesta = await axios.get('/carreras', autorizacion())
  return respuesta.data
}

export async function getMaterias() {
  const respuesta = await axios.get('/materias', autorizacion())
  return respuesta.data
}

export async function getMateria(id) {
  const respuesta = await axios.get(`/materias/${id}`, autorizacion())
  return respuesta.data
}

export async function crearMateria(datos) {
  const respuesta = await axios.post('/materias', datos, autorizacion())
  return respuesta.data
}

export async function eliminarMateria(id) {
  const respuesta = await axios.delete(`/materias/${id}`, autorizacion())
  return respuesta.data
}

export async function getAlumnosDeMateria(id) {
  const respuesta = await axios.get(`/materias/${id}/alumnos`, autorizacion())
  return respuesta.data
}

export async function getAlumnos() {
  const respuesta = await axios.get('/alumnos', autorizacion())
  return respuesta.data
}

export async function getAlumno(id) {
  const respuesta = await axios.get(`/alumnos/${id}`, autorizacion())
  return respuesta.data
}

export async function crearAlumno(datos) {
  const respuesta = await axios.post('/alumnos', datos, autorizacion())
  return respuesta.data
}

export async function actualizarAlumno(id, datos) {
  const respuesta = await axios.put(`/alumnos/${id}`, datos, autorizacion())
  return respuesta.data
}

export async function eliminarAlumno(id) {
  const respuesta = await axios.delete(`/alumnos/${id}`, autorizacion())
  return respuesta.data
}

export async function getMateriasDeAlumno(id) {
  const respuesta = await axios.get(`/alumnos/${id}/materias`, autorizacion())
  return respuesta.data
}

export async function inscribir(datos) {
  const respuesta = await axios.post('/inscripciones', datos, autorizacion())
  return respuesta.data
}

export async function darDeBajaInscripcion(datos) {
  const respuesta = await axios.delete('/inscripciones', { ...autorizacion(), data: datos })
  return respuesta.data
}
