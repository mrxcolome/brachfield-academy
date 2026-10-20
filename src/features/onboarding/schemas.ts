import { z } from 'zod'

export const PROFILE_OPTIONS = [
  { value: 'CFO', label: 'Director/a Financiero' },
  { value: 'CREDIT_MANAGER', label: 'Credit Manager' },
  { value: 'COLLECTIONS', label: 'Administración / Cobros' },
  { value: 'CONTROLLER', label: 'Controller' },
  { value: 'MANAGEMENT', label: 'Gerencia' },
  { value: 'LAWYER', label: 'Abogado/a' },
  { value: 'CONSULTANT', label: 'Consultor/a' },
  { value: 'OTHER', label: 'Otro' },
] as const

export const GOAL_OPTIONS = [
  'Prevenir impagos',
  'Reducir la morosidad',
  'Mejorar el recobro',
  'Gestionar mejor el riesgo de clientes',
  'Organizar el departamento de crédito',
  'Mejorar las negociaciones de cobro',
  'Actualizar mis conocimientos legales',
  'Reducir el plazo medio de cobro',
  'Formarme como Credit Manager',
] as const

export const onboardingSchema = z.object({
  professionalProfile: z.enum([
    'CFO',
    'CREDIT_MANAGER',
    'COLLECTIONS',
    'CONTROLLER',
    'MANAGEMENT',
    'LAWYER',
    'CONSULTANT',
    'OTHER',
  ]),
  interests: z.array(z.enum(GOAL_OPTIONS)).min(1, 'Elige al menos un objetivo').max(9),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>
