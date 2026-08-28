import type { CollectionConfig } from 'payload'
import { editorialHooks } from '../activity'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Categoría', plural: 'Categorías' },
  hooks: editorialHooks('categories', 'name'),
  admin: { useAsTitle: 'name', group: 'Taxonomía' },
  access: { read: () => true },
  fields: [
    { name: 'name', label: 'Nombre', type: 'text', required: true, unique: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL amigable, ej. prevencion-de-impagos' },
    },
  ],
}

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Tag', plural: 'Tags' },
  hooks: editorialHooks('tags', 'name'),
  admin: { useAsTitle: 'name', group: 'Taxonomía' },
  access: { read: () => true },
  fields: [
    { name: 'name', label: 'Nombre', type: 'text', required: true, unique: true },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],
}
