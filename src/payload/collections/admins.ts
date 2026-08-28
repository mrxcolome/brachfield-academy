import type { CollectionConfig } from 'payload'
import { editorialAfterLogin } from '../activity'

const isPanelAdmin = (user: unknown): boolean =>
  (user as { role?: string } | null)?.role === 'admin'

// Usuarios del PANEL (equipo editorial). Separados de los usuarios de la
// app (Better Auth): dominios distintos, credenciales distintas.
export const Admins: CollectionConfig = {
  slug: 'admins',
  labels: { singular: 'Usuario del panel', plural: 'Usuarios del panel' },
  auth: true,
  admin: { useAsTitle: 'email', group: 'Sistema' },
  access: {
    // Solo un administrador gestiona el equipo; un editor solo puede
    // editar su propia ficha (p. ej. cambiar su contraseña).
    create: ({ req }) => isPanelAdmin(req.user),
    delete: ({ req }) => isPanelAdmin(req.user),
    update: ({ req, id }) => isPanelAdmin(req.user) || req.user?.id === id,
  },
  hooks: { afterLogin: [editorialAfterLogin] },
  fields: [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Solo un admin puede cambiar roles
        update: ({ req }) => (req.user as { role?: string } | null)?.role === 'admin',
      },
    },
  ],
}
