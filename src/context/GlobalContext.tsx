"use client"

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react"

interface GlobalContextType {
  foo: string
  setFoo: (value: string) => void
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

export function GlobalContextProvider({ children }: GlobalContextProviderProps) {
  const [foo, setFoo] = useState<string>("")

  return (
    <GlobalContext.Provider value={{ foo, setFoo }}>
      {children}
    </GlobalContext.Provider>
  )
}
