"use client"
import { CssBaseline, GeistProvider } from "@geist-ui/core"
import PlayerFooter from "./Player"

export default function Dashboard() {
    return (
        <GeistProvider>
            <CssBaseline />
            <div className="h-screen overflow-y-hidden flex flex-col bg-zinc-950 ">
                <header className="h-12"></header>
                <main className="flex flex-1 rounded gap-[6px] px-2">
                    <aside className="w-80 rounded bg-zinc-50/5">aside</aside>
                    <section className="flex-1 rounded bg-zinc-50/5">section</section>
                </main>
                <PlayerFooter />
            </div>
        </GeistProvider>
    )
}
