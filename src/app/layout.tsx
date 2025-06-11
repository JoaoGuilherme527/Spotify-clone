import type {Metadata} from "next"
import "./globals.css"

export const metadata: Metadata = {
    title: "Spotify Clone",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="bg-zinc-950 h-screen">
            
            <body>{children}</body>
        </html>
    )
}
