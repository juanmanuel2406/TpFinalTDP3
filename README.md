# TpIntegradorTLP3 · Bedelía

Trabajo Integrador de Taller de Programación 3: es el Front hecho con REACT de la API de Alumnos, Materias e Inscripciones (TP de Taller de Programación 2).

## Cómo correrlo

El `docker-compose.yml` está en la carpeta del backend y levanta tres servicios:
`mysql` (base de datos), `app` (backend en el puerto 3000) y `front` (este proyecto, servido con nginx).
Las carpetas tienen que estar así para que el compose encuentre el front:

```
F:\Juan Manuel\
├── Apps de Programación\Trabajo-Practico-Taller-de-Programaci-n-2--main\Trabajo-Practico-Taller-de-Programaci-n-2--main   (docker-compose.yml)
└── TpIntegradorTLP3   (este proyecto)
```

### Todo junto con Docker (para presentar)

Desde la carpeta del backend:

```bash
docker compose up -d --build
```

Abrir `http://localhost:8080`. Para apagar todo: `docker compose down`.

Usuario de prueba: `admin` / `admin123` (Administrador).

### Modo desarrollo (para programar)

1. Levantar solo la base y el backend, desde la carpeta del backend:

   ```bash
   docker compose up -d mysql app
   ```

2. Levantar el front con Vite, desde esta carpeta:

   ```bash
   npm install
   npm run dev
   ```

   Abrir `http://localhost:5173`. Los cambios en el código se ven al instante.
   Vite redirige `/usuarios`, `/alumnos`, `/materias`, `/inscripciones` y `/carreras` al backend (ver `vite.config.js`).

## Qué puede hacer cada rol

| Rol | Puede |
|-----|-------|
| Administrador | Crear y dar de baja materias, dar de alta, editar y dar de baja alumnos, inscribir alumnos y dar de baja inscripciones |
| Coordinador | Ver alumnos, ver la cursada de cada alumno y los inscriptos de cada materia |
| Alumno | Ver materias, inscribirse, ver "Mi cursada" y darse de baja de una materia |

## Dónde está cada tema

| Tema | Dónde |
|------|-------|
| Componentes, JSX, props | `src/Components/` (`Boton`, `Campo`, `Mensaje`, `TarjetaMateria`, `PanelAcceso`) |
| useState y renderizado condicional | Todos los componentes (botones según el rol, mensajes, formularios) |
| Ciclo de vida y useEffect | `MateriaNueva.jsx` (montado / desmontado), `AlumnoMaterias.jsx` (carga al cambiar el id) |
| StrictMode | `src/main.jsx` |
| fetch | `src/api.js` → `consultar()` para los GET |
| axios | `src/api.js` → `request()` para POST, PUT y DELETE |
| react-router-dom y BrowserRouter | `src/main.jsx`, `src/App.jsx` |
| Navegación declarativa con Link | `Navbar.jsx`, chips de carreras en `Inicio.jsx`, "Ver cursada" en `Alumnos.jsx` |
| Navegación programática con useNavigate | `Login.jsx`, `Registro.jsx`, `MateriaNueva.jsx` |
| Parámetros con useParams | `/carrera/:id` → `Inicio.jsx`, `/alumno/:id` → `AlumnoMaterias.jsx`, `/materia/:id` → `MateriaAlumnos.jsx` |
| Manejo de arrays: map y filter | Menú del `Navbar` según el rol, buscadores, materias por carrera, materias disponibles para inscribir |
| Zustand y estado global | `src/store/useAuthStore.js` (usuario, token y rol) |
| Tailwind | Estilos en todos los componentes y colores en `src/index.css` |
| Docker (Dockerfile, imágenes) | `Dockerfile` (build con Node, se sirve con nginx) y `nginx.conf` |
| Docker Compose y red de contenedores | `docker-compose.yml` del backend: el front le habla al backend por el nombre del servicio `app` |
