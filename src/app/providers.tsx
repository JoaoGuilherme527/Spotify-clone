"use client"

import { GlobalContextProvider } from "@/context/GlobalContext"
import React, { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <GlobalContextProvider>{children}</GlobalContextProvider>
}
