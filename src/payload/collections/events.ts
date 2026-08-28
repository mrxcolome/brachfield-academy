import type { CollectionConfig } from 'payload'
import { editorialHooks } from '../activity'

// Eventos editoriales (briefing §30). Las reservas viven en el dominio
// de aplicación (event_registration, Prisma).
export const Events: CollectionConfig = {
  slug: 'events',
  hooks: editorialHooks('events'),
  labels: { singular: 'Evento', plural: 'Eventos' },
  admin: {
    useAsTitle: 'title',
    group: 'Contenido',
    defaultColumns: ['title', 'eventType', 'startAt', '_status'],
  },
  versions: { drafts: true },
  access: { read: () => true },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', label: 'Descripción', type: 'textarea', required: true },
    {
      name: 'eventType',
      label: 'Tipo',
      type: 'select',
      required: true,
      options: [
        { label: 'Webinar', value: 'WEBINAR' },
        { label: 'Q&A (Pregunta a Pere)', value: 'QA' },
        { label: 'Masterclass', value: 'MASTERCLASS' },
        { label: 'Caso práctico', value: 'CASE' },
        { label: 'Actualización legal', value: 'LEGAL_UPDATE' },
      ],
    },
    {
      name: 'startAt',
      label: 'Empieza (UTC)',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'endAt',
      label: 'Termina (UTC)',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'capacity', label: 'Aforo (vacío = ilimitado)', type: 'number' },
    { name: 'speaker', label: 'Ponente', type: 'text', defaultValue: 'Pere Brachfield' },
    { name: 'streamUrl', label: 'URL del directo', type: 'text' },
    {
      name: 'replayContent',
      label: 'Replay (contenido)',
      type: 'relationship',
      relationTo: 'contents',
    },
  ],
}
