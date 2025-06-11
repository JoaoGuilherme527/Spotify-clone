// lib/actions.ts
import { Album, SavedAlbum } from '@/typings'
import { cookies } from 'next/headers'

export async function GetAccessToken() {
  const cookie = (await cookies()).get('access_token')
  return cookie?.value || null
}

export async function GetUserAlbum(): Promise<Array<SavedAlbum>> {
  const token = await GetAccessToken()
  const response = await fetch("https://api.spotify.com/v1/me/albums", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = await response.json()
  return data.items
}

