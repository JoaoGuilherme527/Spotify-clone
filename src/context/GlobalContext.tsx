"use client"

import React, {createContext, useContext, useState, type ReactNode} from "react"

interface GlobalContextType {
    playerState: Spotify.WebPlaybackState | undefined
    setPlayerState: (state: Spotify.WebPlaybackState) => void
    playerInstanceContext: Spotify.Player | undefined
    setPlayerInstanceContext: (state: Spotify.Player) => void
    device_id: string
    setDeviceId: (device_id: string) => void
    currentPLaying: {contextUri: string; paused: boolean; trackUri: string}
    setCurrentPlaying: ({paused, contextUri, trackUri}: {contextUri: string; paused: boolean; trackUri: string}) => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function useGlobalContext() {
    const context = useContext(GlobalContext)
    if (!context) {
        throw new Error("useGlobalContext must be used within GlobalContextProvider")
    }
    return context
}

interface GlobalContextProviderProps {
    children: ReactNode
}

export function GlobalContextProvider({children}: GlobalContextProviderProps) {
    const [currentPLaying, setCurrentPlaying] = useState<{contextUri: string; paused: boolean; trackUri: string}>({
        contextUri: "",
        paused: true,
        trackUri: "",
    })
    const [device_id, setDeviceId] = useState<string>("")
    const [playerInstanceContext, setPlayerInstanceContext] = useState<Spotify.Player>()
    const [playerState, setPlayerState] = useState<Spotify.WebPlaybackState>()

    return (
        <GlobalContext.Provider
            value={{
                currentPLaying,
                setCurrentPlaying,
                device_id,
                setDeviceId,
                playerInstanceContext,
                setPlayerInstanceContext,
                playerState,
                setPlayerState,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
