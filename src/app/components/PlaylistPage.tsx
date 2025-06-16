"use client"

import SpotifyIcon from "@/icons"
import {getAverageColor, PauseContext, PlayContext} from "@/lib/spotifyActions"
import {Image as ImageType, PlaylistById, PublicUser} from "@/typings"
import {PauseFill, PlayFill} from "@geist-ui/icons"
import Image from "next/image"
import {useEffect, useRef, useState} from "react"
import {formatMillisToMinutesSeconds} from "./Player"
import {useGlobalContext} from "@/context/GlobalContext"

export function formatRelativeDate(isoDate: string): string {
    const now = new Date()
    const date = new Date(isoDate)
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    const diffWeek = Math.floor(diffDay / 7)

    if (diffSec < 60) {
        return `${diffSec} second${diffSec === 1 ? "" : "s"} ago`
    } else if (diffMin < 60) {
        return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`
    } else if (diffHour < 24) {
        return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`
    } else if (diffDay < 7) {
        return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`
    } else if (diffWeek < 5) {
        return `${diffWeek} week${diffWeek === 1 ? "" : "s"} ago`
    } else {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short", // e.g., "Jun"
            day: "numeric", // e.g., 6
        })
    }
}

export function PlaylistPage({item, contextUser, token}: {item: PlaylistById; contextUser: PublicUser; token: string}) {
    const {currentPLaying, setCurrentPlaying,device_id} = useGlobalContext()

    const [color, setColor] = useState("#1f1f1f")
    const [imgUrl, setImageUrl] = useState("")
    const [opacity, setOpacity] = useState(0)
    const [isStuck, setIsStuck] = useState(false)
    const [hover, setHover] = useState("")
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const length = item.name.length
    const getLength = () => {
        if (length >= 18) {
            return "text-2xl"
        } else if (length >= 14) {
            return "text-7xl"
        } else if (length >= 10) {
            return "text-8xl"
        } else {
            return "text-xl"
        }
    }

    useEffect(() => {
        const image = item.images as ImageType[]
        if (!image) return

        getAverageColor(image[0].url).then((color) => {
            setImageUrl(image[0].url)
            setColor(color)
        })
    }, [item.images])

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current
        if (!scrollContainer) return

        function checkSticky() {
            const element = document.getElementById("myStickyElement")
            const scrollContainer = scrollContainerRef.current
            if (!element || !scrollContainer) return

            const stickyTop = element.offsetTop - 64
            const scrollTop = scrollContainer.scrollTop

            if (scrollTop >= stickyTop) {
                element.classList.add("stuck")
                setIsStuck(true)
            } else {
                element.classList.remove("stuck")
                setIsStuck(false)
            }
        }

        const handleScroll = () => {
            const scrollTop = scrollContainer.scrollTop
            const maxScroll = 400
            const newOpacity = Math.min(scrollTop / maxScroll, 1)
            setOpacity(newOpacity)
        }

        scrollContainer.addEventListener("scroll", handleScroll)
        scrollContainer.addEventListener("scroll", checkSticky)

        handleScroll()
        checkSticky()
        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll)
            scrollContainer.removeEventListener("scroll", checkSticky)
        }
    }, [])

    return (
        <div ref={scrollContainerRef} className="overflow-y-auto h-full flex-col text-white rounded-lg relative">
            <div
                className={`sticky top-0 left-0 right-0 z-50 w-full flex items-center px-4 p-2 gap-2 transition-opacity duration-200`}
                style={{background: color, opacity}}
            >
                {currentPLaying.contextUri === item.uri && !currentPLaying.paused ? (
                    <button
                        onClick={() => {
                            PauseContext(token, device_id)
                        }}
                        className="bg-green-500 p-3 rounded-full cursor-pointer"
                    >
                        <PauseFill color="black" />
                    </button>
                ) : (
                    <button
                        className="bg-green-500 p-3 rounded-full cursor-pointer"
                        onClick={() => {
                            PlayContext({token, context_uri: item.uri})
                        }}
                    >
                        <PlayFill color="black" />
                    </button>
                )}
                <h1 className="font-extrabold text-3xl">{item.name}</h1>
            </div>
            <div
                className="flex-col absolute top-0 right-0 left-0 bottom-0 z-10"
                style={{
                    backgroundImage: `linear-gradient(to top, transparent 40%, ${color} 80%)`,
                }}
            >
                <div className=" flex flex-col gap-2 px-6 pt-12 pb-6">
                    <div className="flex gap-4 items-end">
                        {imgUrl.length > 0 ? (
                            <Image
                                src={imgUrl}
                                alt="Playlist Image"
                                className="rounded"
                                style={{boxShadow: "0 10px 90px rgba(0,0,0,.5)"}}
                                width={232}
                                height={232}
                            />
                        ) : (
                            <div
                                className="text-white/40 bg-zinc-900 rounded shadow flex items-center justify-center"
                                style={{width: 232, height: 232, boxShadow: "0 10px 90px rgba(0,0,0,.5)"}}
                            >
                                <svg viewBox="0 0 24 24" height="48" fill="currentColor">
                                    <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5z"></path>
                                </svg>
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <p>
                                {item.public ? "Public" : "Private"} {item.type}
                            </p>
                            <h1 className={`text-white font-extrabold ${getLength()}`}>{item.name}</h1>
                            <p className="opacity-50">{item.description}</p>
                            <div className="flex items-center gap-1">
                                <p className="text-white font-bold">{contextUser.display_name}</p>
                                <span className="text-white opacity-50"> • </span>
                                <p className="text-white opacity-50">{item.followers.total.toLocaleString()} saves</p>
                                <span className="text-white opacity-50"> • </span>
                                <p className="text-white opacity-50">{item.tracks.total} songs</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        backgroundImage: `linear-gradient(to top, transparent 50%, #09090b20 80%)`,
                    }}
                >
                    <div className="flex items-center px-4 py-6">
                        {currentPLaying.contextUri === item.uri && !currentPLaying.paused ? (
                            <button
                                onClick={() => {
                                    PauseContext(token,device_id)
                                }}
                                className="bg-green-500 p-3 rounded-full cursor-pointer"
                            >
                                <PauseFill color="black" />
                            </button>
                        ) : (
                            <button
                                className="bg-green-500 p-3 rounded-full cursor-pointer"
                                onClick={() => {
                                    PlayContext({token, context_uri: item.uri})
                                }}
                            >
                                <PlayFill color="black" />
                            </button>
                        )}
                    </div>
                    <div
                        id="myStickyElement"
                        className={`flex z-40 flex-1 items-center sticky top-16 gap-4 border-b-[1px] border-zinc-300/30 p-2 ${
                            isStuck && "bg-[#1f1f1f]"
                        }`}
                    >
                        <div className="flex opacity-70">
                            <p className="text-right w-8">#</p>
                        </div>
                        <div className="flex flex-6 items-center gap-2">Title</div>
                        <p className="text-sm opacity-70 flex-3">Album</p>
                        <p className="text-sm opacity-70 flex-3">Date added</p>
                        <div className="text-sm opacity-70 flex-1 flex justify-end pr-6">
                            <svg viewBox="0 0 16 16" height="16" fill="currentColor">
                                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path>
                                <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-col px-2 py-6">
                        {item.tracks.items.map(({track, added_at}, index) => (
                            <div
                                onMouseEnter={() => setHover(track.id)}
                                onMouseLeave={() => setHover("")}
                                className={`hover:bg-zinc-700/50 rounded py-2 flex flex-1 items-center gap-6
                                `}
                                key={track.id}
                            >
                                <div className="flex opacity-70 relative">
                                    <p
                                        className={`text-right font-semibold w-8 ${
                                            currentPLaying.trackUri === track.uri && "text-green-500"
                                        }`}
                                    >
                                        {track.id === hover ? (
                                            currentPLaying.trackUri === track.uri ? (
                                                currentPLaying.paused ? (
                                                    <PlayFill
                                                        onClick={() => {
                                                            PlayContext({token, context_uri: item.uri, position: index})
                                                        }}
                                                        className="cursor-pointer absolute top-1/2 left-[100%] translate-y-[-50%] translate-x-[-50%]"
                                                        color="white"
                                                    />
                                                ) : (
                                                    <PauseFill
                                                        onClick={() => {
                                                            PauseContext(token,device_id)
                                                        }}
                                                        color="white"
                                                        className="cursor-pointer absolute top-1/2 left-[100%] translate-y-[-50%] translate-x-[-50%]"
                                                    />
                                                )
                                            ) : (
                                                <PlayFill
                                                    onClick={() => {
                                                        PlayContext({token, context_uri: item.uri, position: index})
                                                    }}
                                                    className="cursor-pointer absolute top-1/2 left-[100%] translate-y-[-50%] translate-x-[-50%]"
                                                    color="white"
                                                />
                                            )
                                        ) : (
                                            index + 1
                                        )}
                                    </p>
                                </div>
                                <div className="flex flex-6 items-center gap-2">
                                    <Image
                                        src={track.album.images[0].url}
                                        alt="Playlist Image"
                                        className="rounded"
                                        width={40}
                                        height={40}
                                    />
                                    <div className="flex flex-col">
                                        <p className={`text-sm ${currentPLaying.trackUri === track.uri && "text-green-500"}`}>
                                            {track.name}
                                        </p>
                                        <p className="text-sm opacity-70">{track.artists.map(({name}: any) => name)}</p>
                                    </div>
                                </div>
                                <p className="text-sm opacity-70 flex-3">{track.album.name}</p>
                                <p className="text-sm opacity-70 flex-3 text-left">{formatRelativeDate(added_at as string)}</p>
                                <div className="text-sm opacity-70 flex-1 text-right pr-7">
                                    {formatMillisToMinutesSeconds(track.duration_ms)}
                                </div>
                            </div>
                        ))}
                        <div className="px-6 pt-12">
                            <h1>Recomendations</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
