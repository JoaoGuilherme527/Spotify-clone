import axios from 'axios';
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';

export async function GetAccessToken() {
  const cookie = (await cookies()).get('access_token')?.value as string
  return cookie
}

export async function RefreshToken(): Promise<string | null> {
  const res = await fetch(process.env.REDIRECT_URI + '/api/spotify/refresh_token', {
    method: 'GET',
    headers: {
      Cookie: (await cookies())
        .getAll()
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ')
    },
  })

  if (!res.ok) {
    console.error('Erro ao tentar atualizar o access_token')
    return null
  }

  const data = await res.json()
  console.log(data);
  const cookiesStore = (await cookies())

  cookiesStore.set('access_token', data.access_token, {
    name: 'access_token',
    value: data.access_token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: data.expires_in, // 1 Hour
  })
  cookiesStore.set('refresh_token', data.refresh_token, {
    name: 'refresh_token',
    value: data.refresh_token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: data.expires_in, // 1 Hour
  })

  return data
}
