import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'
import { COMPANY } from '@/features/legal/company'

export const metadata: Metadata = {
  title: 'Condiciones de contratación · Brachfield Academy',
  description: 'Condiciones de la suscripción a Brachfield Academy.',
}

export default function CondicionesPage() {
  return (
    <LegalPage title="Condiciones de contratación">
      <h2>1. Objeto y aceptación</h2>
      <p>
        Estas condiciones regulan la suscripción a {COMPANY.brand}, plataforma de formación online
        titularidad de {COMPANY.name} ({COMPANY.taxId}). Al completar el proceso de compra, el
        usuario declara haber leído y aceptado estas condiciones.
      </p>

      <h2>2. El servicio</h2>
      <p>La suscripción da acceso, mientras esté activa, a:</p>
      <ul>
        <li>El catálogo completo de cursos y contenidos formativos</li>
        <li>La biblioteca de consulta y el buscador</li>
        <li>Las herramientas descargables (plantillas, modelos, checklists)</li>
        <li>Los eventos en directo y sus grabaciones</li>
        <li>Las novedades y actualizaciones que se publiquen durante la vigencia</li>
      </ul>
      <p>
        El catálogo es dinámico: los contenidos concretos pueden ampliarse, actualizarse o retirarse
        como parte de la evolución editorial normal de la plataforma.
      </p>

      <h2>3. Precio y facturación</h2>
      <p>
        El precio de la suscripción es de <strong>39 € al mes, IVA incluido</strong>, salvo
        promociones u ofertas que se indiquen expresamente. El pago se realiza por adelantado
        mediante tarjeta a través de Stripe, y se renueva automáticamente cada mes en la fecha de
        alta hasta su cancelación.
      </p>

      <h2>4. Duración y cancelación</h2>
      <p>
        La suscripción es mensual y <strong>sin permanencia</strong>. Puede cancelarse en cualquier
        momento desde la sección «Suscripción» de la cuenta; la cancelación surte efecto al final
        del periodo ya pagado, durante el cual se mantiene el acceso. No se realizan reembolsos
        parciales por periodos no consumidos, salvo lo previsto en el apartado 5.
      </p>

      <h2>5. Derecho de desistimiento</h2>
      <p>
        Si el usuario contrata como consumidor, dispone de 14 días naturales desde la contratación
        para desistir sin necesidad de justificación, escribiendo a {COMPANY.email}. Al tratarse de
        contenido digital de acceso inmediato, el usuario consiente expresamente al contratar que el
        acceso comience de inmediato; si ejercita el desistimiento dentro del plazo, se le
        reembolsará el importe abonado del periodo en curso salvo la parte proporcional al servicio
        ya disfrutado. Los profesionales y empresas que contratan en el marco de su actividad quedan
        fuera del régimen de desistimiento.
      </p>

      <h2>6. Cuenta y uso permitido</h2>
      <ul>
        <li>La cuenta es personal e intransferible; las credenciales no deben compartirse.</li>
        <li>
          Los contenidos son para uso profesional propio del suscriptor; no está permitida su
          reventa, redistribución ni comunicación pública.
        </li>
        <li>
          Las plantillas y herramientas descargables pueden utilizarse en la actividad profesional
          del suscriptor, pero no distribuirse como producto propio.
        </li>
        <li>
          El titular podrá suspender cuentas en caso de uso fraudulento, impago o incumplimiento
          grave de estas condiciones, previa comunicación al usuario.
        </li>
      </ul>

      <h2>7. Naturaleza de los contenidos</h2>
      <p>
        Los contenidos tienen finalidad formativa y divulgativa. No constituyen asesoramiento
        jurídico, financiero ni de otro tipo para casos concretos, y no sustituyen el criterio
        profesional aplicable a cada situación.
      </p>

      <h2>8. Modificaciones</h2>
      <p>
        El titular puede modificar estas condiciones y el precio de la suscripción. Los cambios de
        precio se comunicarán con al menos 30 días de antelación y solo se aplicarán a partir de la
        siguiente renovación, pudiendo el usuario cancelar antes sin coste.
      </p>

      <h2>9. Atención al cliente</h2>
      <p>
        Para cualquier consulta, incidencia o reclamación: {COMPANY.email}. Responderemos lo antes
        posible y, en todo caso, en un plazo máximo de un mes.
      </p>

      <h2>10. Ley aplicable</h2>
      <p>
        Estas condiciones se rigen por la legislación española. Los consumidores podrán acudir
        además a los órganos de resolución de litigios que correspondan a su domicilio.
      </p>
    </LegalPage>
  )
}
