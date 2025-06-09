"use client"

import Link from "next/link"
import Login from "./(public)/login/page"

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center text-white">
            <h1 className="text-2xl font-bold mb-4">Spotify Clone</h1>
            <Link href={"/login"} >Login</Link>
        </main>
    )
}
