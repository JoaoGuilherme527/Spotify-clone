"use client"

import { Loading } from "@geist-ui/core"
import {useEffect, useState} from "react"

export default function Login() {
    const handleLogin = () => {
        setIsLoading(true)
        window.location.href = "/api/spotify/login"
    }

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        return () => setIsLoading(false)
    }, [])

    return (
            <main className="flex min-h-screen flex-col  text-white items-center justify-center bg-zinc-950">
                <button onClick={handleLogin} className="bg-green-500 text-white w-52 px-6 py-2 rounded hover:bg-green-600 cursor-pointer">
                    {isLoading ? <Loading type="secondary">Loading</Loading> : "Login com Spotify"}
                </button>
            </main>
    )
}
