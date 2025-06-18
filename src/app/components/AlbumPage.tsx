"use client"

import {useEffect, useLayoutEffect, useRef, useState} from "react"
import Image from "next/image"
import {PauseFill, PlayFill} from "@geist-ui/icons"
import {capitalize, getAverageColor, handlePlayPause} from "@/lib/spotifyActions"
import {useGlobalContext} from "@/context/GlobalContext"
import type {Album, Artist, Paging, PlaylistById, PublicUser, SavedAlbum, SimplifiedTrack} from "@/typings"
import TrackList from "./TrackList"

interface AlbumPageProps {
    item: Album
    token: string
    artist: Artist
}

export function AlbumPage({item, token, artist}: AlbumPageProps) {
    const {currentPLaying, playerInstanceContext} = useGlobalContext()

    const [bgColor, setBgColor] = useState("#27272a")
    const [imageUrl, setImageUrl] = useState("")
    const [opacity, setOpacity] = useState(0)
    const [isStuck, setIsStuck] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)

    const getTitleClass = () => {
        const len = item.name.length
        if (len >= 18) return "text-2xl"
        if (len >= 14) return "text-7xl"
        if (len >= 10) return "text-8xl"
        else return "text-8xl"
    }

    useLayoutEffect(() => {
        const scrollEl = scrollRef.current
        if (!scrollEl) return

        const updateOpacity = () => {
            const top = scrollEl.scrollTop
            setOpacity(Math.min(top / 400, 1))
        }

        const checkSticky = () => {
            const stickyEl = document.getElementById("myStickyElement")
            if (!stickyEl) return

            const stickyTop = stickyEl.offsetTop - 64
            setIsStuck(scrollEl.scrollTop >= stickyTop)
        }

        scrollEl.addEventListener("scroll", updateOpacity)
        scrollEl.addEventListener("scroll", checkSticky)

        const images = item.images

        getAverageColor(images[0].url)
            .then((color) => {
                setImageUrl(images[0].url)
                setBgColor(color)
                setLoaded(true)
            })
            .catch(() => setLoaded(true))

        updateOpacity()
        checkSticky()

        return () => {
            scrollEl.removeEventListener("scroll", updateOpacity)
            scrollEl.removeEventListener("scroll", checkSticky)
        }
    }, [])

    const contextState = currentPLaying.contextUri === item.uri ? (currentPLaying.paused ? "resume" : "pause") : "play"

    const isPlaying = currentPLaying.contextUri === item.uri && !currentPLaying.paused

    return (
        <div ref={scrollRef} className="overflow-y-auto h-full flex-col text-white rounded-lg relative outline-0">
            {/* Header Sticky */}
            <div
                className="sticky top-0 z-50 w-full flex items-center px-4 py-2 gap-2 transition-opacity duration-200"
                style={{background: bgColor, opacity}}
            >
                <button
                    onClick={() =>
                        handlePlayPause({
                            token,
                            state: contextState,
                            player: playerInstanceContext,
                            uri: item.uri,
                        })
                    }
                    className="bg-green-500 p-3 rounded-full cursor-pointer"
                >
                    {isPlaying ? <PauseFill color="black" /> : <PlayFill color="black" />}
                </button>
                <h1 className="font-extrabold text-3xl">{item.name}</h1>
            </div>

            {/* Background Gradient */}
            <div
                className="absolute inset-0 z-10 flex-col"
                style={{backgroundImage: `linear-gradient(to top, transparent 40%, ${bgColor} 80%)`}}
            >
                <div className="flex flex-col gap-2 px-6 pt-12 pb-6">
                    <div className="flex gap-4 items-end">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt="Playlist Cover"
                                className="rounded shadow"
                                width={232}
                                height={232}
                                style={{boxShadow: "0 10px 90px rgba(0,0,0,.5)"}}
                            />
                        ) : (
                            <div
                                className="text-white/40 bg-zinc-900 rounded flex items-center justify-center"
                                style={{width: 232, height: 232, boxShadow: "0 10px 90px rgba(0,0,0,.5)"}}
                            >
                                <svg viewBox="0 0 24 24" height="48" fill="currentColor">
                                    <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5z"></path>
                                </svg>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <p>{capitalize(item.album_type)}</p>
                            <h1 className={`text-white font-extrabold ${getTitleClass()}`}>{item.name}</h1>
                            <div className="flex items-center gap-1">
                                {artist.images ? (
                                    <Image src={artist.images[0].url} alt={artist.name} className="rounded-full" width={25} height={25} />
                                ) : (
                                    <div
                                        className="text-white/40 bg-zinc-800 p-2 rounded flex items-center justify-center"
                                        style={{width: 25, height: 25, boxShadow: "0 10px 90px rgba(4,4,4,.5)"}}
                                    >
                                        <svg viewBox="0 0 24 24" height="48" fill="currentColor">
                                            <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5z"></path>
                                        </svg>
                                    </div>
                                )}
                                <p className="text-white font-bold">{artist.name}</p>
                                <span className="opacity-70">•</span>
                                <p className="text-white opacity-70">{new Date(item.release_date).getFullYear()}</p>
                                <span className="opacity-70">•</span>
                                <p className="opacity-70">{item.total_tracks} songs</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Songs Header */}
                <div className="bg-gradient-to-t from-transparent to-[#09090b20]">
                    <div className="flex items-center px-4 py-6">
                        <button
                            onClick={() =>
                                handlePlayPause({
                                    token,
                                    state: contextState,
                                    player: playerInstanceContext,
                                    uri: item.uri,
                                })
                            }
                            className="bg-green-500 p-3 rounded-full cursor-pointer"
                        >
                            {isPlaying ? <PauseFill color="black" /> : <PlayFill color="black" />}
                        </button>
                    </div>

                    <div
                        id="myStickyElement"
                        className={`sticky top-16 z-40 flex items-center gap-4 border-b border-zinc-300/30 p-2 ${
                            isStuck ? "bg-[#1f1f1f]" : ""
                        }`}
                    >
                        <div className="w-8 text-right opacity-70">#</div>
                        <div className="flex-6 opacity-70">Title</div>
                        <div className="flex-1 justify-end pr-6 flex opacity-70">
                            <svg viewBox="0 0 16 16" height="16" fill="currentColor">
                                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path>
                                <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Track List */}
                    <TrackList type={item.type} items={item.tracks.items as SimplifiedTrack[]} token={token} contextUri={item.uri} />
                </div>
            </div>
        </div>
    )
}
