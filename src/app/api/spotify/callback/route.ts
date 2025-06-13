// app/api/auth/callback/route.ts  (or wherever your GET lives)
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.json({ error: 'Code not found' }, { status: 400 })
  }

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64')

  try {
    const { data: sdkToken } = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const response = NextResponse.redirect(
      new URL(process.env.REDIRECT_URI + '/', req.url)
    )

    response.cookies.set({
      name: 'access_token',
      value: sdkToken.access_token,
      httpOnly: true,
      // Only secure in production over HTTPS:
      secure: process.env.NODE_ENV === 'production',
      // Allows sending on OAuth redirect:
      sameSite: 'lax',
      path: '/',
      maxAge: 3600,
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    )
  }
}
