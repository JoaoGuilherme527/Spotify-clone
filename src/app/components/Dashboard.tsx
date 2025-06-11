import {CssBaseline, GeistProvider} from "@geist-ui/core"
import PlayerFooter from "./Player"
import {HeroUIProvider} from "@heroui/react"
import Aside from "./Aside"
import {GetAccessToken} from "@/lib/actions"

export default async function Dashboard() {
    const token = await GetAccessToken()

    return (
        <div className="h-screen overflow-y-hidden flex flex-col bg-zinc-950 ">
            <header className="h-12"></header>
            <main className="flex flex-1 rounded gap-[6px] px-2">
                <Aside />
                <section className="flex-1 rounded bg-zinc-50/5">section</section>
            </main>
            <PlayerFooter token={token as string} />
        </div>
    )
}
