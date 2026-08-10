import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// Cursos → módulos → lecciones (briefing §15). Arrays anidados = orden
// natural arrastrando en el panel.
export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: { singular: 'Curso', plural: 'Cursos' },
  admin: {
    useAsTitle: 'title',
    group: 'Contenido',
    defaultColumns: ['title', 'level', '_status'],
  },
  versions: { drafts: { autosave: true, schedulePublish: true } },
  access: { read: () => true },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', label: 'Descripción', type: 'textarea', required: true },
    { name: 'teacher', label: 'Profesor', type: 'text', defaultValue: 'Pere Brachfield' },
    {
      name: 'level',
      label: 'Nivel',
      type: 'select',
      required: true,
      options: [
        { label: 'Iniciación', value: 'BEGINNER' },
        { label: 'Intermedio', value: 'INTERMEDIATE' },
        { label: 'Avanzado', value: 'ADVANCED' },
      ],
    },
    {
      name: 'duration',
      label: 'Duración total',
      type: 'text',
      admin: { description: 'Ej. "2h 35min"' },
    },
    { name: 'thumbnail', label: 'Portada', type: 'upload', relationTo: 'media' },
    {
      name: 'objectives',
      label: 'Qué aprenderás',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'requirements',
      label: 'Requisitos',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'certificateEnabled',
      label: 'Emite certificado',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'categories',
      label: 'Categorías',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    {
      name: 'modules',
      label: 'Módulos',
      type: 'array',
      labels: { singular: 'Módulo', plural: 'Módulos' },
      fields: [
        { name: 'name', label: 'Nombre del módulo', type: 'text', required: true },
        {
          name: 'lessons',
          label: 'Lecciones',
          type: 'array',
          labels: { singular: 'Lección', plural: 'Lecciones' },
          fields: [
            { name: 'title', label: 'Título', type: 'text', required: true },
            {
              name: 'lessonType',
              label: 'Tipo',
              type: 'select',
              required: true,
              defaultValue: 'video',
              options: [
                { label: 'Vídeo', value: 'video' },
                { label: 'Audio', value: 'audio' },
                { label: 'Texto', value: 'text' },
                { label: 'Documento', value: 'document' },
              ],
            },
            { name: 'duration', label: 'Duración', type: 'text' },
            {
              name: 'streamId',
              label: 'ID de Cloudflare Stream',
              type: 'text',
              admin: { condition: (_data, siblingData) => siblingData?.lessonType === 'video' },
            },
            { name: 'body', label: 'Contenido', type: 'richText', editor: lexicalEditor() },
            {
              name: 'transcript',
              label: 'Transcripción',
              type: 'array',
              fields: [
                { name: 'ts', label: 'Segundos', type: 'number', required: true },
                { name: 'text', label: 'Texto', type: 'textarea', required: true },
              ],
            },
            {
              name: 'resources',
              label: 'Recursos',
              type: 'relationship',
              relationTo: 'contents',
              hasMany: true,
            },
          ],
        },
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
