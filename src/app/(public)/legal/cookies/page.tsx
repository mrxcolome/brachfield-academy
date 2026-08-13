import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'

export const metadata: Metadata = {
  title: 'Política de cookies · Brachfield Academy',
  description: 'Qué cookies utiliza Brachfield Academy y por qué no necesita banner.',
}

export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies">
      <h2>1. Qué son las cookies</h2>
      <p>
        Las cookies son pequeños archivos que el navegador guarda al visitar un sitio web y que
        permiten, por ejemplo, mantener la sesión iniciada.
      </p>

      <h2>2. Qué cookies usamos</h2>
      <p>
        Esta plataforma utiliza únicamente{' '}
        <strong>cookies técnicas estrictamente necesarias</strong> para su funcionamiento:
      </p>
      <ul>
        <li>
          <strong>Cookies de sesión</strong>: mantienen la sesión iniciada del usuario registrado y
          protegen la seguridad de la cuenta. Caducan al cerrar sesión o transcurrido su plazo de
          validez.
        </li>
      </ul>
      <p>
        Estas cookies están exentas del deber de consentimiento conforme al art. 22.2 LSSI y a las
        guías de la AEPD, por ser imprescindibles para prestar el servicio solicitado por el
        usuario. Por eso este sitio <strong>no muestra banner de cookies</strong>.
      </p>

      <h2>3. Lo que NO usamos</h2>
      <ul>
        <li>No usamos cookies de publicidad ni de seguimiento entre sitios.</li>
        <li>
          No usamos cookies de analítica: las métricas de uso se procesan en nuestros servidores de
          forma agregada, sin identificar al navegador del usuario.
        </li>
      </ul>

      <h2>4. Cómo gestionarlas</h2>
      <p>
        Puedes borrar o bloquear las cookies desde la configuración de tu navegador. Ten en cuenta
        que, al ser necesarias para la sesión, bloquearlas impedirá acceder a la zona de alumnos.
      </p>

      <h2>5. Cambios</h2>
      <p>
        Si en el futuro se incorporasen cookies no exentas (por ejemplo, de marketing), esta
        política se actualizará y se solicitará el consentimiento previo mediante el banner
        correspondiente.
      </p>
    </LegalPage>
  )
}
