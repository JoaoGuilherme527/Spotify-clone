"use client"

import {PauseFill, PlayFill, RotateCw, Shuffle} from "@geist-ui/icons"
import {useEffect, useRef, useState} from "react"

interface Track {
    name: string
    artists: {name: string}[]
    album: {images: {url: string}[]}
}

function formatMillisToMinutesSeconds(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export default function PlayerFooter() {
    const [player, setPlayer] = useState<Spotify.Player | null>(null)
    const [isPaused, setIsPaused] = useState(true)
    const [trackPosition, setTrackPosition] = useState(0)
    const [trackDuration, setTrackDuration] = useState(0)
    const [track, setTrack] = useState<Track | null>(null)
    const [isShuffle, setIsShuffle] = useState<boolean | null>()
    const [repeatMode, setRepeatMode] = useState<number>(0)
    const trackBarRef = useRef<HTMLDivElement>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const isSeeking = useRef(false)
    const [client_token, setToken] = useState<string | null>("")
    const nextRepeatMode = (repeatMode + 1) % 3
    const repeatModes = ["off", "context", "track"]
    const apiMode = repeatModes[nextRepeatMode]

    const getCurrentTrackPositionWidth = (ms: number) => {
        if (!trackDuration) return "0%"
        const percentage = (ms / trackDuration) * 100
        return `${percentage}%`
    }

    const onSeek = async (clientX: number) => {
        if (!trackBarRef.current || !player) return
        const rect = trackBarRef.current.getBoundingClientRect()
        const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
        const pct = x / rect.width
        const seekMs = pct * trackDuration
        await player.seek(Math.floor(seekMs))
        setTrackPosition(seekMs)
    }

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("access_token")
        setToken(token)
        if (!token) return

        const script = document.createElement("script")
        script.src = "https://sdk.scdn.co/spotify-player.js"
        script.async = true
        document.body.appendChild(script)

        window.onSpotifyWebPlaybackSDKReady = () => {
            const playerInstance = new Spotify.Player({
                name: "Spotify Clone",
                getOAuthToken: (cb) => cb(token),
                volume: 0.5,
                enableMediaSession: true,
            })

            setPlayer(playerInstance)

            playerInstance.addListener("ready", ({device_id}) => {
                fetch("https://api.spotify.com/v1/me/player", {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        device_ids: [device_id],
                        play: !isPaused,
                    }),
                })
            })

            playerInstance.addListener("player_state_changed", (state: Spotify.WebPlaybackState) => {
                if (!state) return
                setTrackPosition(state.position)
                setTrackDuration(state.duration)
                setIsPaused(state.paused)
                setTrack(state.track_window.current_track)
                setIsShuffle(state.shuffle)
                setRepeatMode(state.repeat_mode)
            })

            playerInstance.connect()
        }

        return () => {
            player?.disconnect()
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    useEffect(() => {
        if (!player || isPaused) return

        intervalRef.current = setInterval(async () => {
            const state = await player.getCurrentState()
            if (state && !isSeeking.current) {
                setTrackPosition(state.position)
            }
        }, 500)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [player, isPaused])

    const togglePlay = () => {
        if (!player) return
        player.togglePlay()
    }

    const playPrevious = () => {
        if (!player) return
        player.previousTrack()
    }

    const playNext = () => {
        if (!player) return
        player.nextTrack()
    }

    async function onShuffle() {
        if (!client_token) return
        try {
            const url = !isShuffle
                ? "https://api.spotify.com/v1/me/player/shuffle?state=true"
                : "https://api.spotify.com/v1/me/player/shuffle?state=false"

            await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${client_token}`,
                    "Content-Type": "application/json",
                },
            })
            setIsShuffle(!isShuffle)
        } catch (err) {
            console.error("Erro ao ativar shuffle:", err)
        }
    }

    async function onRepeat() {
        try {
            await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${apiMode}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${client_token}`,
                },
            })

            setRepeatMode(nextRepeatMode)
        } catch (error) {
            console.error("Erro ao alterar repeat mode:", error)
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        isSeeking.current = true
        onSeek(e.clientX)
        const handleMouseMove = (moveEvent: MouseEvent) => {
            onSeek(moveEvent.clientX)
        }
        const handleMouseUp = (upEvent: MouseEvent) => {
            onSeek(upEvent.clientX)
            isSeeking.current = false
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    return (
        <div className="bg-zinc-950 flex items-center p-3 justify-between">
            <div className="flex-1 items-center gap-3 flex">
                <img src={track?.album.images[0]?.url} alt={track?.name} width={56} height={56} className="rounded bg-zinc-50/5 border-0" />
                <div className="flex flex-col justify-center text-white">
                    <p className="text-sm">{track?.name}</p>
                    <p className="text-xs opacity-50">{track?.artists.map((artist) => artist.name).join(", ")}</p>
                </div>
            </div>

            <div className="flex-2 flex flex-col justify-center gap-1">
                <div className="flex items-center justify-center gap-5">
                    <button onClick={onShuffle} className={`${isShuffle ?? "isShuffleActive"} cursor-pointer flex-col items-center flex gap-1 `}>
                        <Shuffle
                            size={16}
                            color={`${isShuffle ? "oklch(72.3% 0.219 149.579)" : "white"}`}
                            opacity={isShuffle ? "100%" : "60%"}
                            className="hover:scale-110 hover:opacity-100"
                        />
                        {isShuffle && <div className="bg-green-500 w-1 h-1 rounded-full" />}
                    </button>
                    <button onClick={playPrevious} className="cursor-pointer transition-all">
                        <svg
                            data-testid="geist-icon"
                            height="16"
                            strokeLinejoin="round"
                            color="white"
                            viewBox="0 0 16 16"
                            width="16"
                            className="text-white/50 hover:scale-105 hover:text-white transition-all"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.08144 8.21092C3.92706 8.11268 3.92706 7.88733 4.08144 7.78909L14.3658 1.24451C14.5322 1.1386 14.75 1.25815 14.75 1.45542L14.75 14.5446C14.75 14.7419 14.5322 14.8614 14.3658 14.7555L4.08144 8.21092ZM0.75 2V1.25H2.25V2V14V14.75H0.75V14V2Z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </button>
                    <button
                        onClick={togglePlay}
                        className="cursor-pointer bg-white relative text-black p-2 rounded-full hover:scale-105 transition-all"
                    >
                        {isPaused ? <PlayFill size={16} /> : <PauseFill size={16} />}
                    </button>
                    <button onClick={playNext} className="cursor-pointer transition-all">
                        <svg
                            data-testid="geist-icon"
                            height="16"
                            strokeLinejoin="round"
                            color="white"
                            viewBox="0 0 16 16"
                            width="16"
                            className="text-white/50 hover:scale-105 hover:text-white transition-all"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M11.6686 8.21092C11.8229 8.11268 11.8229 7.88733 11.6686 7.78909L1.38422 1.24451C1.21779 1.1386 1 1.25815 1 1.45542V14.5446C1 14.7419 1.21779 14.8614 1.38422 14.7555L11.6686 8.21092ZM15 2V1.25H13.5V2V14V14.75H15V14V2Z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </button>
                    <button onClick={onRepeat} className={`cursor-pointer text-green-500 flex-col items-center flex gap-1 relative`}>
                        <RotateCw
                            size={18}
                            color={repeatMode === 1 || repeatMode === 2 ? `oklch(72.3% 0.219 149.579)` : "white"}
                            opacity={repeatMode === 0 ? "60%" : "100%"}
                            className={`hover:scale-110 transition-all`}
                        />
                        {(repeatMode === 1 || repeatMode === 2) && <div className="bg-green-500 w-1 h-1 rounded-full" />}
                        {repeatMode === 2 && (
                            <span
                                style={{
                                    color: "green",
                                    background: "#09090b",
                                    fontWeight: "700",
                                    fontSize: "15px",
                                }}
                                className="bg-zinc-950 rounded-2xl font-bold absolute top-[-8px] left-1/2 translate-x-[-50%]"
                            >
                                1
                            </span>
                        )}
                    </button>
                </div>

                <div className=" text-white/75 font-extrabold flex items-center gap-4 text-xs px-8 ">
                    <p className="text-right">{formatMillisToMinutesSeconds(trackPosition)}</p>

                    <div
                        className="flex-1 w-full bg-white/20 h-[6px] rounded relative cursor-pointer trackBarHover"
                        ref={trackBarRef}
                        onMouseDown={handleMouseDown}
                    >
                        <div
                            id="trackProgress"
                            style={{width: getCurrentTrackPositionWidth(trackPosition)}}
                            className="bg-white h-full rounded absolute top-0 left-0 transition-all duration-100"
                        />
                    </div>

                    <p className="">{formatMillisToMinutesSeconds(trackDuration)}</p>
                </div>
            </div>

            <div className="flex-1 items-center gap-3 bg-red-300 flex"></div>
        </div>
    )
}
