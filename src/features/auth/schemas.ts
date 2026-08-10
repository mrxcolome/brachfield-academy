import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Escribe tu nombre'),
  email: z.string().trim().email('Correo no válido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

export const loginSchema = z.object({
  email: z.string().trim().email('Correo no válido'),
  password: z.string().min(1, 'Escribe tu contraseña'),
})

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
