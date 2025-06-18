"use client"

import SpotifyIcon from "@/icons"
import {PrivateUser} from "@/typings"
import {usePathname, useRouter} from "next/navigation"
import {useEffect, useLayoutEffect, useRef, useState} from "react"

interface HeaderProps {
    user: PrivateUser
}

export default function Header({user}: HeaderProps) {
    const pathname = usePathname()
    const router = useRouter()
    const regex = /^\/$/
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const timeout = setTimeout(() => {
            if(!searchTerm)return 
            router.push("/search/"+searchTerm)
            setSearchTerm("")
        }, 1000)

        return () => {
            clearTimeout(timeout)
        }
    }, [searchTerm])

    return (
        <header className="w-full justify-between flex" style={{height: 72}}>
            <div className="flex px-8 items-center justify-center">
                <SpotifyIcon icon="SpotifyLogo" color="white" />
            </div>
            <div className="flex gap-2 items-center transition-all w-2/7">
                <button
                    className="cursor-pointer p-3 bg-zinc-800 rounded-full hover:scale-110 hover:bg-zinc-700"
                    onClick={() => {
                        router.push("/")
                    }}
                >
                    <SpotifyIcon icon="Home" color="white" variant={!regex.test(pathname)} />
                </button>
                <div className="bg-zinc-800 px-3 flex items-center justify-between rounded-full hover:border-[1px] hover:border-zinc-600 hover:bg-zinc-700 focus-within:border-white focus-within:border-2 w-full">
                    <div className="flex items-center gap-3 w-full">
                        <SpotifyIcon icon="Search" color="#fafafa80" width={22} />
                        <input
                            className="outline-0 py-[10px] text-white text-lg w-full "
                            type="text"
                            placeholder="What do you want to play?"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                        />
                    </div>
                    <div className="pl-4 border-l-1 border-zinc-50/60">
                        <button
                            className="cursor-pointer p-0 flex items-center justify-center"
                            onClick={() => {
                                router.push("/search")
                            }}
                        >
                            <SpotifyIcon icon="Browse" variant={pathname.includes("/search")} color="white" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 items-center px-2">
                <button className="cursor-pointer p-[6px] transition-all bg-zinc-800 rounded-full hover:scale-110 hover:bg-zinc-700">
                    <img src={user.images[0].url} className="rounded-full" width={32} height={32} />
                </button>
            </div>
        </header>
    )
}
