"use client"

import {useGlobalContext} from "@/context/GlobalContext"
import SpotifyIcon from "@/icons"
import {DeleteTrackForUser, SaveTrackForUser} from "@/lib/spotifyActions"
import {Track} from "@/typings"
import {PauseFill, PlayFill} from "@geist-ui/icons"
import {useEffect, useRef, useState} from "react"

export function formatMillisToMinutesSeconds(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    } else {
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }
}

export default function PlayerFooter({token}: {token: string}) {
    const {setCurrentPlaying, setDeviceId, setPlayerInstanceContext, setPlayerState} = useGlobalContext()

    const [player, setPlayer] = useState<Spotify.Player | null>(null)
    const [isPaused, setIsPaused] = useState(true)
    const [trackPosition, setTrackPosition] = useState(0)
    const [trackDuration, setTrackDuration] = useState(0)
    const [trackState, setTrackState] = useState<Spotify.WebPlaybackTrack | null>(null)
    const [isShuffle, setIsShuffle] = useState<boolean | null>()
    const [repeatMode, setRepeatMode] = useState<number>(0)
    const [client_token, setToken] = useState<string>(token)
    const [volumePercentage, setVolumePercentage] = useState<number | null>(null)
    const [isMuted, setIsMuted] = useState<boolean | null>(volumePercentage && volumePercentage <= 0 ? true : false)
    const [isTrackSaved, setIsTrackSaved] = useState<boolean>(false)
    const trackBarRef = useRef<HTMLDivElement>(null)
    const volumeBarRef = useRef<HTMLDivElement>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const isSeeking = useRef(false)
    const nextRepeatMode = (repeatMode + 1) % 3
    const repeatModes = ["off", "context", "track"]
    const apiMode = repeatModes[nextRepeatMode]

    const getCurrentTrackPositionWidth = (ms: number) => {
        if (!trackDuration) return "0%"
        const percentage = (ms / trackDuration) * 100
        return ms === trackDuration ? `100%` : `${percentage}%`
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

    const onVolume = async (clientX: number) => {
        if (!volumeBarRef.current || !player) return
        const rect = volumeBarRef.current.getBoundingClientRect()
        const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
        const pct = x / rect.width
        const seekMs = pct * 100
        setVolumePercentage(seekMs)
        if (seekMs > 0) {
            setIsMuted(false)
        }
        player.setVolume(pct)
    }

    useEffect(() => {
        if (!token) return

        const script = document.createElement("script")
        script.src = "https://sdk.scdn.co/spotify-player.js"
        script.async = true
        document.body.appendChild(script)

        window.onSpotifyWebPlaybackSDKReady = () => {
            const playerInstance = new Spotify.Player({
                name: "Spotify Clone",
                getOAuthToken: (cb) => cb(token),
                volume: 0.2,
                enableMediaSession: true,
            })

            setPlayer(playerInstance)
            setPlayerInstanceContext(playerInstance)

            playerInstance.addListener("ready", ({device_id}: Spotify.ReadyEvent) => {
                setDeviceId(device_id)
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

            playerInstance.addListener("player_state_changed", async (state: Spotify.WebPlaybackState) => {
                if (!state) return
                setTrackPosition(state.position)
                setTrackDuration(state.duration)
                setIsPaused(state.paused)
                setTrackState(state.track_window.current_track)
                setIsShuffle(state.shuffle)
                setRepeatMode(state.repeat_mode)
                playerInstance.getVolume().then((volume) => {
                    setVolumePercentage(volume * 100)
                })

                const response = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${state.track_window.current_track.id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                const isSavedData = await response.json()
                setIsTrackSaved(isSavedData[0])

                setPlayerState(state)
                setCurrentPlaying({
                    contextUri: state.context.uri as string,
                    paused: state.paused,
                    trackUri: state.track_window.current_track.uri,
                })
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
                if (state.position === state.duration) {
                    setTrackPosition(state.duration)
                } else {
                    setTrackPosition(state.position)
                }
            }
        }, 500)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [player, isPaused])

    const togglePlay = async () => {
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

    const handleMute = () => {
        if (!player || !volumePercentage) return
        player.setVolume(!isMuted ? 0 : volumePercentage / 100)
        setIsMuted(!isMuted)
    }

    async function onShuffle() {
        if (!client_token || !player) return
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

    const handleMouseDownTrackBar = (e: React.MouseEvent) => {
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

    const handleMouseDownVolumeBar = (e: React.MouseEvent) => {
        onVolume(e.clientX)
        const handleMouseMove = (moveEvent: MouseEvent) => {
            onVolume(moveEvent.clientX)
        }
        const handleMouseUp = (upEvent: MouseEvent) => {
            onVolume(upEvent.clientX)
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    const handleSaveTrackForUser = () => {
        if (!trackState) return
        if (isTrackSaved) {
            DeleteTrackForUser([trackState.id as string], client_token)
        } else {
            SaveTrackForUser([trackState.id as string], client_token)
        }
        setIsTrackSaved(!isTrackSaved)
    }

    return (
        <div className="flex items-center p-3 gap-3 justify-between" style={{height: 90}}>
            <div className="flex-1 items-center gap-4 flex">
                {trackState ? (
                    <>
                        <img
                            src={trackState?.album.images[0]?.url}
                            alt={trackState?.name}
                            width={56}
                            height={56}
                            className="rounded bg-zinc-50/5 border-0 w-14"
                        />
                        <div className="flex flex-col justify-center text-white">
                            <p className="text-md ">{trackState?.name}</p>
                            <p className="text-sm opacity-60">{trackState?.artists.map((artist) => artist.name).join(", ")}</p>
                        </div>
                        <button
                            onClick={handleSaveTrackForUser}
                            className="hover:scale-110 relative cursor-pointer flex-col items-center flex"
                        >
                            <SpotifyIcon
                                icon="Saved"
                                variant={isTrackSaved}
                                color={isTrackSaved ? "oklch(72.3% 0.219 149.579)" : "#99a1af"}
                            />
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-center animate-pulse w-14 h-14">
                            <div className="bg-gray-200 w-full h-full rounded" />
                        </div>
                        <div className="grid grid-cols-5 gap-3 grid-rows-2 animate-pulse flex-6 justify-evenly items-center">
                            <div className="col-start-1 col-end-3 h-4 rounded bg-gray-200" />
                            <div className="col-start-1 col-end-2 h-3 rounded bg-gray-400" />
                        </div>
                    </>
                )}
            </div>

            <div className="flex-2 flex flex-col justify-center gap-1">
                <div className="flex items-center justify-center gap-5">
                    <button
                        onClick={onShuffle}
                        className={`${
                            isShuffle && "trackButtonAcitve"
                        } hover:scale-110 relative cursor-pointer flex-col items-center flex gap-1 `}
                    >
                        <SpotifyIcon
                            icon="Shuffle"
                            opacity={isShuffle ? "100%" : "75%"}
                            color={`${isShuffle ? "oklch(72.3% 0.219 149.579)" : "white"}`}
                            className="hover:opacity-100"
                        />
                    </button>
                    <button onClick={playPrevious} className="cursor-pointer transition-all">
                        <SpotifyIcon
                            icon="Previous"
                            className="text-white/75 hover:scale-105 hover:text-white transition-all"
                            color="white"
                        />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="cursor-pointer bg-white relative text-black p-2 rounded-full hover:scale-105 transition-all"
                    >
                        {isPaused ? <PlayFill size={16} /> : <PauseFill size={16} />}
                    </button>
                    <button onClick={playNext} className="cursor-pointer transition-all">
                        <SpotifyIcon icon="Next" className="text-white/75 hover:scale-105 hover:text-white transition-all" color="white" />
                    </button>
                    <button
                        onClick={onRepeat}
                        className={`cursor-pointer hover:scale-110 transition-all text-green-500 flex-col items-center flex gap-1 relative ${
                            repeatMode && "trackButtonAcitve"
                        }`}
                    >
                        <SpotifyIcon
                            icon="Repeat"
                            color={repeatMode ? `oklch(72.3% 0.219 149.579)` : "white"}
                            className="hover:opacity-100"
                            opacity={!repeatMode ? "75%" : "100%"}
                            variant={repeatMode === 2}
                        />
                    </button>
                </div>

                <div className="text-white/75 font-extrabold flex items-center gap-4 text-xs px-8 ">
                    <p className="text-right">{formatMillisToMinutesSeconds(trackPosition)}</p>

                    <div
                        className="flex-1 w-full bg-white/20 h-[6px] rounded relative cursor-pointer trackBarHover"
                        ref={trackBarRef}
                        onMouseDown={handleMouseDownTrackBar}
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

            <div className="flex-1 items-center gap-5 flex w-full h-full justify-end">
                {/* Playing view */}
                <button className="cursor-pointer transition-all w-4 flex items-start ">
                    <SpotifyIcon icon="PlayingScreen" color="white" />
                </button>

                {/* Mic */}
                <button className="cursor-pointer transition-all w-4 flex items-start ">
                    <SpotifyIcon icon="Mic" color="white" />
                </button>

                {/* Queue */}
                <button className="cursor-pointer transition-all w-4 flex items-start ">
                    <SpotifyIcon icon="Queue" color="white" />
                </button>

                {/* Devices */}
                <button className="cursor-pointer transition-all w-4 flex items-start ">
                    <SpotifyIcon icon="OtherDevices" color="white" />
                </button>

                <div className="text-white/75 font-extrabold flex gap-3 items-center h-full w-28 trackBarHover">
                    <button onClick={handleMute} className="cursor-pointer transition-all w-4 flex items-start ">
                        {!isMuted ? (
                            volumePercentage ? (
                                volumePercentage <= 10 ? (
                                    <svg
                                        data-testid="geist-icon"
                                        height="16"
                                        strokeLinejoin="round"
                                        color="white"
                                        viewBox="0 0 16 16"
                                        width="16"
                                        fill="currentColor"
                                    >
                                        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path>
                                    </svg>
                                ) : volumePercentage < 50 ? (
                                    <svg
                                        data-testid="geist-icon"
                                        height="16"
                                        strokeLinejoin="round"
                                        color="white"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        width="16"
                                    >
                                        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z"></path>
                                    </svg>
                                ) : volumePercentage >= 50 ? (
                                    <svg
                                        data-testid="geist-icon"
                                        height="16"
                                        strokeLinejoin="round"
                                        color="white"
                                        viewBox="0 0 16 16"
                                        width="16"
                                        fill="currentColor"
                                    >
                                        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path>
                                        <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path>
                                    </svg>
                                ) : (
                                    <></>
                                )
                            ) : (
                                <svg
                                    data-testid="geist-icon"
                                    height="16"
                                    strokeLinejoin="round"
                                    color="white"
                                    viewBox="0 0 16 16"
                                    width="16"
                                    fill="currentColor"
                                >
                                    <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path>
                                    <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path>
                                </svg>
                            )
                        ) : (
                            <svg
                                data-testid="geist-icon"
                                height="16"
                                strokeLinejoin="round"
                                color="white"
                                viewBox="0 0 16 16"
                                width="16"
                                fill="currentColor"
                            >
                                <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path>
                                <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path>
                            </svg>
                        )}
                    </button>
                    <div
                        className="flex-1 w-full bg-white/20 h-[6px] rounded relative cursor-pointer"
                        ref={volumeBarRef}
                        onMouseDown={handleMouseDownVolumeBar}
                    >
                        <div
                            id="trackProgress"
                            className="bg-white h-full rounded absolute top-0 left-0 transition-all duration-100"
                            style={{width: `${isMuted ? 0 : volumePercentage}%`}}
                        />
                    </div>
                </div>

                {/* FullScreen */}
                <button className="cursor-pointer transition-all w-4 flex items-start ">
                    <SpotifyIcon icon="FullScreen" color="white" />
                </button>
            </div>
        </div>
    )
}
