"use client"

import React, {createContext, useContext, useState, type ReactNode} from "react"

interface GlobalContextType {
    currentPLaying: {uri: string; paused: boolean}
    setCurrentPlaying: ({paused, uri}: {uri: string; paused: boolean}) => void
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
    const [currentPLaying, setCurrentPlaying] = useState<{uri: string; paused: boolean}>({uri: "", paused: true})

    return <GlobalContext.Provider value={{currentPLaying, setCurrentPlaying}}>{children}</GlobalContext.Provider>
}
