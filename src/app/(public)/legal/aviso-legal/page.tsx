import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'
import { COMPANY } from '@/features/legal/company'

export const metadata: Metadata = {
  title: 'Aviso legal · Brachfield Academy',
  description: 'Información legal del titular de Brachfield Academy.',
}

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal">
      <h2>1. Identificación del titular</h2>
      <p>
        En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
        Información y de Comercio Electrónico (LSSI-CE), se informa de que el titular de este sitio
        web es:
      </p>
      <ul>
        <li>
          <strong>Titular:</strong> {COMPANY.name}
        </li>
        <li>
          <strong>NIF:</strong> {COMPANY.taxId}
        </li>
        <li>
          <strong>Domicilio:</strong> {COMPANY.address}
        </li>
        <li>
          <strong>Email de contacto:</strong> {COMPANY.email}
        </li>
        <li>
          <strong>Sitio web:</strong> {COMPANY.url}
        </li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        {COMPANY.brand} es una plataforma de formación online por suscripción especializada en
        credit management, prevención de impagos y recuperación de deudas, dirigida a profesionales
        y empresas. El acceso a los contenidos formativos requiere registro y suscripción de pago,
        conforme a las <a href="/legal/condiciones">Condiciones de contratación</a>.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso y la navegación por este sitio atribuyen la condición de usuario e implican la
        aceptación de este aviso legal. El usuario se compromete a hacer un uso adecuado del sitio y
        de sus contenidos, y a no emplearlos para actividades ilícitas o contrarias a la buena fe,
        ni de forma que pueda dañar, inutilizar o sobrecargar el servicio.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        Todos los contenidos de la plataforma — cursos, vídeos, textos, plantillas, documentos,
        marcas, logotipos y diseño — son titularidad de {COMPANY.name} o de sus licenciantes, y
        están protegidos por la normativa de propiedad intelectual e industrial. La suscripción
        otorga un derecho de uso personal, limitado y no transferible de los contenidos. Queda
        prohibida su reproducción, distribución, comunicación pública o transformación sin
        autorización expresa, incluida la reventa o el uso compartido de credenciales de acceso.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        Los contenidos de la plataforma tienen finalidad formativa e informativa y no constituyen
        asesoramiento jurídico ni financiero para casos concretos. El titular no se hace responsable
        de las decisiones adoptadas a partir de la información aquí publicada ni de los daños
        derivados de su uso. El titular tampoco garantiza la disponibilidad ininterrumpida del
        servicio, aunque pondrá los medios razonables para asegurarla.
      </p>

      <h2>6. Enlaces externos</h2>
      <p>
        Este sitio puede contener enlaces a páginas de terceros. El titular no asume responsabilidad
        alguna sobre sus contenidos ni sobre sus políticas de privacidad.
      </p>

      <h2>7. Legislación aplicable y jurisdicción</h2>
      <p>
        Este aviso legal se rige por la legislación española. Para cualquier controversia, y salvo
        que la normativa de consumidores establezca otra cosa, las partes se someten a los juzgados
        y tribunales del domicilio del titular.
      </p>
    </LegalPage>
  )
}
