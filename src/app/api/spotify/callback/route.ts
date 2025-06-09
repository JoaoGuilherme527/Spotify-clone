import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) return NextResponse.json({ error: 'Code not found' }, { status: 400 });

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  try {
    const res = await axios.post(
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
      })
    const sdkToken = res.data;
    const url = new URL('/dashboard', req.url);
    url.searchParams.set('access_token', sdkToken.access_token);
    return NextResponse.redirect(url.toString());
  } catch (error: any) {
    return NextResponse.json({ error: error.response?.data || error.message }, { status: 500 });
  }
}
