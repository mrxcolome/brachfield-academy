// Fuentes del tablón «El sector, al día»: canales RSS públicos de medios
// económicos fiables. OJO sandbox: estas URLs no son alcanzables desde el
// entorno de desarrollo (red bloqueada) — se verifican en producción con el
// botón «Actualizar ahora» del panel de administración, que reporta el estado
// de cada fuente. Añadir aquí BOE/CEPYME cuando confirmemos sus canales.

export interface NewsSource {
  name: string
  url: string
}

export const NEWS_SOURCES: NewsSource[] = [
  { name: 'Expansión', url: 'https://e00-expansion.uecdn.es/rss/economia.xml' },
  { name: 'Cinco Días', url: 'https://cincodias.elpais.com/rss/cincodias/portada.xml' },
  // El Economista retirado (9/09): su cortafuegos responde 403 a peticiones
  // desde servidores (probado con UA de navegador) — sustituido por estas dos.
  { name: 'elDiario.es', url: 'https://www.eldiario.es/rss/economia/' },
  { name: 'RTVE', url: 'https://api2.rtve.es/rss/temas_economia.xml' },
  { name: 'Europa Press', url: 'https://www.europapress.es/rss/rss.aspx?ch=00136' },
]
