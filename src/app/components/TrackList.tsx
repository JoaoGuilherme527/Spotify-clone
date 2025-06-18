"use client"

import {useGlobalContext} from "@/context/GlobalContext"
import SpotifyIcon from "@/icons"
import {DeleteTrackForUser, formatRelativeDate, GetUser, handlePlayPause, SaveTrackForUser} from "@/lib/spotifyActions"
import {Image as ImageType, Paging, PlaylistTrackCustom, PublicUser, SimplifiedTrack} from "@/typings"
import {PauseFill, PlayFill} from "@geist-ui/icons"
import Image from "next/image"
import {useEffect, useState} from "react"
import {formatMillisToMinutesSeconds} from "./Player"
import {useInView} from "react-intersection-observer"

function AlbumTrackItem({item, index, token, contextUri}: {item: SimplifiedTrack; index: number; token: string; contextUri: string}) {
    const {currentPLaying, playerInstanceContext} = useGlobalContext()
    const [isHovered, setIsHovered] = useState(false)
    const isCurrentTrack = currentPLaying.trackUri === item.uri
    const [isTrackSaved, setIsTrackSaved] = useState<boolean>(false)

    const {ref, inView} = useInView({
        threshold: 0.1,
        triggerOnce: true,
    })

    useEffect(() => {
        if (!inView) return

        fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${item.id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((r) => r.json())
            .then((isSavedData) => setIsTrackSaved(isSavedData[0]))
    }, [inView, token, item])

    const handleSaveTrackForUser = () => {
        if (isTrackSaved) {
            DeleteTrackForUser([item.id as string], token)
        } else {
            SaveTrackForUser([item.id as string], token)
        }
        setIsTrackSaved(!isTrackSaved)
    }

    return (
        <div
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="hover:bg-zinc-700/50 rounded py-2 flex items-center gap-6"
        >
            <div className="w-8 text-right relative">
                {isHovered ? (
                    <button
                        onClick={() =>
                            handlePlayPause({
                                token,
                                player: playerInstanceContext,
                                state: isCurrentTrack ? (currentPLaying.paused ? "resume" : "pause") : "play",
                                uri: contextUri,
                                index,
                            })
                        }
                        className="w-14 cursor-pointer flex items-center justify-center"
                    >
                        {!currentPLaying.paused && isCurrentTrack ? <PauseFill color="white" /> : <PlayFill color="white" />}
                    </button>
                ) : (
                    <span className={isCurrentTrack ? "text-green-500" : ""}>{index + 1}</span>
                )}
            </div>

            <div className="flex flex-6 items-center gap-2">
                <div className="flex flex-col">
                    <span className={`text-sm ${isCurrentTrack ? "text-green-500" : ""}`}>{item.name}</span>
                    <span className="text-sm opacity-70">{item.artists.map((a) => a.name).join(", ")}</span>
                </div>
            </div>
            <div className="flex-1 pr-6 text-sm flex items-center gap-5" style={{justifyContent: "end"}}>
                {isHovered ? (
                    <button onClick={handleSaveTrackForUser} className="hover:scale-110 relative cursor-pointer flex-col items-center flex">
                        <SpotifyIcon icon="Saved" variant={isTrackSaved} color={isTrackSaved ? "oklch(72.3% 0.219 149.579)" : "#99a1af"} />
                    </button>
                ) : isTrackSaved ? (
                    <button onClick={handleSaveTrackForUser} className="hover:scale-110 relative cursor-pointer flex-col items-center flex">
                        <SpotifyIcon icon="Saved" variant={isTrackSaved} color={isTrackSaved ? "oklch(72.3% 0.219 149.579)" : "#99a1af"} />
                    </button>
                ) : (
                    <></>
                )}

                {formatMillisToMinutesSeconds(item.duration_ms)}
            </div>
        </div>
    )
}
function PlaylistTrackItem({
    item,
    index,
    token,
    contextUri,
    contextIsPublic,
}: {
    item: PlaylistTrackCustom
    index: number
    token: string
    contextUri: string
    contextIsPublic: boolean
}) {
    const {currentPLaying, playerInstanceContext} = useGlobalContext()
    const [isHovered, setIsHovered] = useState(false)
    const [addedBy, setAddedBy] = useState<PublicUser>()
    const isCurrentTrack = currentPLaying.trackUri === item.track.uri
    const [isTrackSaved, setIsTrackSaved] = useState<boolean>(false)

    const {ref, inView} = useInView({
        threshold: 0.1,
        triggerOnce: true,
    })

    useEffect(() => {
        if (!inView) return

        if (!contextIsPublic) {
            GetUser(token, item.added_by?.id as string).then((res) => {
                if (res.images) setAddedBy(res)
            })
        }

        fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${item.track.id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((r) => r.json())
            .then((isSavedData) => setIsTrackSaved(isSavedData[0]))
    }, [inView, token, item, contextIsPublic])

    const handleSaveTrackForUser = () => {
        if (isTrackSaved) {
            DeleteTrackForUser([item.track.id as string], token)
        } else {
            SaveTrackForUser([item.track.id as string], token)
        }
        setIsTrackSaved(!isTrackSaved)
    }

    return (
        <div
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="hover:bg-zinc-700/50 rounded py-2 flex items-center gap-6"
        >
            <div className="w-8 text-right relative">
                {isHovered ? (
                    <button
                        onClick={() =>
                            handlePlayPause({
                                token,
                                player: playerInstanceContext,
                                state: isCurrentTrack ? (currentPLaying.paused ? "resume" : "pause") : "play",
                                uri: contextUri,
                                index,
                            })
                        }
                        className="w-14 cursor-pointer flex items-center justify-center"
                    >
                        {!currentPLaying.paused && isCurrentTrack ? <PauseFill color="white" /> : <PlayFill color="white" />}
                    </button>
                ) : (
                    <span className={isCurrentTrack ? "text-green-500" : ""}>{index + 1}</span>
                )}
            </div>

            <div className="flex flex-6 items-center gap-2">
                {item.track.album.images ? (
                    <Image src={item.track.album.images[0].url} alt={item.track.name} className="rounded" width={40} height={40} />
                ) : (
                    <div
                        className="text-white/40 bg-zinc-800 p-2 rounded flex items-center justify-center"
                        style={{width: 40, height: 40, boxShadow: "0 10px 90px rgba(4,4,4,.5)"}}
                    >
                        <svg viewBox="0 0 24 24" height="48" fill="currentColor">
                            <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5z"></path>
                        </svg>
                    </div>
                )}

                <div className="flex flex-col">
                    <span className={`text-sm ${isCurrentTrack ? "text-green-500" : ""}`}>{item.track.name}</span>
                    <span className="text-sm opacity-70">{item.track.artists.map((a) => a.name).join(", ")}</span>
                </div>
            </div>

            <div className="flex-3 text-sm opacity-70">{item.track.album.name}</div>
            {!contextIsPublic && (
                <div className="flex-3 flex items-center gap-1">
                    <div className="w-6">
                        {addedBy ? (
                            <Image alt="" className="rounded-full" width={20} height={20} src={(addedBy?.images as ImageType[])[0].url} />
                        ) : (
                            <div
                                className="text-white/40 bg-zinc-950 p-2 rounded-full flex items-center justify-center"
                                style={{width: 38, height: 38, boxShadow: "0 10px 90px rgba(0,0,0,.5)"}}
                            >
                                <svg viewBox="0 0 24 24" height="48" fill="currentColor">
                                    <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5z"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex-3 text-sm opacity-70">{addedBy?.display_name}</div>
                </div>
            )}
            <div className="flex-3 text-sm opacity-70">{formatRelativeDate(item.added_at as string)}</div>
            <div
                className="flex-1 pr-6 text-sm opacity-70 flex items-center gap-5"
                style={{justifyContent: isHovered ? "space-between" : "end"}}
            >
                {isHovered && (
                    <button onClick={handleSaveTrackForUser} className="hover:scale-110 relative cursor-pointer flex-col items-center flex">
                        <SpotifyIcon icon="Saved" variant={isTrackSaved} color={isTrackSaved ? "oklch(72.3% 0.219 149.579)" : "#99a1af"} />
                    </button>
                )}

                {formatMillisToMinutesSeconds(item.track.duration_ms)}
            </div>
        </div>
    )
}

export default function TrackList({
    type,
    items,
    token,
    contextUri,
    contextIsPublic,
}: {
    items: SimplifiedTrack[] | PlaylistTrackCustom[]
    token: string
    contextUri: string
    contextIsPublic?: boolean
    type: "playlist" | "album"
}) {
    switch (type) {
        case "album":
            return (
                <div className="flex flex-col px-2 py-6">
                    {items.map((item, index) => (
                        <AlbumTrackItem key={index} item={item as SimplifiedTrack} index={index} token={token} contextUri={contextUri} />
                    ))}
                </div>
            )
        case "playlist":
            return (
                <div className="flex flex-col px-2 py-6">
                    {items.map((item, index) => (
                        <PlaylistTrackItem
                            contextIsPublic={contextIsPublic as boolean}
                            key={index}
                            item={item as PlaylistTrackCustom}
                            index={index}
                            token={token}
                            contextUri={contextUri}
                        />
                    ))}
                </div>
            )
        default:
            break
    }
}
