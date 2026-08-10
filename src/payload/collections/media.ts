import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Archivo', plural: 'Media' },
  admin: { group: 'Contenido' },
  access: { read: () => true },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf', 'audio/*'],
  },
  fields: [{ name: 'alt', label: 'Texto alternativo', type: 'text' }],
}
