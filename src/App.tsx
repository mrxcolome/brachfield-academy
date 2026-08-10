import { HashRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/public/Landing'
import Pricing from './pages/public/Pricing'
import Catalogo from './pages/public/Catalogo'
import CursoPublico from './pages/public/CursoPublico'
import Login from './pages/public/Login'
import Registro from './pages/public/Registro'
import Checkout from './pages/public/Checkout'
import Onboarding from './pages/Onboarding'
import Home from './pages/app/Home'
import Explorar from './pages/app/Explorar'
import Busqueda from './pages/app/Busqueda'
import Categoria from './pages/app/Categoria'
import Curso from './pages/app/Curso'
import Leccion from './pages/app/Leccion'
import Audio from './pages/app/Audio'
import Documento from './pages/app/Documento'
import Biblioteca from './pages/app/Biblioteca'
import Herramientas from './pages/app/Herramientas'
import Itinerario from './pages/app/Itinerario'
import MiFormacion from './pages/app/MiFormacion'
import Favoritos from './pages/app/Favoritos'
import Actualidad from './pages/app/Actualidad'
import Eventos from './pages/app/Eventos'
import EventoDetalle from './pages/app/EventoDetalle'
import PreguntaPere from './pages/app/PreguntaPere'
import CasoPractico from './pages/app/CasoPractico'
import Perfil from './pages/app/Perfil'
import Suscripcion from './pages/app/Suscripcion'
import Confirmacion from './pages/app/Confirmacion'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Área pública */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/precio" element={<Pricing />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/curso-publico" element={<CursoPublico />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Área privada */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="explorar" element={<Explorar />} />
          <Route path="buscar" element={<Busqueda />} />
          <Route path="categoria" element={<Categoria />} />
          <Route path="curso" element={<Curso />} />
          <Route path="leccion" element={<Leccion />} />
          <Route path="audio" element={<Audio />} />
          <Route path="documento" element={<Documento />} />
          <Route path="biblioteca" element={<Biblioteca />} />
          <Route path="herramientas" element={<Herramientas />} />
          <Route path="itinerario" element={<Itinerario />} />
          <Route path="mi-formacion" element={<MiFormacion />} />
          <Route path="favoritos" element={<Favoritos />} />
          <Route path="actualidad" element={<Actualidad />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="evento" element={<EventoDetalle />} />
          <Route path="pregunta-a-pere" element={<PreguntaPere />} />
          <Route path="caso-practico" element={<CasoPractico />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="suscripcion" element={<Suscripcion />} />
          <Route path="confirmacion" element={<Confirmacion />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
