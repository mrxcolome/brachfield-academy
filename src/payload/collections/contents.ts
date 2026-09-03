import type { CollectionConfig } from 'payload'
import { editorialHooks } from '../activity'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// Motor de contenidos (briefing §13): una colección flexible para todos
// los formatos no-curso. Drafts + publicación programada de Payload.
export const Contents: CollectionConfig = {
  slug: 'contents',
  hooks: editorialHooks('contents'),
  labels: { singular: 'Contenido', plural: 'Contenidos' },
  admin: {
    useAsTitle: 'title',
    group: 'Contenido',
    defaultColumns: ['title', 'contentType', '_status', 'publishedAt'],
  },
  versions: { drafts: { autosave: true, schedulePublish: true } },
  access: { read: () => true },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'subtitle', label: 'Subtítulo', type: 'text' },
    {
      name: 'excerpt',
      label: 'Extracto',
      type: 'textarea',
      admin: { description: 'Resumen corto para cards y buscador' },
    },
    {
      name: 'coverImage',
      label: 'Imagen de portada',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Imagen de la tarjeta y la ficha (ideal 16:9, mín. 800px de ancho). Si se deja vacía, se usa una foto automática según el formato del contenido.',
      },
    },
    {
      name: 'contentType',
      label: 'Tipo',
      type: 'select',
      required: true,
      index: true,
      options: [
        // Catálogo por CONCEPTOS (decisión del propietario 3/09/2026): lo que
        // busca el alumno, no el formato. El formato (vídeo/audio/descarga)
        // es un atributo de la pieza (streamId/audioFile/documentFile).
        { label: 'Tutorial', value: 'TUTORIAL' },
        { label: 'Píldora', value: 'PILL' },
        { label: 'Entrevista', value: 'INTERVIEW' },
        { label: 'Sesión en directo (replay)', value: 'WEBINAR' },
        { label: 'Guía', value: 'GUIDE' },
        { label: 'Checklist', value: 'CHECKLIST' },
        { label: 'Plantilla', value: 'TEMPLATE' },
        { label: 'Caso práctico', value: 'CASE_STUDY' },
        { label: 'Actualidad', value: 'NEWS' },
      ],
    },
    {
      name: 'level',
      label: 'Nivel',
      type: 'select',
      options: [
        { label: 'Iniciación', value: 'BEGINNER' },
        { label: 'Intermedio', value: 'INTERMEDIATE' },
        { label: 'Avanzado', value: 'ADVANCED' },
      ],
    },
    {
      name: 'duration',
      label: 'Duración',
      type: 'text',
      admin: { description: 'Ej. "8 min", "2h 35min"' },
    },
    { name: 'premium', label: 'Solo alumnos', type: 'checkbox', defaultValue: true },
    { name: 'featured', label: 'Destacado', type: 'checkbox', defaultValue: false },
    { name: 'thumbnail', label: 'Miniatura', type: 'upload', relationTo: 'media' },
    {
      name: 'categories',
      label: 'Categorías',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    {
      name: 'body',
      label: 'Cuerpo',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'streamId',
      label: 'ID de Cloudflare Stream',
      type: 'text',
      admin: {
        description: 'Si la pieza lleva vídeo: el UID del vídeo en Cloudflare Stream.',
      },
    },
    {
      name: 'audioFile',
      label: 'Archivo de audio',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Cualquier pieza puede llevar audio: el formato es un atributo.' },
    },
    {
      name: 'documentFile',
      label: 'Documento descargable',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Si la pieza tiene descarga (plantilla, checklist, PDF de la guía…).',
      },
    },
    {
      name: 'transcript',
      label: 'Transcripción',
      type: 'array',
      admin: { description: 'Fragmentos con marca de tiempo (clicables en el player)' },
      fields: [
        { name: 'ts', label: 'Segundos', type: 'number', required: true },
        { name: 'text', label: 'Texto', type: 'textarea', required: true },
      ],
    },
    {
      name: 'relatedContent',
      label: 'Contenido relacionado',
      type: 'relationship',
      relationTo: 'contents',
      hasMany: true,
      admin: { description: 'Relación manual — prioridad sobre la algorítmica (briefing §80)' },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', label: 'Título SEO', type: 'text' },
        { name: 'description', label: 'Descripción SEO', type: 'textarea' },
      ],
    },
    {
      name: 'publishedAt',
      label: 'Fecha de publicación',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
