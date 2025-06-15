import type {Metadata} from "next"
import "./globals.css"
import {Providers} from "./providers"

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
