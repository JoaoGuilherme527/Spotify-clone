import type {Metadata} from "next"
import "./globals.css"
import {Providers} from "./providers"
import Header from "./components/Header"
import Aside from "./components/Aside"
import PlayerFooter from "./components/Player"
import {GetAccessToken} from "@/lib/actions"
import { GetCurrentUser, GetUserSavedAlbum, GetUserSavedPlaylist } from "@/lib/spotifyActions"

export const metadata: Metadata = {
    title: "Spotify Clone",
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="bg-zinc-950 h-screen">
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
