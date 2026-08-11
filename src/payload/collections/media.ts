import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Archivo', plural: 'Media' },
  admin: { group: 'Contenido' },
  access: {
    // Producción (R2 activo): las imágenes son públicas (portadas del sitio),
    // pero documentos y audio premium SOLO salen por URL firmada de R2
    // (features/tools/downloads.ts). En desarrollo (disco local) todo pasa
    // por esta ruta y se deja abierto.
    read: ({ req }) => {
      if (req.user) return true
      if (!process.env.R2_ACCOUNT_ID) return true
      return { mimeType: { contains: 'image' } }
    },
  },
  upload: {
    staticDir: 'media',
    mimeTypes: [
      'image/*',
      'application/pdf',
      'audio/*',
      // Plantillas editables (Fase 11)
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  fields: [{ name: 'alt', label: 'Texto alternativo', type: 'text' }],
}
