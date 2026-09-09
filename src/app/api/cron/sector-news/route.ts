// Cron diario (vercel.json): refresca el tablón «El sector, al día».
// También ejecutable a mano desde Administración (features/sector-news/actions).
import { NextResponse } from 'next/server'
import { refreshSectorNews } from '@/features/sector-news/service'

export const dynamic = 'force-dynamic'

export async function GET(req: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const result = await refreshSectorNews()
  return NextResponse.json(result)
}
