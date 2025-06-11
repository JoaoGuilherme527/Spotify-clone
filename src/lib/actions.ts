// lib/actions.ts
import { cookies } from 'next/headers'

export async function GetAccessToken() {
  const cookie = (await cookies()).get('access_token')
  return cookie?.value || null
}
