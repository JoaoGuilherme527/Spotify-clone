import Aside from "@/app/components/Aside"
import Header from "@/app/components/Header"
import PlayerFooter from "@/app/components/Player"
import {GetAccessToken} from "@/lib/actions"
import {GetCurrentUser, GetSaveTracksForUser, GetUserSavedAlbum, GetUserSavedPlaylist} from "@/lib/spotifyActions"

export default async function HomeRoot({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const token = await GetAccessToken()

    const user = await GetCurrentUser(token)
    const albums = await GetUserSavedAlbum(token)
    const playlists = await GetUserSavedPlaylist({token, user_id: user.id})
    const savedTracks = await GetSaveTracksForUser(token)

    return (
        <div className="h-screen overflow-y-hidden flex flex-col bg-zinc-950 ">
            <Header />
            <main className="flex flex-1 rounded gap-[6px] px-2">
                <Aside token={token} albums={albums} playlists={playlists} user={user} savedTracks={savedTracks} />
                <section className="flex-1 rounded-lg bg-zinc-50/5">{children}</section>
            </main>
            <PlayerFooter token={token} />
        </div>
    )
}
