"use client"

import SpotifyIcon from "@/icons"
import {useState} from "react"

export default function Aside() {
    const [variant, setVariant] = useState(false)
    const [asideOpen, setAsideOpen] = useState(true)

    return (
        <aside className={`${asideOpen ? "w-96 py-3 px-5" : "w-20 p-4 flex items-center"} overflow-x-hidden rounded-lg bg-zinc-50/5 flex-col `}>
            {asideOpen ? (
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3 flex-1">
                        <button
                            className="hover:scale-125 cursor-pointer"
                            onMouseEnter={() => setVariant(true)}
                            onMouseLeave={() => setVariant(false)}
                            onClick={() => setAsideOpen(!asideOpen)}
                        >
                            <SpotifyIcon icon="Library" className="scale-115" color="#fafafaa0" />
                        </button>
                        <h1 className="text-md text-white font-extrabold">Your Library</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex gap-2 hover:scale-105 cursor-pointer transition-all items-center hover:bg-zinc-700 bg-zinc-800 px-5 py-2 rounded-full">
                            <SpotifyIcon icon="Plus" color="#fafafaa0" />
                            <span className="text-white font-bold">Create</span>
                        </button>

                        <button className="flex gap-2 items-center cursor-pointer">
                            <SpotifyIcon icon="Expand" color="#fafafaa0" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="">
                    <button
                        className="hover:scale-105 cursor-pointer p-2"
                        onMouseEnter={() => setVariant(true)}
                        onMouseLeave={() => setVariant(false)}
                        onClick={() => setAsideOpen(!asideOpen)}
                    >
                        <SpotifyIcon icon="LibraryOpen" className="scale-120" variant={!variant} color="#fafafaa0" />
                    </button>
                </div>
            )}
        </aside>
    )
}
