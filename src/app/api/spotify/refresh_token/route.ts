// app/api/spotify/refresh_token/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const client_id = process.env.SPOTIFY_CLIENT_ID!
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')

export async function GET() {
    try {


        const refresh_token = (await cookies()).get('refresh_token')?.value

        if (!refresh_token) {
            return NextResponse.json({ error: 'No refresh_token found in cookies' }, { status: 401 })
        }

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token,
                client_id: process.env.SPOTIFY_CLIENT_ID!
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json({ error: data }, { status: response.status })
        }

        const res = NextResponse.json({ access_token: data.access_token, refresh_token: data.refresh_token })
        return res
    } catch (error) {
        console.log(error);
    }
}
