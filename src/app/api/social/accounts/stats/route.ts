import { apiHandler } from '@/utils/apiHandler'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get('period')
  const query = period ? `?period=${encodeURIComponent(period)}` : ''
  return apiHandler(request, `/social/accounts/stats${query}`)
}
