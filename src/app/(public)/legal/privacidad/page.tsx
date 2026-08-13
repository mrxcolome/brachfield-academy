import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'
import { COMPANY } from '@/features/legal/company'

export const metadata: Metadata = {
  title: 'Política de privacidad · Brachfield Academy',
  description: 'Cómo tratamos los datos personales en Brachfield Academy (RGPD).',
}

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad">
      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>
          <strong>Responsable:</strong> {COMPANY.name} · NIF {COMPANY.taxId}
        </li>
        <li>
          <strong>Domicilio:</strong> {COMPANY.address}
        </li>
        <li>
          <strong>Email:</strong> {COMPANY.email}
        </li>
      </ul>

      <h2>2. Qué datos tratamos y para qué</h2>
      <h3>a) Cuenta y suscripción</h3>
      <p>
        Nombre, email, contraseña (cifrada), perfil profesional e intereses formativos que el
        usuario indica al registrarse, y estado de la suscripción. Finalidad: prestar el servicio
        contratado, gestionar el acceso y personalizar las recomendaciones de contenido.{' '}
        <strong>Base legal:</strong> ejecución del contrato (art. 6.1.b RGPD).
      </p>
      <h3>b) Facturación y pagos</h3>
      <p>
        Los pagos se procesan a través de <strong>Stripe</strong>; este sitio no almacena números de
        tarjeta. Conservamos los datos de facturación exigidos por la normativa fiscal.{' '}
        <strong>Base legal:</strong> ejecución del contrato y obligación legal (art. 6.1.b y c
        RGPD).
      </p>
      <h3>c) Uso de la plataforma</h3>
      <p>
        Progreso en los cursos, favoritos, descargas de herramientas, reservas de eventos, preguntas
        enviadas y búsquedas realizadas. Finalidad: prestar las funciones de la plataforma y mejorar
        el catálogo formativo mediante estadísticas internas. <strong>Base legal:</strong> ejecución
        del contrato e interés legítimo en mejorar el servicio (art. 6.1.b y f RGPD). Las métricas
        de uso se procesan de forma agregada en nuestra herramienta de analítica (PostHog, región
        UE) sin cookies de seguimiento en el navegador.
      </p>
      <h3>d) Comunicaciones</h3>
      <p>
        Emails transaccionales necesarios para el servicio (verificación de cuenta, recibos,
        recordatorios de eventos reservados, respuestas a tus preguntas).{' '}
        <strong>Base legal:</strong> ejecución del contrato. Si en el futuro se envían
        comunicaciones comerciales, se hará conforme al art. 21 LSSI y podrán rechazarse en
        cualquier momento.
      </p>

      <h2>3. Destinatarios: encargados del tratamiento</h2>
      <p>
        No vendemos ni cedemos datos personales a terceros. Para prestar el servicio nos apoyamos en
        proveedores que actúan como encargados del tratamiento con las garantías del art. 28 RGPD:
      </p>
      <ul>
        <li>
          <strong>Vercel</strong> (alojamiento de la aplicación)
        </li>
        <li>
          <strong>Neon</strong> (base de datos, región UE — Fráncfort)
        </li>
        <li>
          <strong>Cloudflare</strong> (almacenamiento de archivos y vídeo)
        </li>
        <li>
          <strong>Stripe</strong> (procesamiento de pagos)
        </li>
        <li>
          <strong>Resend</strong> (envío de emails transaccionales)
        </li>
        <li>
          <strong>PostHog</strong> (analítica de producto, región UE)
        </li>
      </ul>
      <p>
        Algunos de estos proveedores pueden implicar transferencias internacionales de datos (p. ej.
        a EE. UU.); en tal caso se amparan en el Marco de Privacidad de Datos UE-EE. UU. o en
        cláusulas contractuales tipo aprobadas por la Comisión Europea.
      </p>

      <h2>4. Plazos de conservación</h2>
      <p>
        Los datos de la cuenta se conservan mientras la cuenta esté activa. Tras la baja, se
        bloquean y se conservan únicamente durante los plazos de prescripción legal (facturación:
        los exigidos por la normativa fiscal y mercantil). Las estadísticas agregadas no permiten
        identificar a personas.
      </p>

      <h2>5. Derechos</h2>
      <p>
        Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión,
        oposición, limitación del tratamiento y portabilidad escribiendo a {COMPANY.email} desde el
        email asociado a tu cuenta. También tienes derecho a reclamar ante la Agencia Española de
        Protección de Datos (aepd.es) si consideras que el tratamiento no se ajusta a la normativa.
      </p>

      <h2>6. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas apropiadas: cifrado de las comunicaciones
        (HTTPS/HSTS), contraseñas cifradas, control de acceso por roles, enlaces de descarga
        firmados y caducos, y registro de actividad administrativa.
      </p>

      <h2>7. Cambios en esta política</h2>
      <p>
        Cualquier cambio relevante en esta política se publicará en esta página y, si afecta a
        tratamientos ya en curso, se comunicará a los usuarios registrados.
      </p>
    </LegalPage>
  )
}
